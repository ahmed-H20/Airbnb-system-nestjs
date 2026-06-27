import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Reservation } from './schemas/reservation.schema';
import { Model } from 'mongoose';
import { ReservationStatus } from './enums/ReservationStatus.enum';
import { User } from 'src/users/schemas/user.schema';
import { NotificationsService } from 'src/notifications/notifications.service';
import { Unit } from 'src/units/schemas/unit.schema';
import { Setting } from 'src/app-settings/schemas/settings.schema';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectModel(Reservation.name)
    private reservationModel: Model<Reservation>,
    @InjectModel(Unit.name) private unitModel: Model<Unit>,
    @InjectModel('Setting') private settingModel: Model<Setting>,
    private readonly notificationsService: NotificationsService,
  ) { }

  async createRequest(createReservationDto: CreateReservationDto, user: User) {
    // 1 — Check dates
    if (createReservationDto.checkInDate >= createReservationDto.checkOutDate) {
      throw new BadRequestException('Check-out date must be after check-in date');
    }

    // 2 — Find the unit and validate guest capacity
    const unit = await this.unitModel.findById(createReservationDto.unit);
    if (!unit) {
      throw new NotFoundException('Unit not found');
    }

    if (!unit.isActive) {
      throw new BadRequestException('This unit is not available for booking');
    }

    const maxGuests = (unit.adultsCount || 0) + (unit.kidsCount || 0);
    const requestedGuests = createReservationDto.numberOfGuests ?? 1;
    if (maxGuests > 0 && requestedGuests > maxGuests) {
      throw new BadRequestException(
        `This unit can accommodate a maximum of ${maxGuests} guests`,
      );
    }

    // 3 — Check no overlapping accepted reservation
    const existingReservation = await this.reservationModel.findOne({
      unit: createReservationDto.unit,
      status: ReservationStatus.ACCEPTED,
      checkInDate: { $lt: createReservationDto.checkOutDate },
      checkOutDate: { $gt: createReservationDto.checkInDate },
    });

    if (existingReservation) {
      throw new ConflictException(
        'Unit is not available for the selected dates',
      );
    }

    // 4 — Calculate total price and VAT
    const numberOfDays = Math.ceil(
      (createReservationDto.checkOutDate.getTime() -
        createReservationDto.checkInDate.getTime()) /
      (1000 * 60 * 60 * 24),
    );

    const totalPrice = createReservationDto.pricePerNight * numberOfDays;

    // Get VAT from app settings
    const settings = await this.settingModel.findOne();
    const vatRate = settings?.vatRate ?? 0;
    const vatAmount = (totalPrice * vatRate) / 100;

    const newReservation = await this.reservationModel.create({
      ...createReservationDto,
      user: user._id,
      totalPrice,
      vatAmount,
      numberOfGuests: requestedGuests,
    });

    return {
      unit: newReservation.unit.toString(),
      numberOfDays: numberOfDays,
      price: newReservation.totalPrice,
      checkInDate: newReservation.checkInDate,
      checkOutDate: newReservation.checkOutDate,
      pricePerNight: newReservation.pricePerNight
    };;
  }

  findAll(user: User) {
    return this.reservationModel
      .find({
        status: { $ne: ReservationStatus.CANCELLED },
        user: user._id,
      })
      .populate('unit', 'name address costPerDay')
      .populate('user', 'name email');
  }

  findOne(id: string) {
    return this.reservationModel
      .findById(id)
      .populate('unit', 'name address costPerDay owner')
      .populate('user', 'name email phoneNumber');
  }

  // ===============================

  async updatePendingReservation(
    id: string,
    updateReservationDto: UpdateReservationDto,
    user: User,
  ) {
    const reservation = await this.reservationModel.findById(id);

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    // Ensure the guest owns this reservation
    if (reservation.user.toString() !== (user._id as string).toString()) {
      throw new ForbiddenException(
        'You are not allowed to update this reservation',
      );
    }

    if (reservation.status !== ReservationStatus.PENDING) {
      throw new BadRequestException('Only pending reservations can be updated');
    }

    Object.assign(reservation, updateReservationDto);

    if (reservation.checkOutDate <= reservation.checkInDate) {
      throw new BadRequestException(
        'Check-out date must be after check-in date',
      );
    }

    const numberOfDays = Math.ceil(
      (reservation.checkOutDate.getTime() - reservation.checkInDate.getTime()) /
      (1000 * 60 * 60 * 24),
    );

    reservation.totalPrice = reservation.pricePerNight * numberOfDays;

    // Recalculate VAT
    const settings = await this.settingModel.findOne();
    const vatRate = settings?.vatRate ?? 0;
    reservation.vatAmount = (reservation.totalPrice * vatRate) / 100;

    return await reservation.save();
  }

  // ===================================

  async acceptReservation(id: string) {
    const reservation = await this.reservationModel.findById(id);

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    if (reservation.status !== ReservationStatus.PENDING) {
      throw new BadRequestException('Only pending reservations can be accepted');
    }

    reservation.status = ReservationStatus.ACCEPTED;
    await reservation.save();

    // 🔔 Notify the guest that reservation was accepted
    await this.notificationsService.notifyReservationStatusChange({
      recipientId: reservation.user.toString(),
      reservationId: reservation._id.toString(),
      status: ReservationStatus.ACCEPTED,
    });

    return reservation;
  }

  // ===================================

  async declineReservation(id: string) {
    const reservation = await this.reservationModel.findById(id);

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    if (reservation.status !== ReservationStatus.PENDING) {
      throw new BadRequestException(
        'Only pending reservations can be declined',
      );
    }

    reservation.status = ReservationStatus.DECLINED;
    await reservation.save();

    return reservation;
  }

  //=====================================

  async completeAcceptedReservation(id: string) {
    const updatedReservation = await this.reservationModel.findById(id);

    if (!updatedReservation) {
      throw new NotFoundException('Reservation not found');
    }

    if (
      updatedReservation.status.toString() !==
      ReservationStatus.ACCEPTED.toString()
    ) {
      throw new BadRequestException('Only accepted reservations can be completed');
    }
    updatedReservation.status = ReservationStatus.COMPLETED;
    await updatedReservation.save();

    // 🔔 Notify the guest that reservation is completed
    await this.notificationsService.notifyReservationStatusChange({
      recipientId: updatedReservation.user.toString(),
      reservationId: updatedReservation._id.toString(),
      status: ReservationStatus.COMPLETED,
    });

    return updatedReservation;
  }

  //=====================================

  async cancelAcceptedReservation(id: string) {
    const updatedReservation = await this.reservationModel.findById(id);

    if (!updatedReservation) {
      throw new NotFoundException('Reservation not found');
    }
    if (
      updatedReservation.status.toString() !==
      ReservationStatus.ACCEPTED.toString()
    ) {
      throw new BadRequestException('Only accepted reservations can be cancelled');
    }
    updatedReservation.status = ReservationStatus.CANCELLED;
    await updatedReservation.save();

    // 🔔 Notify the guest that reservation is cancelled
    await this.notificationsService.notifyReservationStatusChange({
      recipientId: updatedReservation.user.toString(),
      reservationId: updatedReservation._id.toString(),
      status: ReservationStatus.CANCELLED,
    });

    return updatedReservation;
  }

  //=====================================

  remove(id: string) {
    return this.reservationModel.findByIdAndDelete(id);
  }
}

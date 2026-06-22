import {
  BadRequestException,
  ConflictException,
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

@Injectable()
export class ReservationsService {
  constructor(
    @InjectModel(Reservation.name) private reservationModel: Model<Reservation>,
    private readonly notificationsService: NotificationsService,
  ) {}

  async createRequest(createReservationDto: CreateReservationDto, user: User) {
    // find the unit reservated in the given date range
    const existingReservation = await this.reservationModel.findOne({
      unit: createReservationDto.unit,
      status: ReservationStatus.ACCEPTED,

      checkInDate: {
        $lt: createReservationDto.checkOutDate,
      },

      checkOutDate: {
        $gt: createReservationDto.checkInDate,
      },
    });

    if (existingReservation) {
      throw new ConflictException(
        'Unit is not available for the selected dates',
      );
    }

    if (createReservationDto.checkInDate >= createReservationDto.checkOutDate) {
      throw new Error('Check-out date must be after check-in date');
    }

    const newReservation = new this.reservationModel({
      ...createReservationDto,
      user: user._id,
    });

    await newReservation.save();

    return createReservationDto;
  }

  findAll(user: User) {
    return this.reservationModel.find({
      status: {
        $ne: ReservationStatus.CANCELLED,
      },
      user: user._id,
    });
  }

  findOne(id: string) {
    return this.reservationModel.findById(id);
  }

  // ===============================

  async updatePendingReservation(
    id: string,
    updateReservationDto: UpdateReservationDto,
  ) {
    const reservation = await this.reservationModel.findById(id);

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
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

    return await reservation.save();
  }

  //=====================================

  async completeAcceptedReservation(id: string) {
    const updatedReservation = await this.reservationModel.findById(id);

    if (!updatedReservation) {
      throw new Error('Reservation not found');
    }

    if (
      updatedReservation.status.toString() !==
      ReservationStatus.ACCEPTED.toString()
    ) {
      throw new Error('Only accepted reservations can be completed');
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
      throw new Error('Reservation not found');
    }
    if (
      updatedReservation.status.toString() !==
      ReservationStatus.ACCEPTED.toString()
    ) {
      throw new Error('Only accepted reservations can be cancelled');
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

  // Guest
  // update pending reservation or cancel reservation
  // Host
  // update pending reservation or cancel reservation
  // or cancel accepted reservation or complete accepted reservation
}

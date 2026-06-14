import { ConflictException, Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Reservation } from './schemas/reservation.schema';
import { Model } from 'mongoose';
import { ReservationStatus } from './enums/ReservationStatus.enum';
import { User } from 'src/users/schemas/user.schema';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectModel(Reservation.name) private reservationModel: Model<Reservation>,
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
      totalPrice:
        createReservationDto.numberOfDays * createReservationDto.price,
      pricePerNight: createReservationDto.price,
      user: user._id,
    });
    await newReservation.save();

    return createReservationDto;
  }

  findAll() {
    return this.reservationModel.find();
  }

  findOne(id: number) {
    return this.reservationModel.findById(id);
  }

  // ===============================

  async updatePendingReservation(
    id: number,
    updateReservationDto: UpdateReservationDto,
  ) {
    const updatedReservation = await this.reservationModel.findById(id);

    if (!updatedReservation) {
      throw new Error('Reservation not found');
    }

    if (updatedReservation.status.toString() !== 'pending') {
      throw new Error('Only pending reservations can be updated');
    }

    Object.assign(updatedReservation, updateReservationDto);
    return updatedReservation.save();
  }

  //=====================================

  async completeAcceptedReservation(id: number) {
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
    return updatedReservation.save();
  }

  //=====================================

  async cancelAcceptedReservation(id: number) {
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
    return updatedReservation.save();
  }

  //=====================================

  remove(id: number) {
    return this.reservationModel.findByIdAndDelete(id);
  }

  // Guest
  // update pending reservation or cancel reservation
  // Host
  // update pending reservation or cancel reservation
  // or cancel accepted reservation or complete accepted reservation
}

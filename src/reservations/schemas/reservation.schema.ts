import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';
import { ReservationStatus } from '../enums/ReservationStatus.enum';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Reservation {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  user!: Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Unit',
    required: true,
  })
  unit!: Types.ObjectId;

  @Prop({ required: true })
  checkInDate!: Date;

  @Prop({ required: true })
  checkOutDate!: Date;

  @Prop({ required: true })
  pricePerNight!: number;

  @Prop({ required: true })
  totalPrice!: number;

  @Prop({ default: 0 })
  vatAmount!: number;

  @Prop({ default: 1, min: 1 })
  numberOfGuests!: number;

  @Prop({
    enum: ReservationStatus,
    default: ReservationStatus.PENDING,
  })
  status!: ReservationStatus;
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);
export type ReservationDocument = Reservation & Document;


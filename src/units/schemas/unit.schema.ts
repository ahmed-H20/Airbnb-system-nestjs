import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UnitType } from '../enums/unit-types.enum';
import { HydratedDocument, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Unit {
  @Prop({ unique: true, length: [5, 100], required: true, index: true })
  name!: string;

  @Prop({ required: true })
  description!: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  owner!: string;

  @Prop()
  address!: string;

  @Prop()
  photos!: [string];

  @Prop()
  costPerDay!: number;

  @Prop({ default: true })
  available!: boolean;

  @Prop()
  unitType!: UnitType;

  @Prop({ type: Types.ObjectId, ref: 'Category' })
  category!: string;

  @Prop({ type: Types.ObjectId, ref: 'Country' })
  country!: string;

  @Prop({ type: Types.ObjectId, ref: 'City' })
  city!: string;

  @Prop({ min: 1 })
  roomCount!: number;

  @Prop()
  adultsCount!: number;

  @Prop()
  kidsCount?: number;

  @Prop({ default: false })
  hasInternetService?: boolean;

  @Prop({ default: false })
  hasKitchen!: boolean;

  @Prop({ default: false })
  hasPrivateGarage!: boolean;

  @Prop({ default: true })
  isActive!: boolean;

  // Currency reference
  @Prop({ type: Types.ObjectId, ref: 'Currency', default: null })
  currency?: string;

  // Computed rating fields (updated when reviews are added)
  @Prop({ default: 0, min: 0, max: 5 })
  averageRating!: number;

  @Prop({ default: 0, min: 0 })
  reviewsCount!: number;
}

export const unitSchema = SchemaFactory.createForClass(Unit);
export type unitDocument = HydratedDocument<Unit>;


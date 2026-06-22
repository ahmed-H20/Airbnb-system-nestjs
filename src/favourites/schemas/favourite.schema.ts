import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Favourite {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Unit', required: true })
  unit!: Types.ObjectId;
}

export const FavouriteSchema = SchemaFactory.createForClass(Favourite);

// Compound index to prevent duplicate favourites and speed up lookups
FavouriteSchema.index({ user: 1, unit: 1 }, { unique: true });

export type FavouriteDocument = HydratedDocument<Favourite>;

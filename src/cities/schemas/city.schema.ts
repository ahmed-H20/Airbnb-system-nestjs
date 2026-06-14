import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class City {
  @Prop()
  name!: string;

  @Prop({ type: Types.ObjectId, ref: 'Country' })
  country!: string;
}

export const CitiesSchema = SchemaFactory.createForClass(City);
CitiesSchema.index({ name: 1, country: 1 }, { unique: true });

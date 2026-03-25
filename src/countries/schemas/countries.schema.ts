import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class Country {
  @Prop({ required: [true, 'country name is required'] })
  name: string;

  @Prop({ required: [true, ' of user is required'], unique: true })
  code: string;
}

export const CountrySchema = SchemaFactory.createForClass(Country);
export type CountryDocument = HydratedDocument<Country>;

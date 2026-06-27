import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class Setting extends Document {
    @Prop({ required: true, default: 100, min: 0 })
    minPrice: number;

    @Prop({ required: true, default: 14, min: 0 })
    vatRate: number;
}

export const SettingSchema = SchemaFactory.createForClass(Setting);
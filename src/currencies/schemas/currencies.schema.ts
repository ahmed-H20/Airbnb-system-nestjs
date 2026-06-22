import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Currency {
    @Prop({ trim: true, unique: true, required: true })
    name: string;

    @Prop({ trim: true, required: true, unique: true, uppercase: true })
    code: string;

    @Prop({ trim: true, required: true, unique: true })
    symbol: string;

    @Prop()
    rate: number;

}

export const CurrencySchema = SchemaFactory.createForClass(Currency);


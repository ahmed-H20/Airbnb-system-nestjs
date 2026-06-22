import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ReviewDocument = Review & Document;

@Schema()
export class Review {

    @Prop({ required: true, min: 1, max: 5 })
    rating: number;

    @Prop({ required: true, minlength: 20, maxlength: 1000 })
    comment: string;

    @Prop({ required: true, type: Types.ObjectId, ref: 'Unit' })
    unit: Types.ObjectId;

    @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
    user: Types.ObjectId;

    @Prop({ required: true, type: Types.ObjectId, ref: 'Reservation' })
    reservation: Types.ObjectId;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);

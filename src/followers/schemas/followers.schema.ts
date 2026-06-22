import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema()
export class Follow {
    @Prop({
        required: true,
        type: Types.ObjectId,
        ref: 'User',
    })
    follower: Types.ObjectId;

    @Prop({
        required: true,
        type: Types.ObjectId,
        ref: 'User',
    })
    following: Types.ObjectId;
}

const FollowSchema = SchemaFactory.createForClass(Follow);
FollowSchema.index({ follower: 1, following: 1 }, { unique: true });


export { FollowSchema };

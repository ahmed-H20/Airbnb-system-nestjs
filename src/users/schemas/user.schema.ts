import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Role } from 'src/auth/enums/role.enum';

@Schema({ timestamps: true })
export class User {
  _id?: string;

  @Prop({ required: [true, 'user name of user is required'] })
  name!: string;

  @Prop({ required: [true, 'email of user is required'], unique: true })
  email!: string;

  @Prop({ required: [true, 'password of user is required'] })
  password!: string;

  @Prop({ required: [true, 'phoneNumber of user is required'], unique: true })
  phoneNumber!: string;

  @Prop({ default: Role.User, type: String, enum: Role })
  role!: Role;

  @Prop({ default: null })
  profilePicture?: string;

  @Prop({ default: false })
  isBlocked!: boolean;

  // OTP fields for forgot-password flow
  @Prop({ default: null })
  otp?: string;

  @Prop({ default: null })
  otpExpiry?: Date;
}

export type UserDocument = HydratedDocument<User>; // Create mongoose Document
export const UserSchema = SchemaFactory.createForClass(User);

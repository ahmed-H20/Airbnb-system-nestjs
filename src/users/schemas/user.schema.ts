import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Role } from 'src/auth/enums/role.enum';

@Schema()
export class User {
  @Prop({ required: [true, 'user name of user is required'] })
  name: string;

  @Prop({ required: [true, 'email of user is required'], unique: true })
  email: string;

  @Prop({ required: [true, 'password of user is required'] })
  password: string;

  @Prop({ required: [true, 'phoneNumber of user is required'], unique: true })
  phoneNumber: string;

  @Prop({ default: Role.User, type: String, enum: Role })
  role: Role;
}

export type UserDocument = HydratedDocument<User>; // Create mongoose Document
export const UserSchema = SchemaFactory.createForClass(User);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Admin {
  _id: string;

  @Prop({ minLength: 3 })
  name: string;

  @Prop({ unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop()
  active: boolean;

  @Prop()
  role: string;

  @Prop({ default: false })
  isSuperAdmin: boolean;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);

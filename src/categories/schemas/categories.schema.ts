import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class Category {
  @Prop({
    required: true,
    unique: true,
    trim: true,
    minlength: 2,
    maxlength: 50,
  })
  name!: string;

  @Prop({
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  })
  slug!: string;

  @Prop({
    type: String,
    default: null,
  })
  photos?: string;

  @Prop({
    type: String,
    maxlength: 300,
  })
  description?: string;

  @Prop({
    default: true,
  })
  isActive?: boolean;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
  })
  createdBy!: Types.ObjectId;
}

export const CategoriesSchema = SchemaFactory.createForClass(Category);

CategoriesSchema.pre('save', function () {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, '-');
  }
});

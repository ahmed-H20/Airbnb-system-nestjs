import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './schemas/categories.schema';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) {}

  create = async (createCategoryDto: CreateCategoryDto): Promise<Category> => {
    const createdCategory = new this.categoryModel(createCategoryDto);
    return createdCategory.save();
  };

  findAll = async (): Promise<Category[]> => {
    return this.categoryModel.find().exec();
  };

  findOne = async (id: string): Promise<Category> => {
    const category = await this.categoryModel.findById(id).exec();
    if (!category) {
      throw new Error(`Category with id ${id} not found`);
    }
    return category;
  };

  update = async (
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> => {
    const updatedCategory = await this.categoryModel
      .findByIdAndUpdate(id, updateCategoryDto, {
        new: true,
      })
      .exec();
    if (!updatedCategory) {
      throw new Error(`Category with id ${id} not found`);
    }
    return updatedCategory;
  };

  delete = async (id: string): Promise<void> => {
    const result = await this.categoryModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new Error(`Category with id ${id} not found`);
    }
  };
}

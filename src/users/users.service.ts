import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  // Create new user
  createUser = async (user: CreateUserDto): Promise<User> => {
    const newUser = await this.userModel.create(user);
    return newUser;
  };

  // Get all users
  getAllUsers = async (): Promise<User[]> => {
    const users = await this.userModel.find();
    return users;
  };

  // Get one user
  getUserById = async (id: string): Promise<User> => {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException(`there is no user for this id: ${id}`);
    }
    return user;
  };

  // Update user
  updateUser = async (
    id: string,
    UpdateUserdata: UpdateUserDto,
  ): Promise<User> => {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      UpdateUserdata,
      { new: true },
    );

    if (!updatedUser) {
      throw new NotFoundException(`there is no user for this id: ${id}`);
    }

    return updatedUser;
  };

  // Delete user
  deleteUser = async (id: string): Promise<object> => {
    const user = await this.userModel.findByIdAndDelete(id);
    if (!user) {
      throw new NotFoundException(`There is no user for this id: ${id}`);
    }
    return {
      message: `User with id: ${id} deleted successfully✅`,
    };
  };
}

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UpdateProfileDto } from './dtos/update-profile.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private configService: ConfigService,
  ) {}

  // Create new user
  createUser = async (user: CreateUserDto): Promise<UserDocument> => {
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

  getUser = async (obj: object): Promise<User> => {
    const user = await this.userModel.findOne(obj);
    if (!user) {
      throw new NotFoundException(`there is no user`);
    }
    return user;
  };

  // Update user (admin)
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

  // ============ Self-Service Profile ============

  // View own profile
  getMyProfile = async (id: string): Promise<User> => {
    const user = await this.userModel
      .findById(id)
      .select('-password -otp -otpExpiry');
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  };

  // Edit own profile (name, phoneNumber, profilePicture)
  updateMyProfile = async (
    id: string,
    dto: UpdateProfileDto,
  ): Promise<User> => {
    const user = await this.userModel
      .findByIdAndUpdate(id, dto, { new: true })
      .select('-password -otp -otpExpiry');
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  };

  // Change own password
  changePassword = async (
    id: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<object> => {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      throw new BadRequestException('Old password is incorrect');
    }

    const saltRounds = Number(this.configService.get<number>('SALT_ROUNDS'));
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    await this.userModel.findByIdAndUpdate(id, { password: hashedPassword });

    return { message: 'Password changed successfully ✅' };
  };

  // ============ Admin: Block / Unblock ============

  blockUser = async (id: string): Promise<User> => {
    const user = await this.userModel.findByIdAndUpdate(
      id,
      { isBlocked: true },
      { new: true },
    ).select('-password -otp -otpExpiry');
    if (!user) {
      throw new NotFoundException(`No user found for id: ${id}`);
    }
    return user;
  };

  unblockUser = async (id: string): Promise<User> => {
    const user = await this.userModel.findByIdAndUpdate(
      id,
      { isBlocked: false },
      { new: true },
    ).select('-password -otp -otpExpiry');
    if (!user) {
      throw new NotFoundException(`No user found for id: ${id}`);
    }
    return user;
  };
}

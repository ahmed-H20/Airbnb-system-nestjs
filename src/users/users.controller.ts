import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './schemas/user.schema';
import { ParseMongoIdPipe } from 'src/mongo-db/pipes/parse-mongo-id.pipe';
import { UpdateUserDto } from './dtos/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  // Create new user
  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.createUser(createUserDto);
  }

  // Get all users
  @Get()
  getAll(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  // Get one user
  @Get(':id')
  getOne(@Param('id', ParseMongoIdPipe) id: string): Promise<User> {
    return this.userService.getUserById(id);
  }

  // Update user
  @Put('/:id')
  updateOne(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateUser: UpdateUserDto,
  ): Promise<User> {
    return this.userService.updateUser(id, updateUser);
  }

  // Delete user
  @Delete('/:id')
  deleteOne(@Param('id', ParseMongoIdPipe) id: string): Promise<object> {
    return this.userService.deleteUser(id);
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './schemas/user.schema';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UpdateProfileDto } from './dtos/update-profile.dto';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { RequestWithUser } from 'src/common/interfaces/request-with-user.interface';

@ApiBearerAuth('JWT-token')
@UseGuards(AuthGuard, RolesGuard)
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  // ============ Self-Service Profile Routes (any authenticated user) ============

  @Get('me')
  @Roles(Role.User, Role.Guest, Role.Host, Role.Admin)
  getMyProfile(@Req() req: RequestWithUser): Promise<User> {
    return this.userService.getMyProfile(req.user._id as string);
  }

  @Patch('me')
  @Roles(Role.User, Role.Guest, Role.Host, Role.Admin)
  updateMyProfile(
    @Req() req: RequestWithUser,
    @Body() dto: UpdateProfileDto,
  ): Promise<User> {
    return this.userService.updateMyProfile(req.user._id as string, dto);
  }

  @Patch('me/change-password')
  @Roles(Role.User, Role.Guest, Role.Host, Role.Admin)
  changePassword(
    @Req() req: RequestWithUser,
    @Body() dto: ChangePasswordDto,
  ): Promise<object> {
    return this.userService.changePassword(
      req.user._id as string,
      dto.oldPassword,
      dto.newPassword,
    );
  }

  // ============ Admin Routes ============

  @Roles(Role.Admin)
  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.createUser(createUserDto);
  }

  @Roles(Role.Admin)
  @Get()
  getAll(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  @Roles(Role.Admin)
  @Get(':id')
  getOne(@Param('id', ParseMongoIdPipe) id: string): Promise<User> {
    return this.userService.getUserById(id);
  }

  @Roles(Role.Admin)
  @Put('/:id')
  updateOne(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateUser: UpdateUserDto,
  ): Promise<User> {
    return this.userService.updateUser(id, updateUser);
  }

  @Roles(Role.Admin)
  @Delete('/:id')
  deleteOne(@Param('id', ParseMongoIdPipe) id: string): Promise<object> {
    return this.userService.deleteUser(id);
  }

  @Roles(Role.Admin)
  @Patch('/:id/block')
  blockUser(@Param('id', ParseMongoIdPipe) id: string): Promise<User> {
    return this.userService.blockUser(id);
  }

  @Roles(Role.Admin)
  @Patch('/:id/unblock')
  unblockUser(@Param('id', ParseMongoIdPipe) id: string): Promise<User> {
    return this.userService.unblockUser(id);
  }
}

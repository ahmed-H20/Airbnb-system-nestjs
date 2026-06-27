import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { Role } from 'src/auth/enums/role.enum';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import type { RequestWithUser } from 'src/common/interfaces/request-with-user.interface';
import { SendAdminNotificationDto } from './dtos/send-admin-notification.dto';
import { SendGroupNotificationDto } from './dtos/send-group-notification.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/users/schemas/user.schema';
import { Model } from 'mongoose';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth('JWT-token')
@ApiTags('Notifications')
@UseGuards(AuthGuard, RolesGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  // 🔹 View notification history (for logged-in users)
  @Roles(Role.User, Role.Host, Role.Guest)
  @Get()
  @ApiOperation({ summary: 'Get my notifications' })
  async getMyNotifications(@Req() request: RequestWithUser) {
    const { user } = request;
    return this.notificationsService.getUserNotifications(user._id as string);
  }

  // 🔹 Mark a single notification as read
  @Roles(Role.User, Role.Host, Role.Guest)
  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark notification as read' })
  async markAsRead(
    @Param('id') id: string,
    @Req() request: RequestWithUser,
  ) {
    const { user } = request;
    return this.notificationsService.markAsRead(id, user._id as string);
  }

  // 🔹 Mark all notifications as read
  @Roles(Role.User, Role.Host, Role.Guest)
  @Patch('read-all')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  async markAllAsRead(@Req() request: RequestWithUser) {
    const { user } = request;
    return this.notificationsService.markAllAsRead(user._id as string);
  }

  // 🔹 Admin: send notification to a specific user
  @Roles(Role.Admin)
  @Post('admin/send')
  @ApiOperation({ summary: 'Admin sends notification to a specific user' })
  async sendAdminNotification(
    @Body() sendAdminNotificationDto: SendAdminNotificationDto,
  ) {
    return this.notificationsService.sendAdminNotification(
      sendAdminNotificationDto,
    );
  }

  // 🔹 Admin: send notification to a group (all / hosts / guests)
  @Roles(Role.Admin)
  @Post('admin/send-group')
  @ApiOperation({
    summary: 'Admin sends notification to a group (all, hosts, or guests)',
  })
  async sendGroupNotification(@Body() dto: SendGroupNotificationDto) {
    return this.notificationsService.sendGroupNotification({
      group: dto.group,
      title: dto.title,
      message: dto.message,
      userModel: this.userModel,
    });
  }
}

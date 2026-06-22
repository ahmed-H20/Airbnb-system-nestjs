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

@UseGuards(AuthGuard, RolesGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  // 🔹 View notification history (for logged-in users)
  @Roles(Role.User, Role.Host, Role.Guest)
  @Get()
  async getMyNotifications(@Req() request: RequestWithUser) {
    const { user } = request;
    return this.notificationsService.getUserNotifications(user._id as string);
  }

  // 🔹 Mark a single notification as read
  @Roles(Role.User, Role.Host, Role.Guest)
  @Patch(':id/read')
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
  async markAllAsRead(@Req() request: RequestWithUser) {
    const { user } = request;
    return this.notificationsService.markAllAsRead(user._id as string);
  }

  // 🔹 Admin sends a notification to a user
  @Roles(Role.Admin)
  @Post('admin/send')
  async sendAdminNotification(
    @Body() sendAdminNotificationDto: SendAdminNotificationDto,
  ) {
    return this.notificationsService.sendAdminNotification(
      sendAdminNotificationDto,
    );
  }
}

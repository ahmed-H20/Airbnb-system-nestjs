import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Notification } from './schemas/notification.schema';
import { NotificationType } from './enums/notification-type.enum';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<Notification>,
  ) { }

  /**
   * Create a notification (used internally by the system).
   */
  create = async (data: {
    recipientId: string;
    title: string;
    message: string;
    type: NotificationType;
    reservationId?: string;
  }): Promise<Notification> => {
    const notification = await this.notificationModel.create({
      recipient: new Types.ObjectId(data.recipientId),
      title: data.title,
      message: data.message,
      type: data.type,
      reservation: data.reservationId
        ? new Types.ObjectId(data.reservationId)
        : undefined,
    });

    return notification;
  };

  /**
   * Send a notification from admin to a specific user.
   */
  sendAdminNotification = async (data: {
    recipientId: string;
    title: string;
    message: string;
  }): Promise<Notification> => {
    return this.create({
      recipientId: data.recipientId,
      title: data.title,
      message: data.message,
      type: NotificationType.ADMIN_MESSAGE,
    });
  };

  /**
   * Get all notifications for a specific user (sorted newest first).
   */
  getUserNotifications = async (userId: string): Promise<Notification[]> => {
    return this.notificationModel
      .find({ recipient: new Types.ObjectId(userId) })
      .populate('reservation')
      .sort({ createdAt: -1 });
  };

  /**
   * Mark a single notification as read.
   */
  markAsRead = async (
    notificationId: string,
    userId: string,
  ): Promise<Notification | null> => {
    return this.notificationModel.findOneAndUpdate(
      {
        _id: new Types.ObjectId(notificationId),
        recipient: new Types.ObjectId(userId),
      },
      { isRead: true },
      { new: true },
    );
  };

  /**
   * Mark all notifications as read for a user.
   */
  markAllAsRead = async (userId: string): Promise<object> => {
    const result = await this.notificationModel.updateMany(
      {
        recipient: new Types.ObjectId(userId),
        isRead: false,
      },
      { isRead: true },
    );

    return {
      message: `${result.modifiedCount} notifications marked as read ✅`,
    };
  };

  /**
   * Notify the guest when host accepts/completes a reservation.
   */
  notifyReservationStatusChange = async (data: {
    recipientId: string;
    reservationId: string;
    status: string;
    unitName?: string;
  }): Promise<Notification> => {
    const statusMessages: Record<string, { title: string; message: string }> = {
      accepted: {
        title: 'Reservation Accepted',
        message: `Your reservation${data.unitName ? ` for "${data.unitName}"` : ''} has been accepted by the host.`,
      },
      completed: {
        title: 'Reservation Completed',
        message: `Your reservation${data.unitName ? ` for "${data.unitName}"` : ''} has been marked as completed.`,
      },
      cancelled: {
        title: 'Reservation Cancelled',
        message: `Your reservation${data.unitName ? ` for "${data.unitName}"` : ''} has been cancelled.`,
      },
      declined: {
        title: 'Reservation Declined',
        message: `Your reservation${data.unitName ? ` for "${data.unitName}"` : ''} has been declined by the host.`,
      },
    };

    const statusKey = data.status.toLowerCase();
    const { title, message } =
      statusMessages[statusKey] || {
        title: 'Reservation Update',
        message: `Your reservation status has been updated to: ${data.status}`,
      };

    const typeMap: Record<string, NotificationType> = {
      accepted: NotificationType.RESERVATION_ACCEPTED,
      completed: NotificationType.RESERVATION_COMPLETED,
      cancelled: NotificationType.RESERVATION_CANCELLED,
      declined: NotificationType.RESERVATION_CANCELLED,
    };

    return this.create({
      recipientId: data.recipientId,
      title,
      message,
      type: typeMap[statusKey] || NotificationType.RESERVATION_ACCEPTED,
      reservationId: data.reservationId,
    });
  };

  /**
   * Send notification to a group
   */
  sendGroupNotification = async (data: {
    group: 'all' | 'hosts' | 'guests';
    title: string;
    message: string;
    userModel: Model<any>;
  }): Promise<{ sent: number }> => {
    const roleFilter =
      data.group === 'hosts'
        ? 'host'
        : data.group === 'guests'
          ? 'guest'
          : null;

    const query = roleFilter ? { role: roleFilter } : {};
    const users = await data.userModel.find(query).select('_id');

    const notifications = users.map((u) =>
      this.create({
        recipientId: u._id.toString(),
        title: data.title,
        message: data.message,
        type: NotificationType.ADMIN_MESSAGE,
      }),
    );

    await Promise.all(notifications);
    return { sent: users.length };
  };
}


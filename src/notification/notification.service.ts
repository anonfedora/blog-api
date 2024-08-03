import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import {
  Notification,
  NotificationDocument,
} from "./schemas/notification.schema";

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel("Notification")
    private readonly notificationModel: Model<NotificationDocument>
  ) {}

  async createNotification(
    userId: string,
    message: string
  ): Promise<Notification> {
    const newNotification = await this.notificationModel.create({
      userId,
      message,
    });
    return await newNotification.save();
  }

  async getNotificationsForUser(userId: string): Promise<Notification[]> {
    return await this.notificationModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .exec();
    /*return this.notificationModel.find({ userId }).sort({ createdAt: -1 }).exec();*/
  }

  async markAsRead(notificationId: string): Promise<Notification> {
    return this.notificationModel
      .findByIdAndUpdate(notificationId, { isRead: true }, { new: true })
      .exec();
  }
}

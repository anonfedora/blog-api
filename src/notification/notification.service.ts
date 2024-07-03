import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Notification, NotificationDocument } from "./schemas/notification.schema";

@Injectable()
export class NotificationService {
    constructor(
        @InjectModel("Notification") private readonly notificationModel: Model<NotificationDocument>
    ) {}

    async createNotification(userId: string, message: string): Promise<Notification> {
        const newNotification = new this.notificationModel({ userId, message });
        return newNotification.save();
    }

    async getNotificationsForUser(userId: string): Promise<Notification[]> {
        return this.notificationModel.find({ userId }).sort({ createdAt: -1 }).exec();
    }

    async markAsRead(notificationId: string): Promise<Notification> {
        return this.notificationModel.findByIdAndUpdate(notificationId, { isRead: true }, { new: true }).exec();
    }
}
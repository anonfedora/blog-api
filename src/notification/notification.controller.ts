import { Controller, Get, Param, Patch, Body } from "@nestjs/common";
import { NotificationService } from "./notification.service";
import { Notification } from "./schemas/notification.schema";

@Controller("notifications")
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) {}

    @Get(":userId")
    async getUserNotifications(
        @Param("userId") userId: string
    ): Promise<Notification[]> {
        return this.notificationService.getNotificationsForUser(userId);
    }

    @Patch(":notificationId/read")
    async markNotificationAsRead(
        @Param("notificationId") notificationId: string
    ): Promise<Notification> {
        return this.notificationService.markAsRead(notificationId);
    }
}

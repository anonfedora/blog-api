import { Controller, Get, Param, Patch, Body, Req, UseGuards} from "@nestjs/common";
import { NotificationService } from "./notification.service";
import { Notification } from "./schemas/notification.schema";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@Controller("notifications")
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) {}

    @UseGuards(JwtAuthGuard)
    @Get()
    /*@Get(":userId")*/
    async getUserNotifications(
        @Req() req
        /*@Param("userId") userId: string*/
    ): Promise<Notification[]> {
        const userId = req.user.sub;
        return this.notificationService.getNotificationsForUser(userId);
    }

    @Patch(":notificationId/read")
    async markNotificationAsRead(
        @Param("notificationId") notificationId: string
    ): Promise<Notification> {
        return this.notificationService.markAsRead(notificationId);
    }
}

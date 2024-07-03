import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { NotificationService } from "./notification.service";
import { NotificationController } from "./notification.controller";
import { NotificationSchema } from "./schemas/notification.schema";

@Module({
    imports: [MongooseModule.forFeature([{ name: 'Notification', schema: NotificationSchema }])],
    providers: [NotificationService],
    controllers: [NotificationController],
    exports: [NotificationService]
})
export class NotificationModule {}

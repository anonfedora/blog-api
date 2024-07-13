import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { NotificationService } from "./notification.service";
import { NotificationController } from "./notification.controller";
import { NotificationSchema } from "./schemas/notification.schema";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: "Notification", schema: NotificationSchema }
        ]),
        JwtModule.registerAsync({
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get("AUTH_SECRET"),
                signOptions: { expiresIn: configService.get("AUTH_EXPIRES") }
            }),
            inject: [ConfigService] // Inject ConfigService for dynamic configuration
        })
    ],
    providers: [NotificationService, JwtService],
    controllers: [NotificationController],
    exports: [NotificationService]
})
export class NotificationModule {}

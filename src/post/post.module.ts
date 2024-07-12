import { Module } from "@nestjs/common";
import { PostService } from "./post.service";
import { PostController } from "./post.controller";
import { PostSchema } from "./schemas/post.schema";
import { CommentSchema } from "../comment/schemas/comment.schema";
import { MongooseModule } from "@nestjs/mongoose";
import { LoggerModule } from "../logger/logger.module";
import { MulterModule } from "@nestjs/platform-express";
import { CloudinaryModule } from "../cloudinary/cloudinary.module";
import { CloudinaryService } from "../cloudinary/cloudinary.service";
import { NotificationModule } from "../notification/notification.module";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import * as multer from "multer";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: "Post", schema: PostSchema }]),
        MongooseModule.forFeature([{ name: "Comment", schema: CommentSchema }]),
        MulterModule.register({
            storage: multer.memoryStorage()
        }),
        JwtModule.registerAsync({
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get("AUTH_SECRET"),
                signOptions: { expiresIn: configService.get("AUTH_EXPIRES") }
            }),
            inject: [ConfigService] // Inject ConfigService for dynamic configuration
        }),
        LoggerModule,
        CloudinaryModule,
        NotificationModule
    ],
    controllers: [PostController],
    providers: [PostService, JwtService, CloudinaryService]
})
export class PostModule {}

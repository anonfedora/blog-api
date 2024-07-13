import { Module } from "@nestjs/common";
import { CommentService } from "./comment.service";
import { CommentController } from "./comment.controller";
import { CommentSchema } from "./schemas/comment.schema";
import { MongooseModule } from "@nestjs/mongoose";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { NotificationModule } from "../notification/notification.module";
import { PostModule } from "../post/post.module";
import { PostSchema } from "../post/schemas/post.schema";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: "Comment", schema: CommentSchema }]),
        MongooseModule.forFeature([{ name: "Post", schema: PostSchema }]),
        JwtModule.registerAsync({
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get("AUTH_SECRET"),
                signOptions: { expiresIn: configService.get("AUTH_EXPIRES") }
            }),
            inject: [ConfigService]
        }),
        NotificationModule,
        PostModule
    ],
    controllers: [CommentController],
    providers: [CommentService, JwtService]
})
export class CommentModule {}

import { Module } from "@nestjs/common";
import { CommentService } from "./comment.service";
import { CommentController } from "./comment.controller";
import { CommentSchema } from "./schemas/comment.schema";
import { MongooseModule } from "@nestjs/mongoose";
import { NotificationModule } from "../notification/notification.module";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: "Comment", schema: CommentSchema }]),
        NotificationModule
    ],
    controllers: [CommentController],
    providers: [CommentService]
})
export class CommentModule {}

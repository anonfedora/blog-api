import { Module } from "@nestjs/common";
import { CommentService } from "./comment.service";
import { CommentController } from "./comment.controller";
import { CommentSchema } from "./schemas/comment.schema";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: "Comment", schema: CommentSchema }])
    ],
    controllers: [CommentController],
    providers: [CommentService]
})
export class CommentModule {}

import { Module } from "@nestjs/common";
import { PostService } from "./post.service";
import { PostController } from "./post.controller";
import { PostSchema } from "./schemas/post.schema";
import { MongooseModule } from "@nestjs/mongoose";
import { LoggerModule } from "../logger/logger.module"

@Module({
    imports: [
        MongooseModule.forFeature([{ name: "Post", schema: PostSchema }]),
        LoggerModule
    ],
    controllers: [PostController],
    providers: [PostService]
})
export class PostModule {}

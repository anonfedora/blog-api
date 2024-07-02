import { Module } from "@nestjs/common";
import { PostService } from "./post.service";
import { PostController } from "./post.controller";
import { PostSchema } from "./schemas/post.schema";
import { MongooseModule } from "@nestjs/mongoose";
import { LoggerModule } from "../logger/logger.module";
import { MulterModule } from "@nestjs/platform-express";
import { CloudinaryModule } from "../cloudinary/cloudinary.module";
import { CloudinaryService } from "../cloudinary/cloudinary.service";
import * as multer from "multer";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: "Post", schema: PostSchema }]),
        MulterModule.register({
            storage: multer.memoryStorage()
        }),
        LoggerModule,
        CloudinaryModule
    ],
    controllers: [PostController],
    providers: [PostService, CloudinaryService]
})
export class PostModule {}

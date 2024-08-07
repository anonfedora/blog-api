import { Module, ValidationPipe } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { PostModule } from "./post/post.module";
import { CommentModule } from "./comment/comment.module";
import { CategoryModule } from "./category/category.module";
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { LoggerModule } from "./logger/logger.module";
import { CloudinaryModule } from "./cloudinary/cloudinary.module";
import { APP_PIPE, APP_GUARD } from "@nestjs/core";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: [".env.localhost", ".env"]
        }),
        ThrottlerModule.forRoot([{ ttl: 60000, limit: 10 }]), //Default, 1min, 10 requests
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                uri: configService.get<string>("MONGO_URI")
            })
        }),
        AuthModule,
        UserModule,
        PostModule,
        CommentModule,
        CategoryModule,
        LoggerModule,
        CloudinaryModule
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_PIPE,
            useClass: ValidationPipe
        },
        {
     provide: APP_GUARD,
     useClass: ThrottlerGuard,
   },
    ]
})
export class AppModule {}

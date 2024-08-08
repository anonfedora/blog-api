import { Module } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { CategoryController } from "./category.controller";
import { CategorySchema } from "./schemas/category.schema";
import { MongooseModule } from "@nestjs/mongoose";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { UserModule } from "src/user/user.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "Category", schema: CategorySchema }]),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get("AUTH_SECRET"),
        signOptions: { expiresIn: configService.get("AUTH_EXPIRES") },
      }),
      inject: [ConfigService],
    }),
    UserModule,
  ],
  controllers: [CategoryController],
  providers: [CategoryService, JwtService],
})
export class CategoryModule {}

import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import * as cookieParser from "cookie-parser";
import validationOptions from "./utils/validation-options";
import { ValidationPipe } from "@nestjs/common";
import { NestExpressApplication } from "@nestjs/platform-express";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(new ValidationPipe(validationOptions));
  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle("Anonfedora's Blog")
    .setDescription(
      "Not-too-large Nest Blog API Documentation with Auth, Authorisation, Post, Comment, Categories, User, Mailer, Image Upload with Cloudinary, Logging, Rate Limitting"
    )
    .setVersion("1.0")
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        in: "header",
      },
      "access_token" //
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup("api", app, document);

  await app.listen(3000);
}
bootstrap();

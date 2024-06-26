import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import * as cookieParser from "cookie-parser";
import validationOptions from "./utils/validation-options";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(new ValidationPipe(validationOptions));
    app.use(cookieParser());

    const config = new DocumentBuilder()
        .setTitle("Anonfedora's Blog")
        .setDescription("Mini Nest Blog API description Documentation")
        .setVersion("0.1")
        .build();

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup("api", app, document);

    await app.listen(3000);
}
bootstrap();

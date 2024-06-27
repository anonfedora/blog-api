import { Module } from "@nestjs/common";
import { LoggerService } from "./logger.service";
import { LoggerController } from "./logger.controller";

@Module({
    providers: [LoggerService],
    exports: [LoggerService],
    controllers: [LoggerController]
})
export class LoggerModule {}

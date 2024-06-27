import { Controller, Get } from "@nestjs/common";
import { LoggerService } from "./logger.service";
import { ApiTags } from "@nestjs/swagger"
@Controller("logger")
export class LoggerController {
    constructor(private readonly logger: LoggerService) {}

@ApiTags("Winston Logger test")
    @Get("info")
    getInfoLog() {
        this.logger.log(
            "This is an INFO log message from the LoggerController.",
            "LoggerController"
        );
        return "Logged an INFO message.";
    }

    @Get("error")
    getErrorLog() {
        this.logger.error(
            "This is an ERROR log message from the LoggerController.",
            null,
            "LoggerController"
        );
        return "Logged an ERROR message.";
    }
}

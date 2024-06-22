import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Req,
    Request,
    Res,
    UseGuards
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ConfigService } from "@nestjs/config";
import { AuthGuard } from "@nestjs/passport";
import { Response } from "express";
import { Public } from "src/utils/decorators/public";
import { NullableType } from "src/utils/types/nullable.type";
import { UserDocument } from "../user/schemas/user.schema";
import { AuthRegisterDto } from "./dto/auth-register.dto";
import { LoginResponseType } from "./types/login-response.type";
import { AuthEmailLoginDto } from "./dto/auth-login.dto";
import ms from "ms";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";

@ApiTags("auth")
@ApiBearerAuth()
@Controller("auth")
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private configService: ConfigService
    ) {}

    @Public()
    @Post("register")
    @HttpCode(HttpStatus.CREATED)
    async register(
        @Body() registerDto: AuthRegisterDto,
        @Res({ passthrough: true }) response: Response,
        
    ): Promise<LoginResponseType> {
        const res = await this.authService.register(registerDto, );

        this.authService.setCookie(
            response,
            "cookie",
            res.token,
            this.configService.getOrThrow("REFRESH_EXPIRE", {
                infer: true
            })
        );
        return res;
    }
}

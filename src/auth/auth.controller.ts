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
    Put,
    Param,
    Query,
    UseGuards
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UserService } from "../user/user.service";
import { ConfigService } from "@nestjs/config";
import { AuthGuard } from "@nestjs/passport";
import { Response } from "express";
import { Public } from "src/utils/decorators/public";
import { NullableType } from "src/utils/types/nullable.type";
import { UserDocument, User } from "../user/schemas/user.schema";
import { AuthRegisterDto } from "./dto/auth-register.dto";
import { LoginResponseType } from "./types/login-response.type";
import { AuthEmailLoginDto } from "./dto/auth-login.dto";
import { AuthConfirmEmailDto } from "./dto/auth-confirm-email.dto";
import { AuthForgotPasswordDto } from "./dto/auth-forgot-password.dto";
import { AuthResetPasswordDto } from "./dto/auth-reset-password.dto";
import { UpdateUserDto } from "../user/dto/update-user.dto";
import ms from "ms";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { RolesGuard } from "./guards/roles.guard";
import { Roles } from "../utils/decorators/roles.decorator";
import { Role } from "../user/enums/role.enum";
import { Throttle } from "@nestjs/throttler";
import { LoggerService } from "../logger/logger.service";

@ApiTags("auth")
@ApiBearerAuth()
@Controller("auth")
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
        private configService: ConfigService,
        private readonly logger: LoggerService
    ) {}

    @Public()
    @Post("register")
    @Throttle({ default: { limit: 9, ttl: 60000 } })
    @HttpCode(HttpStatus.CREATED)
    async register(
        @Body() registerDto: AuthRegisterDto,
        @Res({ passthrough: true }) response: Response
    ): Promise<LoginResponseType> {
        const res = await this.authService.register(registerDto);

        this.authService.setCookie(
            response,
            "access_token",
            res.token,
            this.configService.getOrThrow("REFRESH_EXPIRE", {
                infer: true
            })
        );
        this.logger.log(`Register new user`, "AuthController");
        return res;
    }

    @Public()
    @Post("login")
    @Throttle({ default: { limit: 6, ttl: 60000 } })
    @HttpCode(HttpStatus.OK)
    async login(
        @Request() req,
        @Res({ passthrough: true }) response: Response,
        @Body() loginDto: AuthEmailLoginDto
    ): Promise<LoginResponseType> {
        const res = await this.authService.validateLogin(
            { email: loginDto.email, password: loginDto.password },
            req
        );

        this.authService.setCookie(
            response,
            "access_token",
            res.token,
            this.configService.getOrThrow("REFRESH_EXPIRE", {
                infer: true
            })
        );
        this.logger.log(`User ${loginDto.email} Login`, "AuthController");
        return res;
    }

    // TODO @Body?
    @Public()
    @Post("confirm-email")
    @HttpCode(HttpStatus.OK)
    async confirmEmail(@Query() query: AuthConfirmEmailDto): Promise<void> {
        this.logger.log(`Email confirmation`, "AuthController");
        return this.authService.confirmEmail(query.hash);
    }

    @Public()
    @Throttle({ default: { limit: 3, ttl: 60000 } })
    @Post("forgot/password")
    @HttpCode(HttpStatus.OK)
    async forgotPassword(
        @Body() forgotPasswordDto: AuthForgotPasswordDto
    ): Promise<void> {
        this.logger.log(
            `Forgot Password ${forgotPasswordDto.email}`,
            "AuthController"
        );
        return this.authService.forgotPassword(forgotPasswordDto.email);
    }

    @Public()
    @Post("reset/password")
    @HttpCode(HttpStatus.OK)
    async resetPassword(
        @Query() query: AuthResetPasswordDto,
        @Body() resetPasswordDto: AuthResetPasswordDto
    ): Promise<void> {
        return this.authService.resetPassword(
            query.resetToken,
            resetPasswordDto.password,
            resetPasswordDto.confirmPassword
        );
    }

    // TODO Roles(Guard)
    //@UseGuards(JwtAuthGuard, RolesGuard)
    @Get("me/:id")
    @HttpCode(HttpStatus.OK)
    async me(@Param("id") id: string): Promise<NullableType<UserDocument>> {
        return await this.authService.me(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Put("me/update/:id")
    @HttpCode(HttpStatus.OK)
    async update(
        @Param("id") id: string,
        @Body() updateUserDto: UpdateUserDto
    ): Promise<NullableType<User>> {
        return this.userService.update(id, updateUserDto);
    }
}

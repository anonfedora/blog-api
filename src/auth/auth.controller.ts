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
  Patch,
  Param,
  Query,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UserService } from "../user/user.service";
import { ConfigService } from "@nestjs/config";
import { AuthGuard } from "@nestjs/passport";
import { Response } from "express";
import { Public } from "../utils/decorators/public";
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
import { ApiTags, ApiBearerAuth, ApiResponse } from "@nestjs/swagger";
import { UserResponseDto } from "../user/dto/user-response.dto";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { RolesGuard } from "./guards/roles.guard";
import { Roles } from "../utils/decorators/roles.decorator";
import { Role } from "../user/enums/role.enum";
import { Throttle } from "@nestjs/throttler";
import { LoggerService } from "../logger/logger.service";

@ApiTags("auth")
@ApiBearerAuth("access_token")
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
        infer: true,
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
    @Res({ passthrough: true }) response: Response,
    @Body() loginDto: AuthEmailLoginDto
  ): Promise<LoginResponseType> {
    try {
      const res = await this.authService.validateLogin({
        email: loginDto.email,
        password: loginDto.password,
      });

      this.authService.setCookie(
        response,
        "access_token",
        res.token,
        this.configService.getOrThrow("REFRESH_EXPIRE", {
          infer: true,
        })
      );
      this.logger.log(`User ${loginDto.email} Login`, "AuthController");
      return res;
    } catch (error) {
      this.logger.error(`Login `, error, "AuthController");
      throw new Error("Login error" + error);
    }
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
  @Post("reset/password/:resetToken")
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @Param("resetToken") resetToken: string,
    @Body() resetPasswordDto: AuthResetPasswordDto
  ): Promise<void> {
    return this.authService.resetPassword(
      resetToken,
      resetPasswordDto.password,
      resetPasswordDto.confirmPassword
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get("me")
  @HttpCode(HttpStatus.OK)
  async me(@Req() req): Promise<NullableType<UserDocument>> {
    const userId = req.user.sub;
    return await this.authService.me(userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch("me/update")
  @HttpCode(HttpStatus.CREATED)
  async update(
    @Req() req,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<User> {
    const userId = req.user.sub;
    return this.userService.update(userId, updateUserDto);
  }
}

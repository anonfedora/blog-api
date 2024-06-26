import {
    HttpException,
    Injectable,
    InternalServerErrorException,
    UnauthorizedException,
    NotFoundException
} from "@nestjs/common";
import { UserService } from "../user/user.service";
import * as bcrypt from "bcryptjs";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Request, Response } from "express";
import { UserDocument } from "../user/schemas/user.schema";
import { NullableType } from "src/utils/types/nullable.type";
import ms from "ms";
import * as crypto from "crypto";
import { uid } from "uid";
import { MailService } from "../mail/mail.service";
import { AuthRegisterDto } from "./dto/auth-register.dto";
import { AuthEmailLoginDto } from "./dto/auth-login.dto";
import { JwtPayloadType } from "./strategies/types/jwt-payload.type";
import { LoginResponseType } from "./types/login-response.type";

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private configService: ConfigService,
        private jwtService: JwtService,
        private mailService: MailService
    ) {}

    // TODO - Fix tokenExpiresIn
    async register(authRegisterDto: AuthRegisterDto): Promise<any> {
        const hash = crypto.createHash("sha256").update(uid(21)).digest("hex");
        const user = await this.userService.createUser({
            ...authRegisterDto,
            hash
        });

        await this.mailService.userSignUp({
            to: authRegisterDto.email,
            data: {
                hash
            }
        });
        const { token } = await this.getTokensData({
            id: user.id
        });
        return {
            token,
            user
        };
    }

    // TODO - Change isVerified to true after mail confirmation [confirmEmail]
    async validateLogin(
        loginDto: AuthEmailLoginDto,
        req: Request
    ): Promise<any> {
        const user = await this.userService.validateUser({
            isVerified: false,
            email: loginDto.email
        });

        if (!user) {
            throw new HttpException(
                "Your email has not been confirmed or you have not registered yet!",
                400
            );
        } //

        const isValidPassword = await bcrypt.compare(
            loginDto.password,
            user.password
        );

        if (!isValidPassword) {
            throw new HttpException("Email or Password is incorrect!", 400);
        }

        const { token } = await this.getTokensData({
            id: user.id
        });

        await this.mailService.loginSuccess({
            to: user.email,
            name: user.name
        });

        console.log(isValidPassword, user, token);
        return {
            token,
            user
        };
    }

    async confirmEmail(hash: string): Promise<void> {
        const user = await this.userService.validateUser({
            hash
        });

        if (!user) {
            throw new HttpException("User not found", 404);
        }
        await this.userService.update(user.id, {
            isVerified: true,
            hash: null
        });
    }

    // TODO - ForgotPasswordDto
    async forgotPassword(email: string) {
        const user = await this.userService.findOne({ email });

        if (!user) {
            throw new NotFoundException(
                "There is no user with this email address"
            );
        }

        const resetToken = await this.userService.createPasswordResetToken(
            user.id
        );
        await user.save({ validateBeforeSave: false });

        try {
            await this.mailService.forgotPassword({
                to: user.email,
                data: {
                    resetToken
                }
            });
            /*return { success: true, message: "Token sent to your email!" };*/
        } catch (error) {
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            await user.save({ validateBeforeSave: false });
            throw new InternalServerErrorException(
                "There was an error sending the email."
            );
        }
    }

    // TODO - ResetPasswordDto
    async resetPassword(token: string, password: string, confirmPassword: string) {
        if (!token || typeof token !== "string") {
            throw new NotFoundException("Invalid reset token");
        }
        
        if (password !== confirmPassword) {
          throw new HttpException("Passwords do not match!",400)
        }

        //const hashedToken = hashSync(token, 10); // Hash the token securely
        const user = await this.userService.findOne({
            passwordResetToken: token,
            passwordResetExpires: { $gt: Date.now() } // Find user with matching hashed token and valid expiration
        });

        if (!user) {
            throw new NotFoundException("Invalid or expired reset token");
        }

        user.password = bcrypt.hashSync(password, 10); // Hash the new password securely
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;

        try {
            await this.mailService.resetPassword({
                to: user.email,
                data: null
            });
        } catch (error) {
            throw new InternalServerErrorException(
                "There was an error sending the email."
            );
        }
        await user.save();
        /*return { success: true, message: "Password Reset Successful" };*/
    }

    /*async me(
        userJwtPayload: JwtPayloadType
    ): Promise<NullableType<UserDocument>> {
        return this.userService.findOne({
            _id: userJwtPayload.id
        });
    }*/
    
    async me(
        id: string
    ): Promise<NullableType<UserDocument>> {
        return this.userService.findOne({
            _id: id
        });
    }

    async setCookie(
        res: Response,
        cookieName: string,
        cookieValue: string,
        maxAge: number
    ) {
        const maxAgeInMilliseconds = this.configService.getOrThrow("MAX_AGE");
        res.cookie(cookieName, cookieValue, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: maxAgeInMilliseconds
        });
    }

    // TODO - Fix tokenExpiresIn
    private async getTokensData(data: JwtPayloadType) {
        /*const tokenExpiresIn = this.configService.getOrThrow("AUTH_EXPIRES", {
            infer: true
        });
        const tokenExpires = Number(Date.now() + ms(tokenExpiresIn));*/

        const [token] = await Promise.all([
            await this.jwtService.signAsync(data, {
                secret: this.configService.getOrThrow("AUTH_SECRET", {
                    infer: true
                }),
                expiresIn: this.configService.getOrThrow("AUTH_EXPIRES")
            })
        ]);
        return {
            token
            /*tokenExpires*/
        };
    }
}

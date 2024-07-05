import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UserService } from "../user/user.service";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { MailService } from "../mail/mail.service";
import * as bcrypt from "bcryptjs";
import * as crypto from "crypto";
import { uid } from "uid";
import { AuthRegisterDto } from "./dto/auth-register.dto";
import { AuthEmailLoginDto } from "./dto/auth-login.dto";
import { UserDocument } from "../user/schemas/user.schema";
import {
    HttpException,
    NotFoundException,
    InternalServerErrorException
} from "@nestjs/common";
import { Role } from "../user/enums/role.enum";

jest.mock("../user/user.service");
jest.mock("@nestjs/config");
jest.mock("@nestjs/jwt");
jest.mock("../mail/mail.service");

describe("AuthService", () => {
    let authService: AuthService;
    let userService: UserService;
    let configService: ConfigService;
    let jwtService: JwtService;
    let mailService: MailService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                UserService,
              /*  {
                    provide: UserService,
                    useValue: {
                        createUser: jest.fn(),
                        validateUser: jest.fn(),
                        findOne: jest.fn()
                    }
                },*/
                ConfigService,
                JwtService,
                MailService
            ]
        }).compile();

        authService = module.get<AuthService>(AuthService);
        userService = module.get<UserService>(UserService);
        configService = module.get<ConfigService>(ConfigService);
        jwtService = module.get<JwtService>(JwtService);
        mailService = module.get<MailService>(MailService);
    });
    /*
    describe("register", () => {
        it("should register a new user and send a signup email", async () => {
            const authRegisterDto: AuthRegisterDto = {
                email: "test@example.com",
                username: "testuser",
                password: "password",
                name: "Test User"
            };
            const user = {
                _id: "userId",
                username: "testuser",
                password: "hashedPassword",
                name: "Test User",
                email: "test@example.com",
                hash: "someHash",
                passwordResetToken: "sometoken",
                passwordResetExpires: Date.toDateString,
                isVerified: false,
                comments: [],
                posts: [],
                role: Role.Guest
            };
            jest.spyOn(crypto, "createHash").mockReturnValue({
                update: jest.fn().mockReturnThis(),
                digest: jest.fn().mockReturnValue("someHash")
            } as any);

            jest.spyOn(userService, "createUser").mockResolvedValue(user);
            jest.spyOn(authService, "getTokensData" as any).mockResolvedValue({
                token: "token"
            });

            const result = await authService.register(authRegisterDto);

            expect(userService.createUser).toHaveBeenCalledWith(
                expect.objectContaining({
                    ...authRegisterDto,
                    hash: "someHash"
                })
            );
            expect(mailService.userSignUp).toHaveBeenCalledWith({
                to: authRegisterDto.email,
                data: { hash: "someHash" }
            });
            expect(result).toEqual({
                token: "token",
                result: {
                    _id: "userId",
                    username: "testuser",
                    email: "test@example.com",
                    hash: "someHash",
                    name: "Test User",
                    passwordResetToken: "sometoken",
                    passwordResetExpires: Date.toDateString,
                    isVerified: false,
                    comments: [],
                    posts: [],
                    role: Role.Guest
                }
            });
        });
    });
*/
    describe("confirmEmail", () => {
        it("should confirm user email", async () => {
            const user = {
                id: "userId",
                email: "test@example.com",
                hash: "somehash"
            };

            jest.spyOn(userService, "validateUser").mockResolvedValue(
                user as any
            );
            jest.spyOn(userService, "update").mockResolvedValue(null);

            await authService.confirmEmail(user.hash);

            expect(userService.validateUser).toHaveBeenCalledWith({
                hash: user.hash
            });
            expect(userService.update).toHaveBeenCalledWith(user.id, {
                isVerified: true,
                hash: null
            });
        });

        it("should throw HttpException if user is not found", async () => {
            jest.spyOn(userService, "validateUser").mockResolvedValue(null);

            await expect(
                authService.confirmEmail("invalidhash")
            ).rejects.toThrow(HttpException);
        });
    });

    describe("forgotPassword", () => {
        it("should generate a reset token and send it via email", async () => {
            const user = {
                id: "userId",
                email: "test@example.com",
                save: jest.fn().mockResolvedValue(null)
            };

            jest.spyOn(userService, "findOne").mockResolvedValue(user as any);
            jest.spyOn(
                userService,
                "createPasswordResetToken"
            ).mockResolvedValue("resetToken");
            jest.spyOn(mailService, "forgotPassword").mockResolvedValue(null);

            await authService.forgotPassword(user.email);

            expect(userService.findOne).toHaveBeenCalledWith({
                email: user.email
            });
            expect(userService.createPasswordResetToken).toHaveBeenCalledWith(
                user.id
            );
            expect(user.save).toHaveBeenCalled();
            expect(mailService.forgotPassword).toHaveBeenCalledWith({
                to: user.email,
                data: { resetToken: "resetToken" }
            });
        });

        it("should throw NotFoundException if user is not found", async () => {
            jest.spyOn(userService, "findOne").mockResolvedValue(null);

            await expect(
                authService.forgotPassword("nonexistent@example.com")
            ).rejects.toThrow(NotFoundException);
        });

        it("should handle errors when sending email", async () => {
            const user = {
                id: "userId",
                email: "test@example.com",
                save: jest.fn().mockResolvedValue(null)
            };

            jest.spyOn(userService, "findOne").mockResolvedValue(user as any);
            jest.spyOn(
                userService,
                "createPasswordResetToken"
            ).mockResolvedValue("resetToken");
            jest.spyOn(mailService, "forgotPassword").mockRejectedValue(
                new Error("Mail error")
            );

            await expect(
                authService.forgotPassword(user.email)
            ).rejects.toThrow(InternalServerErrorException);
            expect(user.save).toHaveBeenCalledTimes(2);
        });
    });

    describe("me", () => {
        it("should return user details", async () => {
            const user = {
                _id: "userId",
                username: "testuser",
                email: "test@example.com"
            };

            jest.spyOn(userService, "findOne").mockResolvedValue(user as any);

            const result = await authService.me(user._id);

            expect(result).toEqual(user);
            expect(userService.findOne).toHaveBeenCalledWith({ _id: user._id });
        });
    });

    describe("setCookie", () => {
        it("should set a cookie in the response", () => {
            const res = {
                cookie: jest.fn()
            } as any;

            const cookieName = "authCookie";
            const cookieValue = "cookieValue";
            const maxAge = 3600;

            jest.spyOn(configService, "getOrThrow").mockReturnValue(maxAge);

            authService.setCookie(res, cookieName, cookieValue, maxAge);

            expect(res.cookie).toHaveBeenCalledWith(cookieName, cookieValue, {
                httpOnly: true,
                sameSite: "strict",
                maxAge
            });
        });
    });
}); // end of test suite

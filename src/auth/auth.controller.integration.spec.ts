import { Test, TestingModule } from "@nestjs/testing";
import * as request from "supertest";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UserService } from "../user/user.service";
import { ConfigService } from "@nestjs/config";
import { INestApplication } from "@nestjs/common";
import { LoggerService } from "../logger/logger.service";

describe("AuthController (e2e)", () => {
    let app: INestApplication;
    let authService = {
        register: jest.fn(),
        validateLogin: jest.fn(),
        confirmEmail: jest.fn(),
        forgotPassword: jest.fn(),
        resetPassword: jest.fn(),
        me: jest.fn(),
        setCookie: jest.fn()
    };
    let userService = { update: jest.fn() };

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                { provide: AuthService, useValue: authService },
                { provide: UserService, useValue: userService },
                { provide: ConfigService, useValue: { getOrThrow: jest.fn() } },
                { provide: LoggerService, useValue: { log: jest.fn() } }
            ]
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    it("/POST register", () => {
        const registerDto = { email: "test@example.com", password: "password" };
        authService.register.mockResolvedValue({ token: "access_token" });

        return request(app.getHttpServer())
            .post("/auth/register")
            .send(registerDto)
            .expect(201)
            .expect({ token: "access_token" });
    });
});

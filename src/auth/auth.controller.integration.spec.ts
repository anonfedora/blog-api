import { Test, TestingModule } from "@nestjs/testing";
import * as request from "supertest";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UserService } from "../user/user.service";
import { ConfigService } from "@nestjs/config";
import { INestApplication } from "@nestjs/common";
import { LoggerService } from "../logger/logger.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { User } from "../user/schemas/user.schema";

describe("AuthController (e2e)", () => {
  let app: INestApplication;
  let authService = {
    register: jest.fn(),
    validateLogin: jest.fn(),
    confirmEmail: jest.fn(),
    forgotPassword: jest.fn(),
    resetPassword: jest.fn(),
    me: jest.fn(),
    setCookie: jest.fn(),
  };
  let userService = { update: jest.fn() };
  const mockJwtGuard = {
    canActivate: jest.fn(() => true),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: UserService, useValue: userService },
        { provide: ConfigService, useValue: { getOrThrow: jest.fn() } },
        { provide: LoggerService, useValue: { log: jest.fn() } },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtGuard)
      .compile();

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

  it("/POST login", () => {
    const loginDto = { email: "test@example.com", password: "password" };
    authService.validateLogin.mockResolvedValue({ token: "access_token" });

    return request(app.getHttpServer())
      .post("/auth/login")
      .send(loginDto)
      .expect(200)
      .expect({ token: "access_token" });
  });

  it("/POST confirm-email", () => {
    authService.confirmEmail.mockResolvedValue(undefined);

    return request(app.getHttpServer())
      .post("/auth/confirm-email?hash=somehash")
      .expect(200)
      .expect({});
  });

  it("/POST forgot/password", () => {
    const forgotPasswordDto = { email: "test@example.com" };
    authService.forgotPassword.mockResolvedValue(undefined);

    return request(app.getHttpServer())
      .post("/auth/forgot/password")
      .send(forgotPasswordDto.email)
      .expect(200)
      .expect({});
  });

  /* it("/POST reset/password", () => {
        const resetPasswordDto = {
            password: "newPassword",
            confirmPassword: "newPassword"
        };
        authService.resetPassword.mockResolvedValue(undefined);

        return request(app.getHttpServer())
            .post("/auth/reset/password?resetToken=sometoken")
            .send(resetPasswordDto)
            .expect(200)
            .expect({});
    });*/

  it("/GET me/:id", () => {
    const user = { _id: "1", email: "test@example.com" };
    authService.me.mockResolvedValue(user);

    return request(app.getHttpServer())
      .get("/auth/me/1")
      .expect(200)
      .expect(user);
  });

  /*it("/PUT me/update/:id", () => {
        const updateUserDto = { email: "update@example.com" };
        const user = { _id: "1", email: "update@example.com" };
        userService.update.mockResolvedValue(user);

        return request(app.getHttpServer())
            .put("/auth/me/update/1")
            .send(updateUserDto)
            .expect(200)
            .expect(user);
    });*/
  it("/auth/me/update/:id (PATCH) - success", async () => {
    const userId = "testUserId";
    const updateUserDto = {
      username: "updatedUsername",
      email: "updated@example.com",
    };

    jest.spyOn(userService, "update").mockResolvedValue({
      _id: userId,
      username: "updatedUsername",
      email: "updated@example.com",
    });

    const response = await request(app.getHttpServer())
      .patch(`/auth/me/update/${userId}`)
      .send(updateUserDto)
      .expect(201);

    expect(response.body).toEqual({
      _id: userId,
      username: "updatedUsername",
      email: "updated@example.com",
    });
  });
});

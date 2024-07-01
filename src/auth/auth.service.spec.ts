import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UserService } from "../user/user.service";
import { MailService } from "../mail/mail.service";
import { ConfigService } from "@nestjs/config";
import { HttpException, NotFoundException } from "@nestjs/common";
import { AuthRegisterDto } from "./dto/auth-register.dto";
/*
jest.mock("../user/user.service");
jest.mock("../mail/mail.service");
jest.mock("@nestjs/config");
*/

describe("AuthService", () => {
    let authService: AuthService;
    let userService: UserService;
    let mailService: MailService;
    let configService: ConfigService;

    const mockAuthService = {
        createUser: jest.fn()
    };

    const mockConfigService = {
        getOrThrow: jest.fn()
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UserService,
                    useValue: mockAuthService
                },
                {
                    provide: MailService,
                    useFactory: () => ({ userSignUp: jest.fn() })
                },
                {
                    provide: ConfigService,
                    useValue: mockConfigService
                }
            ]
        }).compile();

        authService = module.get<AuthService>(AuthService);
        userService = module.get<UserService>(UserService);
        mailService = module.get<MailService>(MailService);
        configService = module.get<ConfigService>(ConfigService);
    });

    it("should register a new user and return the token and user", async () => {
        const user = {
            id: 1,
            email: "test@example.com",
            password: "password",
            name: "Test User",
            username: "testuser"
        };
        const dto: AuthRegisterDto = {
            email: "test@example.com",
            password: "password",
            name: "Test User",
            username: "testuser"
        };
        //userService.createUser.mockResolvedValueOnce(user);
        jest.spyOn(mockAuthService, "createUser").mockResolvedValueOnce(user);

        /*configService.getOrThrow
            .mockReturnValueOnce("secret")
            .mockReturnValueOnce("1h");*/
        jest.spyOn(mockConfigService, "getOrThrow")
            .mockReturnValueOnce("secret")
            .mockReturnValueOnce("1h");

        const result = await authService.register(dto);
        expect(result).toHaveProperty("token");
        expect(result).toHaveProperty("user");
        expect(userService.createUser).toHaveBeenCalledWith({
            ...dto,
            hash: expect.any(String)
        });
        expect(mailService.userSignUp).toHaveBeenCalledWith({
            to: dto.email,
            data: { hash: expect.any(String) }
        });
    });
});

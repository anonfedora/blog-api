import { Module } from "@nestjs/common";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { UserModule } from "../user/user.module";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { MailModule } from "../mail/mail.module";
import {  ConfigService } from "@nestjs/config";
import { LoggerModule } from '../logger/logger.module';

@Module({
    imports: [
        JwtModule.registerAsync({
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get("AUTH_SECRET"),
                signOptions: { expiresIn: configService.get("AUTH_EXPIRES") }
            }),
            inject: [ConfigService] // Inject ConfigService for dynamic configuration
        }),
        LoggerModule,
        UserModule,
        MailModule,
        PassportModule,
    ],
    controllers: [AuthController],
    providers: [JwtService, AuthService, JwtStrategy]
    // TODO - AuthService, providers,
})
export class AuthModule {}

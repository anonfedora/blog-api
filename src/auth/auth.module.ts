import { Module } from "@nestjs/common";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { UserModule } from "../user/user.module";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { MailModule } from "../mail/mail.module";

@Module({
    imports: [UserModule, MailModule, JwtModule.register({})],
    controllers: [AuthController],
    providers: [JwtService, AuthService]
    // TODO - AuthService, providers, ?
})
export class AuthModule {}

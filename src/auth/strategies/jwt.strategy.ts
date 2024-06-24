import { ExtractJwt, Strategy } from "passport-jwt";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ConfigService } from "@nestjs/config";
import { JwtPayloadType } from "./types/jwt-payload.type";
import { OrNeverType } from "src/utils/types/or-never.type";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
    constructor(private configService: ConfigService) {
        super({
            ignoreExpiration: false,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.getOrThrow("AUTH_SECRET", {
                infer: true
            })
        });
    }

    public validate(payload: JwtPayloadType): OrNeverType<JwtPayloadType> {
        if (!payload.id) {
            throw new UnauthorizedException();
        }
        return payload;
    }
}

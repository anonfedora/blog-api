import { ExtractJwt, Strategy } from "passport-jwt";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ConfigService } from "@nestjs/config";
import { JwtPayloadType } from "./types/jwt-payload.type";
import { OrNeverType } from "src/utils/types/or-never.type";
import { UserService } from "../../user/user.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
    constructor(
        private readonly configService: ConfigService,
        private readonly userService: UserService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.getOrThrow("AUTH_SECRET", {
                infer: true
            })
        });
    }

    /* public validate(payload: JwtPayloadType): OrNeverType<JwtPayloadType> {
        const user = await this.userService.findOne(payload.sub);
        if (!payload.id) {
            throw new UnauthorizedException();
        }
        console.log(payload)
        return payload;
    }*/

    async validate(payload: any): Promise<any> {
        return { userId: payload.sub, username: payload.username };
    }
}

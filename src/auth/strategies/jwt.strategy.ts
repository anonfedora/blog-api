import { ExtractJwt, Strategy } from "passport-jwt";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ConfigService } from "@nestjs/config";
import { JwtPayloadType } from "./types/jwt-payload.type";
import { OrNeverType } from "src/utils/types/or-never.type";
import { UserService } from "../../user/user.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
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

    async validate(payload: JwtPayloadType) {
        const user = this.userService.findById(payload.sub)
        if (!user){
          throw new UnauthorizedException()
        }
        return user
    }

    /* async validate(payload: any) {
        return { userId: payload.sub, username: payload.username };
    }*/

    /*async validate(payload: JwtPayloadType): Promise<any> {
      const user = await this.userService.findById(payload.sub);
        if (!user) {
            throw new UnauthorizedException();
        }
        return { userId: payload.sub, username: payload.username };
    }*/
}

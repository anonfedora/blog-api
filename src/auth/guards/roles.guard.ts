import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Role } from "../../user/enums/role.enum";
import { ROLES_KEY } from "../../utils/decorators/roles.decorator";
import { JwtPayloadType } from "../strategies/types/jwt-payload.type";
import { UserService } from "../../user/user.service";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    console.log("requiredRoles: " + requiredRoles);
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const token = request.cookies.access_token;

    if (!token) {
      return false;
    }
    try {
      const payload: JwtPayloadType = this.jwtService.verify(token, {
        secret: this.configService.get<string>("AUTH_SECRET"),
      });

      request.user = await this.userService.findById(payload.sub);

      return requiredRoles.some((role) => request.user.role?.includes(role));
    } catch (error) {
      return false;
    }
  }
}

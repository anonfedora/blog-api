import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) {}

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        /*console.log("Request:", request);
        console.log("Request.cookies", request.cookies.access_token);
        //const token = this.extractTokenFromHeader(request);*/
        const token = request.cookies.access_token
        /*console.log("Extracted Token:", token);*/
        if (!token) {
            return false;
        }
        try {
            const payload = this.jwtService.verify(token, {
                secret: this.configService.get<string>("AUTH_SECRET")
            });
            console.log("Payload:", payload);
            request.user = payload;
        } catch (error) {
            return false;
        }
        return true;
    }

    private extractTokenFromHeader(request: any): string | null {
        const [type, token] = request.headers.authorization?.split(" ") ?? [];
        return type === "Bearer" ? token : null;
    }
}

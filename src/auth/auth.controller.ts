import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";

@ApiTags("auth")
@ApiBearerAuth()
@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}


}

import {
    HttpException,
    Injectable,
    InternalServerErrorException,
    UnauthorizedException
} from "@nestjs/common";
import { UserService } from "../user/user.service";
import bcrypt from "bcryptjs";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Request, Response } from "express";
import { UserDocument } from "../user/schemas/user.schema";
import { NullableType } from "src/utils/types/nullable.type";
import ms from "ms";
import crypto from "crypto";
import { uid } from "uid";
import { MailService } from "../mail/mail.service";

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private configService: ConfigService,
        private jwtService: JwtService,
        private mailService: MailService
    ) {}
    
}

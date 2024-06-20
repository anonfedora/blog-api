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
        private usersService: UsersService,
        private configService: ConfigService,
        private jwtService: JwtService,
        private mailService: MailService
    ) {}

    create(createAuthDto: CreateAuthDto) {
        return "This action adds a new auth";
    }

    findAll() {
        return `This action returns all auth`;
    }

    findOne(id: number) {
        return `This action returns a #${id} auth`;
    }

    update(id: number, updateAuthDto: UpdateAuthDto) {
        return `This action updates a #${id} auth`;
    }

    remove(id: number) {
        return `This action removes a #${id} auth`;
    }
}

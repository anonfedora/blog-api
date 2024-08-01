import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
    IsBoolean,
    IsEmail,
    IsEnum,
    IsOptional,
    IsString
} from "class-validator";
import { Role } from "../enums/role.enum";
import { Transform } from "class-transformer";
import { lowerCaseTransformer } from "../../utils/transformers/lower-case.transformer";

export class UpdateUserDto {
    @ApiPropertyOptional({ type: String, example: "Eleazar J. D." })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiPropertyOptional({
        type: String,
        example: "dev.mes.anonfedora@gmail.com"
    })
    @Transform(lowerCaseTransformer)
    @IsEmail()
    @IsOptional()
    email?: string;

    @ApiPropertyOptional()
    @Transform(lowerCaseTransformer)
    @IsString()
    @IsOptional()
    username?: string;

    @ApiPropertyOptional()
    @IsBoolean()
    @IsOptional()
    isVerified?: boolean;

    @ApiPropertyOptional({ enum: Role })
    @IsEnum(Role)
    @IsOptional()
    role?: Role;
}

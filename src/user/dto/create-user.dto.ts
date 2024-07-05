import {
    IsString,
    IsEmail,
    MinLength,
    IsNotEmpty,
    Length
} from "class-validator";
import { Transform } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { Post } from "../../post/schemas/post.schema";
import { Comment } from "../../comment/schemas/comment.schema";
import { lowerCaseTransformer } from "../../utils/transformers/lower-case.transformer";
import { Role } from "../enums/role.enum";

export class CreateUserDto {
    @ApiProperty({ type: String, example: "Eleazar John Doe" })
    @IsString()
    @IsNotEmpty()
    @Length(3, 25)
    name: string;

    @ApiProperty({ type: String, example: "dev.mes.anonfedora@gmail.com" })
    @IsEmail()
    @IsNotEmpty()
    @Transform(lowerCaseTransformer)
    email: string;

    @ApiProperty({ type: String, example: "anonfedora" })
    @Transform(lowerCaseTransformer)
    @IsNotEmpty()
    username: string;

    @ApiProperty({ type: String, example: "#1John3y24" })
    @IsNotEmpty()
    @MinLength(8)
    password: string;

    @ApiProperty({ type: String, example: "eyJhc702ejjsjhhhJGYg3t70oggk" })
    hash: string;

    @ApiProperty({ type: String, example: "eyJhc702ejjsjhhhJGYg3t70oggk" })
    passwordResetToken?: string;

    @ApiProperty()
    passwordResetExpires?: Date;

    @ApiProperty({ type: Boolean, example: false })
    isVerified?: boolean;

    @ApiProperty()
    comments?: Comment[];

    @ApiProperty()
    posts?: Post[];

    @ApiProperty()
    role?: Role;
}

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
import { Role } from "../enums/role.enum";

export class CreateUserDto {
    @ApiProperty({ type: String, example: "Eleazar John Doe" })
    @IsString()
    @IsNotEmpty()
    @Length(3, 25)
    name: string;

    @ApiProperty({ type: String, example: "eleazar.john.doe@mail.com" })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ type: String, example: "eleazarjd" })
    @IsNotEmpty()
    username: string;

    @ApiProperty({ type: String, example: "#1John3y" })
    @IsNotEmpty()
    @MinLength(8)
    password: string;

    @ApiProperty({ type: Boolean, example: false })
    isVerified: boolean;

    @ApiProperty()
    comments: Comment[];

    @ApiProperty()
    posts: Post[];

    @ApiProperty()
    role: Role;
}

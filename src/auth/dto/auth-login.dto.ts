import { IsNotEmpty, Validate, IsEmail, IsString, Matches } from "class-validator";
import { Transform } from "class-transformer";
import { lowerCaseTransformer } from "../../utils/transformers/lower-case.transformer";
import { ApiProperty } from "@nestjs/swagger";

export class AuthEmailLoginDto {
    @ApiProperty({ type: String, example: "dev.mes.anonfedora@gmail.com" })
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    @Transform(lowerCaseTransformer)
    email: string;

    @ApiProperty({ type: String, example: "#1John3y24" })
    @IsString()
    @IsNotEmpty()
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message:
            "password must contain uppercase, lowercase, number and special character"
    })
    password: string;
}

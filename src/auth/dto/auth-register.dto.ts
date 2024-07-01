import {
    IsEmail,
    IsNotEmpty,
    MinLength,
    Validate,
    Length,
    IsString,
    Matches
} from "class-validator";
import { Transform } from "class-transformer";
import { lowerCaseTransformer } from "src/utils/transformers/lower-case.transformer";
import { ApiProperty } from "@nestjs/swagger";

export class AuthRegisterDto {
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
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'password must contain uppercase, lowercase, number and special character',
  })
    password: string;
}

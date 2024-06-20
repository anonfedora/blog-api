import { IsNotEmpty, Validate, IsEmail } from "class-validator";
import { Transform } from "class-transformer";
import { lowerCaseTransformer } from "src/utils/transformers/lower-case.transformer";
import { IsExist } from "src/utils/validators/is-exists.validator";

export class AuthEmailLoginDto {
    @ApiProperty({ type: String, example: "eleazar.john.doe@mail.com" })
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    @Transform(lowerCaseTransformer)
    email: string;

    @ApiProperty({ type: String, example: "#1John3y097" })
    @IsString()
    @IsNotEmpty()
    password: string;
}

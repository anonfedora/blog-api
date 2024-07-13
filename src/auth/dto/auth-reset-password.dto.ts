import { IsNotEmpty, MinLength, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class AuthResetPasswordDto {
    @ApiProperty({ type: String, example: "#1John3y24New" })
    @IsNotEmpty()
    @MinLength(8)
    @IsString()
    password: string;
    
    @ApiProperty({ type: String, example: "#1John3y24New" })
    @IsNotEmpty()
    @MinLength(8)
    @IsString()
    confirmPassword: string;

    /*@ApiProperty({ type: String, example: "eyJhc702ejjsjhhhJGYg3t70oggk" })
    @IsNotEmpty()
    @IsString()
    resetToken: string;*/
}

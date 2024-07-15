import {
    IsString,
    IsEmail,
    MinLength,
    IsNotEmpty,
    Length
} from "class-validator";
import { Transform } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCategoryDto {
    @ApiProperty({ type: String, example: "Category" })
    @IsString()
    @IsNotEmpty()
    @Length(2, 28)
    name: string;

    @ApiProperty({ type: String, example: "Category description" })
    @IsString()
    @Length(7, 48)
    description: string;
}

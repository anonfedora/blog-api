import { IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger"

export class AuthConfirmEmailDto {
    @ApiProperty({ type: String, example: "eyJhc702ejjsjhhhJGYg3t70oggk" })
    hash: string;
}

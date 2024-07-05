 import{ IsEmail } from 'class-validator';
import { Transform } from 'class-transformer';
import { lowerCaseTransformer } from '../../utils/transformers/lower-case.transformer';
import { ApiProperty } from "@nestjs/swagger"

export class AuthForgotPasswordDto {
  @ApiProperty({ type: String, example: "dev.mes.anonfedora@gmail.com" })
  @Transform(lowerCaseTransformer)
  @IsEmail()
  email: string;
}

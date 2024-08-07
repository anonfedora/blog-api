import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ReadNotificationDto {
  @ApiProperty({
    type: String,
    description: "Read a notificaiton by logged in user",
    example: "66ad8e211114041340862423",
  })
  @IsString()
  @IsNotEmpty()
  _id: string;
}

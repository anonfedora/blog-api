import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class NotificationResponseDto {
  id: string;
  userId: string;
  message: string;
  isRead: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

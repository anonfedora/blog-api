import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../enums/role.enum';

export class UserResponseDto {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  isVerified: boolean;

  @ApiProperty({ enum: Role, default: Role.Guest })
  role: Role;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { Category } from '../../category/schemas/category.schema';
import { Comment } from '../../comment/schemas/comment.schema';

export class PostResponseDto {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  authorId: string;

  @ApiProperty({ type: [String] })
  categoryId?: Category[];

  @ApiProperty({ type: [String] })
  comments: Types.Array<Comment>;

  @ApiProperty({ type: [String] })
  likes: string[];

  @ApiProperty()
  likesCount: number;

  @ApiProperty({ type: [String] })
  dislikes: string[];

  @ApiProperty()
  dislikesCount: number;

  @ApiProperty()
  image: string;

  @ApiProperty()
  isPublished: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
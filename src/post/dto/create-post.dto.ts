import {
    IsString,
    IsEmail,
    MinLength,
    IsNotEmpty,IsMongoId,
    Length
} from "class-validator";
import { Transform } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Category } from "../../category/schemas/category.schema";
import { Comment } from "../../comment/schemas/comment.schema";
import { User } from "../../user/schemas/user.schema";
import { ObjectId } from 'mongoose';

export class CreatePostDto {
    @ApiProperty({ type: String, example: "New Post" })
    @IsString()
    @IsNotEmpty()
    @Length(3, 25)
    title: string;

    @ApiProperty({
        type: String,
        example: "Contents of the newly created Post"
    })
    @IsString()
    @IsNotEmpty()
    @Length(25, 255)
    content: string;

    @ApiProperty({ example: "6678e1fc17d85f46f68ecd83" })
    @IsMongoId()
    authorId: ObjectId;

    @ApiProperty()
    categoryId: Category;

    @ApiPropertyOptional({ description: "Collection of comments" })
    comments: Comment;

    @ApiProperty({ type: Boolean, example: true })
    isPublished: boolean;
}

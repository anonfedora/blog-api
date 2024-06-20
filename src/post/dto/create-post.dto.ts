import {
    IsString,
    IsEmail,
    MinLength,
    IsNotEmpty,
    Length
} from "class-validator";
import { Transform } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { Category } from "../../category/schemas/category.schema";
import { Comment } from "../../comment/schemas/comment.schema";
import { User } from "../../user/schemas/user.schema";

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

    @ApiProperty()
    authorId: User;

    @ApiProperty()
    categoryId: Category;

    @ApiProperty()
    comments: Comment[];

    @ApiProperty({type: Boolean, example: true})
    isPublished: boolean;
}

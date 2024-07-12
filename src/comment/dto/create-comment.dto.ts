import {
    IsString,
    IsEmail,
    MinLength,
    IsNotEmpty,
    Length
} from "class-validator";
import { Transform } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { User } from "../../user/schemas/user.schema";
import { Post } from "../../post/schemas/post.schema";

export class CreateCommentDto {
    @ApiProperty({ type: String, example: "This is a comment on a post" })
    @IsString()
    @IsNotEmpty()
    @Length(3, 50)
    content: string;

    /*  @ApiProperty()
    authorId: string;

    @ApiProperty()
    postId: Post;*/
}

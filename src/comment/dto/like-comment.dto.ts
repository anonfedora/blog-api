import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LikeCommentDto {
    @ApiProperty({
        type: String,
        description: "Liking a comment by logged in user",
        example: "6678e1fc17d85f46f68ecd83"
    })
    @IsString()
    @IsNotEmpty()
    commentId: string;
}

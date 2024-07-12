import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class DislikeCommentDto {
    @ApiProperty({
        type: String,
        description: "Disliking a comment by logged in user",
        example: "668faefb4b3b1d6b1e2b0b06"
    })
    @IsString()
    @IsNotEmpty()
    commentId: string;
}

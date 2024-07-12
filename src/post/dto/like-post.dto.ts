import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LikePostDto {
    @ApiProperty({
        type: String,
        description: "Liking a post by logged in user",
        example: "668fadfb9bad5df501238667"
    })
    @IsString()
    @IsNotEmpty()
    postId: string;
}

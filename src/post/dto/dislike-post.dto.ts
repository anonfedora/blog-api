import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class DislikePostDto {
    @ApiProperty({
        type: String,
        description: "Disliking a post by logged in user",
        example: "6678e1fc17d85f46f68ecd83"
    })
    @IsString()
    @IsNotEmpty()
    postId: string;
}

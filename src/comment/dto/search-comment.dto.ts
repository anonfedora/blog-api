import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class SearchCommentDto {
    @ApiProperty({
        type: String,
        description: "Search a comment",
        example: "comment"
    })
    @IsString()
    @IsNotEmpty()
    search: string;
}

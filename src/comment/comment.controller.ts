import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Req,
    Delete
} from "@nestjs/common";
import { CommentService } from "./comment.service";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { UpdateCommentDto } from "./dto/update-comment.dto";
import { PostDocument } from "../post/schemas/post.schema";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("comment")
@Controller("comment")
export class CommentController {
    constructor(private readonly commentService: CommentService) {}

    @Post()
    async create(
        @Body() createCommentDto: CreateCommentDto,
        @Param("postId") postId: PostDocument,
        @Req() req
    ) {
        return await this.commentService.create(
            createCommentDto,
            postId,
            req.user
        );
    }

    @Get(":postId")
    async getCommentByPost(@Param("postId") postId: string) {
        return await this.commentService.getCommentByPost(postId);
    }

    @Patch(":id")
    async update(
        @Param("id") id: string,
        @Body() updateCommentDto: UpdateCommentDto
    ) {
        return await this.commentService.update(id, updateCommentDto);
    }

    @Delete(":id")
    async remove(@Param("id") id: string) {
        return await this.commentService.remove(id);
    }
}

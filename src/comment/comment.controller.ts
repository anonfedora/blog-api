import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Req,
    UseGuards,
    Delete
} from "@nestjs/common";
import { CommentService } from "./comment.service";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { UpdateCommentDto } from "./dto/update-comment.dto";
import { PostDocument } from "../post/schemas/post.schema";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { LikeCommentDto } from "./dto/like-comment.dto";
import { DislikeCommentDto } from "./dto/dislike-comment.dto";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("comment")
@Controller("comment")
export class CommentController {
    constructor(private readonly commentService: CommentService) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    async create(
        @Body() createCommentDto: CreateCommentDto,
        @Param("postId") postId: string,
        @Req() req
    ) {
        const userId = req.user.userId;
        return await this.commentService.create(
            createCommentDto,
            postId,
            userId
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

    @UseGuards(JwtAuthGuard)
    @Post("like")
    async likeComment(@Body() likeCommentDto: LikeCommentDto, @Req() req) {
        const userId = req.user.userId;
        return this.commentService.likeComment(
            likeCommentDto.commentId,
            userId
        );
    }

    @UseGuards(JwtAuthGuard)
    @Post("dislike")
    async dislikeComment(
        @Body() dislikeCommentDto: DislikeCommentDto,
        @Req() req
    ) {
        const userId = req.user.userId;
        return this.commentService.dislikeComment(
            dislikeCommentDto.commentId,
            userId
        );
    }

    @Delete(":id")
    async remove(@Param("id") id: string) {
        return await this.commentService.remove(id);
    }
}

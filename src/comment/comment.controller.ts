import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Req,
    Query,
    UseGuards,
    Delete
} from "@nestjs/common";
import { CommentService } from "./comment.service";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { UpdateCommentDto } from "./dto/update-comment.dto";
import { PostDocument } from "../post/schemas/post.schema";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { SearchCommentDto } from "./dto/search-comment.dto";
import { LikeCommentDto } from "./dto/like-comment.dto";
import { DislikeCommentDto } from "./dto/dislike-comment.dto";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("comment")
@Controller("comment")
export class CommentController {
    constructor(private readonly commentService: CommentService) {}

    @UseGuards(JwtAuthGuard)
    @Post(":postId")
    async create(
        @Body() createCommentDto: CreateCommentDto,
        @Param("postId") postId: string,
        @Req() req
    ) {
        const userId = req.user.sub;
        return await this.commentService.create(
            createCommentDto,
            postId,
            userId
        );
    }

    @UseGuards(JwtAuthGuard)
    @Patch(":commentId")
    async update(
        @Param("commentId") commentId: string,
        @Body() updateCommentDto: UpdateCommentDto,
        @Req() req
    ) {
        const userId = req.user.sub;
        return await this.commentService.update(
            commentId,
            updateCommentDto,
            userId
        );
    }

    @UseGuards(JwtAuthGuard)
    @Delete(":postId/:commentId")
    async remove(@Param("postId") postId: string, @Param("commentId") commentId: string, @Req() req) {
        const userId = req.user.sub;
        return await this.commentService.remove(postId,commentId, userId);
    }

    @UseGuards(JwtAuthGuard)
    @Post("like/:commentId")
    async likeComment(@Param() likeCommentDto: LikeCommentDto, @Req() req) {
        const userId = req.user.sub;
        return this.commentService.likeComment(
            likeCommentDto.commentId,
            userId
        );
    }

    @UseGuards(JwtAuthGuard)
    @Post("dislike/:commentId")
    async dislikeComment(
        @Param() dislikeCommentDto: DislikeCommentDto,
        @Req() req
    ) {
        const userId = req.user.sub;
        return this.commentService.dislikeComment(
            dislikeCommentDto.commentId,
            userId
        );
    }
    // TODO - Missing await, get likeCommentDto.postId, dislikeCommentDto.postId from Param
    /* @UseGuards(JwtAuthGuard)
    @Post("like")
    async likeComment(@Body() likeCommentDto: LikeCommentDto, @Req() req) {
        const userId = req.user.sub;
        console.log(userId);
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
        const userId = req.user.sub;
        console.log(`Comment ${dislikeCommentDto.commentId}, userId${userId}`);
        return this.commentService.dislikeComment(
            dislikeCommentDto.commentId,
            userId
        );
    }*/

    @Get(":id")
    async findOne(@Param("id") id: string) {
        return await this.commentService.findComment(id);
    }

    @Get()
    async findComments() {
        return await this.commentService.findAllComments();
    }

    @Get("search?")
    async search(@Query("search") query: SearchCommentDto) {
        return await this.commentService.search(query.search);
    }
}

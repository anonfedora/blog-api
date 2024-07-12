import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Req,
    Query,
    UseGuards,
    UseInterceptors,
    UploadedFile
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { PostService } from "./post.service";
import { PostDocument } from "./schemas/post.schema";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ApiTags } from "@nestjs/swagger";
import { LoggerService } from "../logger/logger.service";
import { LikePostDto } from "./dto/like-post.dto";
import { DislikePostDto } from "./dto/dislike-post.dto";
import { Express } from "express";

@ApiTags("Post")
@Controller("post")
export class PostController {
    constructor(
        private readonly postService: PostService,
        private readonly logger: LoggerService
    ) {}

    // TODO - req.user.id - JwtPayload
    @UseGuards(JwtAuthGuard)
    @Post("create")
    @UseInterceptors(FileInterceptor("image"))
    async create(
        @Body() createPostDto: CreatePostDto,
        @UploadedFile() file: Express.Multer.File,
        @Req() req
    ): Promise<PostDocument> {
      const userId = req.user.sub;
        this.logger.log(`Create new user post ${req.user}`, "PostController");
        this.logger.error(
            `Create new post `,
            "Post creation error",
            "PostController"
        );
        //console.log(req);
        return await this.postService.create(userId, createPostDto, file);
    }

    @Get()
    async findAll(@Query() query: any) {
        //const filter = req.query?.userId ? { authorId: req.query.userId } : {};
        return await this.postService.findAll(query.page, query.limit);
    }

    @Get("user-post/:id")
    async findUserPost(@Param("id") id: string) {
        return await this.postService.findUserPost(id);
    }

    @Get(":id")
    async findOne(@Param("id") id: string) {
        return await this.postService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(":id")
    async update(
        @Param("id") id: string,
        @Body() updatePostDto: UpdatePostDto,
        @Req() req
    ) {
        const userId = req.user.sub;
        this.logger.log(`Update post - ${id}user-post`, "PostController");
        return await this.postService.update(id, updatePostDto, userId);
    }

    @Get("search")
    async search(@Query() query: any) {
        return await this.postService.search(query.search);
    }

    @UseGuards(JwtAuthGuard)
    @Post("like")
    async likePost(@Body() likePostDto: LikePostDto, @Req() req) {
        const userId = req.user.sub;
        return this.postService.likePost(likePostDto.postId, userId);
    }

    @UseGuards(JwtAuthGuard)
    @Post("dislike")
    async dislikePost(@Body() dislikePostDto: DislikePostDto, @Req() req) {
        const userId = req.user.sub;
        return this.postService.dislikePost(dislikePostDto.postId, userId);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(":id")
    async remove(@Param("id") postId: string, @Req() req) {
        const userId = req.user.sub;
        this.logger.log(`Delete post`, "PostController");
        return await this.postService.remove(postId, userId);
    }
}

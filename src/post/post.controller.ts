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
    UseGuards
} from "@nestjs/common";
import { PostService } from "./post.service";
import { PostDocument } from "./schemas/post.schema";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ApiTags } from "@nestjs/swagger";
import { LoggerService } from "../logger/logger.service";

@ApiTags("post")
@Controller("post")
export class PostController {
    constructor(
        private readonly postService: PostService,
        private readonly logger: LoggerService
    ) {}

    // TODO - req.user.id - JwtPayload
    @UseGuards(JwtAuthGuard)
    @Post("create")
    async create(
        @Body() createPostDto: CreatePostDto,
        @Req() req
    ): Promise<PostDocument> {
        this.logger.log(`Create new user post ${req.user}`, "PostController");
        this.logger.error(
            `Create new post `,
            "Post creation error",
            "PostController"
        );
        return await this.postService.create(req.user.userId, createPostDto);
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
        @Body() updatePostDto: UpdatePostDto
    ) {
        this.logger.log(`Update post - ${id}user-post`, "PostController");
        return await this.postService.update(id, updatePostDto);
    }

    @Get("search")
    async search(@Query() query: any) {
        return await this.postService.search(query.search);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(":id")
    async remove(@Param("id") id: string) {
        this.logger.log(`Delete post`, "PostController");
        return await this.postService.remove(id);
    }
}

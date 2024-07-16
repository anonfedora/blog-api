import { Test, TestingModule } from "@nestjs/testing";
import * as request from "supertest";
import { PostController } from "./post.controller";
import { PostService } from "./post.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { LoggerService } from "../logger/logger.service";
import { JwtService } from "@nestjs/jwt";
import { getModelToken } from "@nestjs/mongoose";
import { INestApplication } from "@nestjs/common";

describe("PostController (e2e)", () => {
    let app: INestApplication;
    let jwtService: JwtService;
    let postService = {
        create: jest.fn(),
        findAll: jest.fn(),
        findUserPost: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn(),
        search: jest.fn(),
        likePost: jest.fn(),
        dislikePost: jest.fn(),
        remove: jest.fn()
    };
    const mockJwtGuard = {
        canActivate: jest.fn(() => true)
    };

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            controllers: [PostController],
            providers: [
                { provide: PostService, useValue: postService },
                {
                    provide: LoggerService,
                    useValue: { log: jest.fn(), error: jest.fn() }
                }
            ]
        })
            .overrideGuard(JwtAuthGuard)
            .useValue(mockJwtGuard)
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    /*it("/POST post/create", () => {
        const createPostDto = { title: "Post Title", content: "Post Content" };
        const file = {
            fieldname: "image",
            originalname: "test.png",
            mimetype: "image/png",
            buffer: Buffer.from("test")
        };
        postService.create.mockResolvedValue({ userId: "1", ...createPostDto });

        return request(app.getHttpServer())
            .post("/post/create")
            .attach("image", file.buffer, file.originalname)
            .field("title", createPostDto.title)
            .field("content", createPostDto.content)
            .expect(201)
            .expect({ userId: "1", ...createPostDto });
    });*/

    it("/GET post", () => {
        const posts = [
            { id: "1", title: "Post Title", content: "Post Content" }
        ];
        postService.findAll.mockResolvedValue(posts);

        return request(app.getHttpServer())
            .get("/post")
            .expect(200)
            .expect(posts);
    });

    it("/GET post/user-post/:id", () => {
        const post = { id: "1", title: "Post Title", content: "Post Content" };
        postService.findUserPost.mockResolvedValue(post);

        return request(app.getHttpServer())
            .get("/post/user-post/1")
            .expect(200)
            .expect(post);
    });

    it("/GET post/:id", () => {
        const post = { id: "1", title: "Post Title", content: "Post Content" };
        postService.findOne.mockResolvedValue(post);

        return request(app.getHttpServer())
            .get("/post/1")
            .expect(200)
            .expect(post);
    });

    /*it("/PATCH post/:id  - success", () => {
        const updatePostDto = {
            id: "1",
            title: "updatedTitle",
            content: "updatedContent",
            userId: "userId"
        };
        postService.update.mockResolvedValue(updatePostDto);

        return request(app.getHttpServer())
            .patch(`/post/1`)
            .send(updatePostDto)
            .expect(201)
            .expect(updatePostDto);
    });*/

    /*it("/GET post/search", () => {
        const posts = [
            { id: "1", title: "Post Title", content: "Post Content" }
        ];
        postService.search.mockResolvedValue(posts);

        return request(app.getHttpServer())
            .get("/post/search?search=Post")
            .expect(200)
            .expect(posts);
    });*/

    /*it("/GET post/search", () => {
        const posts = [
            { id: "1", title: "Post Title", content: "Post Content" }
        ];
        postService.likePost.mockResolvedValue(posts);

        return request(app.getHttpServer())
            .get("/post/search?search=Post")
            .expect(200)
            .expect(posts);
    });*/

    /*it("/GET post/search", () => {
        const posts = [
            { id: "1", title: "Post Title", content: "Post Content" }
        ];
        postService.dislikePost.mockResolvedValue(posts);

        return request(app.getHttpServer())
            .get("/post/search?search=Post")
            .expect(200)
            .expect(posts);
    });*/
});

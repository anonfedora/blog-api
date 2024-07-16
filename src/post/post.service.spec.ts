import { Test, TestingModule } from "@nestjs/testing";
import { getModelToken } from "@nestjs/mongoose";
import { PostService } from "./post.service";
import { Post } from "./schemas/post.schema";
import { CloudinaryService } from "../cloudinary/cloudinary.service";
import { NotificationService } from "../notification/notification.service";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";
import { Model } from "mongoose";
/*jest.mock("../notification/notification.service");*/
/*jest.mock("../cloudinary/cloudinary.service");*/

const mockPostModel = () => ({
    create: jest.fn(),
    findById: jest.fn(),
    find: jest.fn(),
    countDocuments: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    exec: jest.fn(),
    save: jest.fn(),
    populate: jest.fn()
});

describe("PostService", () => {
    let service: PostService;
    let cloudinaryService: CloudinaryService;
    let notificationService: NotificationService;
    let model: Model<Post>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PostService,
                { provide: getModelToken("Post"), useFactory: mockPostModel },
                {
                    provide: CloudinaryService,
                    useValue: { uploadImage: jest.fn() }
                },
                {
                    provide: NotificationService,
                    useValue: { createNotification: jest.fn() }
                }
            ]
        }).compile();

        service = module.get<PostService>(PostService);
        model = module.get<Model<Post>>(getModelToken("Post"));
        cloudinaryService = module.get<CloudinaryService>(CloudinaryService);
        notificationService =
            module.get<NotificationService>(NotificationService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    describe("create", () => {
        it("should create a new post with an image", async () => {
            const createPostDto: CreatePostDto = {
                title: "Test Post",
                content: "Test Content",
                categoryId: "testId",
                isPublished: true
            };
            const file: Express.Multer.File = {
                buffer: Buffer.from("test"),
                originalname: "test.png",
                mimetype: "image/png",
                size: 1000
            } as any;
            const userId = "user123";

            const uploadResult = {
                secure_url: "http://example.com/test.png",
                message: "success",
                name: "succ",
                http_code: 200
            };
            jest.spyOn(cloudinaryService, "uploadImage").mockResolvedValue(
                uploadResult
            );

            const newPost = {
                ...createPostDto,
                authorId: userId,
                image: uploadResult.secure_url
            };
            jest.spyOn(model, "create").mockReturnValue({
                save: jest.fn().mockResolvedValue(newPost)
            } as any);

            const result = await service.create(userId, createPostDto, file);
            expect(result).toEqual(newPost);
        });
    });

    describe("findAll", () => {
        it("should return all posts", async () => {
            const posts = [{ title: "Test Post", content: "Test Content" }];
            jest.spyOn(model, "find").mockReturnValue({
                populate: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockReturnThis(),
                sort: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue(posts)
            } as any);
            jest.spyOn(model, "countDocuments").mockResolvedValue(1);

            const result = await service.findAll(1, 10);

            expect(result).toEqual({
                data: posts,
                currentPage: 1,
                totalPages: 1,
                totalPosts: 1
            });
        });
    });

    describe("findOne", () => {
        it("should return a single post", async () => {
            const post = { title: "Test Post", content: "Test Content" };
            jest.spyOn(model, "findById").mockReturnValue({
                populate: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue(post)
            } as any);

            const result = await service.findOne("postId");
            expect(result).toEqual(post);
        });
    });

    describe("update", () => {
        it("should update the post", async () => {
            const post = { authorId: "userId", title: "Old Title" };
            const updatePostDto: UpdatePostDto = { title: "New Title" };
            jest.spyOn(model, "findById").mockResolvedValue(post);
            jest.spyOn(model, "findByIdAndUpdate").mockResolvedValue({
                ...post,
                ...updatePostDto
            });

            const result = await service.update(
                "postId",
                updatePostDto,
                "userId"
            );
            expect(result).toEqual({ ...post, ...updatePostDto });
        });
    });

    describe("search", () => {
        it("should return search results", async () => {
            const posts = [{ title: "Test Post" }];
            jest.spyOn(model, "find").mockReturnValue({
                exec: jest.fn().mockResolvedValue(posts)
            } as any);

            const result = await service.search("Test");
            expect(result).toEqual(posts);
        });
    });

    describe("likePost", () => {
        it("should like the post", async () => {
            const post = {
                likes: [],
                dislikes: ["userId"],
                likesCount: 0,
                dislikesCount: 1,
                save: jest.fn().mockResolvedValue(null)
            };
            jest.spyOn(model, "findById").mockResolvedValue(post);

            await service.likePost("postId", "userId");

            expect(post.likes).toContain("userId");
            expect(post.dislikes).not.toContain("userId");
            expect(post.likesCount).toBe(1);
            expect(post.dislikesCount).toBe(0);
        });
    });

    describe("dislikePost", () => {
        it("should dislike the post", async () => {
            const post = {
                likes: ["userId"],
                dislikes: [],
                likesCount: 1,
                dislikesCount: 0,
                save: jest.fn().mockResolvedValue(null)
            };
            jest.spyOn(model, "findById").mockResolvedValue(post);

            await service.dislikePost("postId", "userId");

            expect(post.dislikes).toContain("userId");
            expect(post.likes).not.toContain("userId");
            expect(post.likesCount).toBe(0);
            expect(post.dislikesCount).toBe(1);
        });
    });

    describe("remove", () => {
        it("should remove the post", async () => {
            const post = { authorId: "userId" };
            jest.spyOn(model, "findById").mockResolvedValue(post);
            jest.spyOn(model, "findByIdAndDelete").mockResolvedValue(post);

            const result = await service.remove("postId", "userId");
            expect(result).toEqual(post);
        });
    });
});

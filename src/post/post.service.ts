import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";
import { Post } from "./schemas/post.schema";
import { User } from "../user/schemas/user.schema";
import { PostDocument } from "./schemas/post.schema";
import { CloudinaryService } from "../cloudinary/cloudinary.service";
import { NotificationService } from "../notification/notification.service";

@Injectable()
export class PostService {
    constructor(
        @InjectModel("Post") private readonly postModel: Model<PostDocument>,
        private readonly cloudinaryService: CloudinaryService,
        private readonly notificationService: NotificationService
    ) {}

    async create(
        userId: string,
        createPostDto: CreatePostDto,
        file: Express.Multer.File
    ): Promise<PostDocument> {
        let imagePath: string = null;
        if (file) {
            const uploadResult = await this.cloudinaryService.uploadImage(file);
            imagePath = uploadResult.secure_url;
        }

        const newPost = await this.postModel.create({
            authorId: userId,
            ...createPostDto,
            image: imagePath
        });
        return await newPost.save();
    }

    async findAll(page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;
        const total = await this.postModel.countDocuments();
        const posts = await this.postModel
            .find()
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: 1 })
            .exec();
        return {
            data: posts,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalPosts: total
        };
    }

    async findUserPost(id: string): Promise<Post | null> {
        return await this.postModel
            .findById({ authorId: id })
            .populate("posts")
            .exec();
    }

    async findOne(id: string): Promise<Post | null> {
        return await this.postModel.findById(id).exec();
    }

    async update(
        postId: string,
        updatePostDto: Partial<UpdatePostDto>,
        userId: string
    ): Promise<Post | null> {
        const post = await this.postModel.findById(userId);
        if (post.authorId === userId)
            return await this.postModel.findByIdAndUpdate(
                postId,
                updatePostDto,
                { new: true }
            );
    }

    async search(query: string): Promise<Post[] | null> {
        const results = await this.postModel
            .find({
                $or: [
                    { title: { $regex: query, $options: "i" } },
                    { content: { $regex: query, $options: "i" } }
                ]
            })
            .exec();
        return results;
    }

    // TODO - Retrieve user by userid and setn notificationService name to user.name [likePost, dislikePost]
    async likePost(postId: string, userId: string): Promise<Post> {
        const post = await this.postModel.findById(postId);
        if (!post.likes.includes(userId) && post.dislikes.includes(userId)) {
            post.likes.push(userId);
            post.dislikes = post.dislikes.filter(id => id.toString() != userId);
            post.likesCount++;
            post.dislikesCount--;
        }
        if (!post.likes.includes(userId)) {
            post.likes.push(userId);
            post.dislikes = post.dislikes.filter(id => id.toString() != userId);
            post.likesCount++;
        }
        await this.notificationService.createNotification(
            post.authorId,
            `${userId} liked your post`
        );
        return post.save();
    }

    async dislikePost(postId: string, userId: string): Promise<Post> {
        const post = await this.postModel.findById(postId);
        if (!post.dislikes.includes(userId) && post.likes.includes(userId)) {
            post.dislikes.push(userId);
            post.likes = post.likes.filter(id => id.toString() !== userId);
            post.dislikesCount++;
            post.likesCount--;
        }
        if (!post.dislikes.includes(userId)) {
            post.dislikes.push(userId);
            post.likes = post.likes.filter(id => id.toString() !== userId);
            post.dislikesCount++;
        }
        await this.notificationService.createNotification(
            post.authorId,
            `${userId} disliked your post`
        );
        return post.save();
    }

    async remove(postId: string, userId: string): Promise<Post | null> {
        const post = await this.postModel.findById(postId);
        if (post.authorId === userId)
            return await this.postModel.findByIdAndDelete(postId);
    }
}

import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";
import { Post } from "./schemas/post.schema";
import { User } from "../user/schemas/user.schema";
import { PostDocument } from "./schemas/post.schema";

@Injectable()
export class PostService {
    constructor(
        @InjectModel("Post") private readonly postModel: Model<PostDocument>
    ) {}

    async create(
        userId: string,
        createPostDto: CreatePostDto
    ): Promise<PostDocument> {
        const newPost = await this.postModel.create({
            authorId: userId,
            ...createPostDto
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
            .populate("posts").exec();
    }

    async findOne(id: string): Promise<Post | null> {
        return await this.postModel.findById(id).exec();
    }

    async update(
        id: string,
        updatePostDto: Partial<UpdatePostDto>
    ): Promise<Post | null> {
        return await this.postModel.findByIdAndUpdate(id, updatePostDto, {
            new: true
        });
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

    async remove(id: string): Promise<Post | null> {
        return await this.postModel.findByIdAndDelete(id);
    }
}

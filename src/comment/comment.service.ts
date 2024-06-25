import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { UpdateCommentDto } from "./dto/update-comment.dto";
import { Post } from "../post/schemas/post.schema";
import { User } from "../user/schemas/user.schema";
import { CommentDocument } from "./schemas/comment.schema";

@Injectable()
export class CommentService {
    constructor(
        @InjectModel("Comment")
        private readonly commentModel: Model<CommentDocument>
    ) {}

    async create(createCommentDto: CreateCommentDto, post: Post, user: User) {
        const newComment = new this.commentModel({
            ...createCommentDto,
            authorId: user["id"],
            postId: post["id"]
        });
        return await newComment.save();
    }

    async getCommentByPost(postId: string) {
        return await this.commentModel.find({ postId }).populate("authorId");
    }

    async update(id: string, updateCommentDto: UpdateCommentDto) {
        return `This action updates a #${id} comment`;
    }

    async remove(id: string) {
        return `This action removes a #${id} comment`;
    }
}

import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { UpdateCommentDto } from "./dto/update-comment.dto";
import { Post } from "../post/schemas/post.schema";
import { User } from "../user/schemas/user.schema";
import { CommentDocument } from "./schemas/comment.schema";
import { Comment } from "./schemas/comment.schema";
import { NotificationService } from "../notification/notification.service";

@Injectable()
export class CommentService {
    constructor(
        @InjectModel("Comment")
        private readonly commentModel: Model<CommentDocument>,
        private readonly notificationService: NotificationService
    ) {}

    async create(
        createCommentDto: CreateCommentDto,
        postId: string,
        userId: string
    ) {
        const newComment = new this.commentModel({
            ...createCommentDto,
            postId,
            authorId: userId
        });
        return await newComment.save();
    }

    async getCommentByPost(postId: string) {
        return await this.commentModel.find({ postId }).populate("authorId");
    }


    async likeComment(commentId: string, userId: string): Promise<Comment> {
        const comment = await this.commentModel.findById(commentId);
        if (
            !comment.likes.includes(userId) &&
            comment.dislikes.includes(userId)
        ) {
            comment.likes.push(userId);
            comment.dislikes = comment.dislikes.filter(
                id => id.toString() != userId
            );
            comment.likesCount++;
            comment.dislikesCount--;
        }
        if (!comment.likes.includes(userId)) {
            comment.likes.push(userId);
            comment.dislikes = comment.dislikes.filter(
                id => id.toString() != userId
            );
            comment.likesCount++;
        }
        await this.notificationService.createNotification(
            comment.authorId,
            `${userId} liked your Comment`
        );
        return comment.save();
    }

    async dislikeComment(commentId: string, userId: string): Promise<Comment> {
        const comment = await this.commentModel.findById(commentId);
        if (
            !comment.dislikes.includes(userId) &&
            comment.likes.includes(userId)
        ) {
            comment.dislikes.push(userId);
            comment.likes = comment.likes.filter(
                id => id.toString() !== userId
            );
            comment.dislikesCount++;
            comment.likesCount--;
        }
        if (!comment.dislikes.includes(userId)) {
            comment.dislikes.push(userId);
            comment.likes = comment.likes.filter(
                id => id.toString() !== userId
            );
            comment.dislikesCount++;
        }
        await this.notificationService.createNotification(
            comment.authorId,
            `${userId} disliked your comment`
        );
        return comment.save();
    }

    async update(id: string, updateCommentDto: UpdateCommentDto) {
        return `This action updates a #${id} comment`;
    }
    
    async remove(id: string) {
        return `This action removes a #${id} comment`;
    }
}

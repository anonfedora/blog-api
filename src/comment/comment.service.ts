import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { UpdateCommentDto } from "./dto/update-comment.dto";
import { Post } from "../post/schemas/post.schema";
import { PostDocument } from "../post/schemas/post.schema";
import { User } from "../user/schemas/user.schema";
import { CommentDocument } from "./schemas/comment.schema";
import { Comment } from "./schemas/comment.schema";
import { NotificationService } from "../notification/notification.service";

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name)
    private readonly commentModel: Model<CommentDocument>,
    @InjectModel(Post.name) private readonly postModel: Model<PostDocument>,
    private readonly notificationService: NotificationService
  ) {}

  async create(
    createCommentDto: CreateCommentDto,
    postId: string,
    userId: string
  ): Promise<Comment> {
    const post = await this.postModel.findById(postId);
    if (!post) {
      throw new Error("Post not found");
    }
    const newComment = new this.commentModel({
      ...createCommentDto,
      postId,
      authorId: userId,
    });

    post.comments.push(newComment._id);

    await post.save();
    return newComment.save();
  }

  async likeComment(commentId: string, userId: string): Promise<Comment> {
    console.log(`likePost47: commentId ${commentId}, userId ${userId}`);
    const comment = await this.commentModel.findById(commentId);
    console.log(`commentModel.findById ${comment}`);
    if (!comment.likes.includes(userId) && comment.dislikes.includes(userId)) {
      comment.likes.push(userId);
      comment.dislikes = comment.dislikes.filter(
        (id) => id.toString() != userId
      );
      comment.likesCount++;
      comment.dislikesCount--;
    }
    if (!comment.likes.includes(userId)) {
      comment.likes.push(userId);
      comment.dislikes = comment.dislikes.filter(
        (id) => id.toString() != userId
      );
      comment.likesCount++;
    }
    console.log("After Like" + comment);
    console.log(
      `CommentService: comment.authorId${comment.authorId}, ${userId}`
    );
    await this.notificationService.createNotification(
      comment.authorId,
      `${userId} liked your Comment`
    );
    return comment.save();
  }

  /*async likeComment(commentId: string, userId: string): Promise<Comment> {
        console.log(`likePost47: commentId ${commentId}, userId ${userId}`);
        const comment = await this.commentModel.findById(commentId);
        console.log(`commentModel.findById ${comment}`);
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
        console.log("After Like" + comment);
        console.log(
            `CommentService: comment.authorId${comment.authorId}, ${userId}`
        );
        await this.notificationService.createNotification(
            comment.authorId,
            `${userId} liked your Comment`
        );
        return comment.save();
    }*/

  async dislikeComment(commentId: string, userId: string): Promise<Comment> {
    const comment = await this.commentModel.findById(commentId);
    console.log(`Comment ${comment}, commentId${commentId}`);
    if (!comment.dislikes.includes(userId) && comment.likes.includes(userId)) {
      comment.dislikes.push(userId);
      comment.likes = comment.likes.filter((id) => id.toString() !== userId);
      comment.dislikesCount++;
      comment.likesCount--;
    }
    if (!comment.dislikes.includes(userId)) {
      comment.dislikes.push(userId);
      comment.likes = comment.likes.filter((id) => id.toString() !== userId);
      comment.dislikesCount++;
    }
    await this.notificationService.createNotification(
      comment.authorId,
      `${userId} disliked your comment`
    );
    return comment.save();
  }

  async findComment(id: string): Promise<Comment | null> {
    return await this.commentModel.findById(id).exec();
  }

  async findAllComments(): Promise<Comment[] | null> {
    return await this.commentModel.find().exec();
  }

  async update(id: string, updateCommentDto: UpdateCommentDto, userId: string) {
    const comment = await this.commentModel.findById(id);
    console.log(comment);
    if (comment.authorId == userId) {
      return await this.commentModel.findByIdAndUpdate(id, updateCommentDto, {
        new: true,
      });
    }
  }

  // TODO - remove comments by user or post author
  async remove(postId: string, commentId: string, userId: string) {
    const comment = await this.commentModel.findById(commentId);
    if (!comment) {
      throw new Error("Comment not found");
    }

    const post = await this.postModel.findById(postId);
    if (!post) {
      throw new Error("Post not found");
    }

    if (comment.authorId == userId || post.authorId == userId) {
      return await this.commentModel.findByIdAndDelete(commentId, {
        new: true,
      });
    }
  }

  async search(query: string): Promise<Comment[] | null> {
    const results = await this.commentModel
      .find({
        $or: [{ content: { $regex: query, $options: "i" } }],
      })
      .exec();
    return results;
  }
}

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import * as mongoose from "mongoose";
import { User } from "../../user/schemas/user.schema";
import { Post } from "../../post/schemas/post.schema";

export type CommentDocument = Comment & Document;

@Schema({ timestamps: true })
export class Comment {
    @Prop({ type: String, required: true })
    content: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User" })
    authorId: User;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Post"  })
    postId: Post;
    
    //new
    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }] })
    likes: string[];

    @Prop({ default: 0 })
    likesCount: number;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }] })
    dislikes: string[];

    @Prop({ default: 0 })
    dislikesCount: number;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

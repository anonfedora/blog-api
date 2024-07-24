import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import * as mongoose from "mongoose";
import { Category } from "../../category/schemas/category.schema";
import { Comment } from "../../comment/schemas/comment.schema";
import { User } from "../../user/schemas/user.schema";

export type PostDocument = Post & Document;

@Schema({ timestamps: true })
export class Post {
    @Prop({ type: String, unique: true })
    title: string;

    @Prop({ required: true, unique: true })
    content: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true })
    authorId: string;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }] })
    categoryId?: Category[];

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }] })
    comments: Types.Array<Comment>;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }] })
    likes: string[];

    @Prop({ default: 0 })
    likesCount: number;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }] })
    dislikes: string[];

    @Prop({ default: 0 })
    dislikesCount: number;

    @Prop({})
    image: string;

    @Prop({ default: false })
    isPublished: boolean;
}

export const PostSchema = SchemaFactory.createForClass(Post);

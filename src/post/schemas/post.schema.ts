import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import * as mongoose from "mongoose";
import { Category } from "../../category/schemas/category.schema";
import { Comment } from "../../comment/schemas/comment.schema";
import { User } from "../../user/schemas/user.schema";
import { Role } from "../enums/role.enum";

export const PostDocument = Post & Document;

@Schema({ timestamps: true })
export class Post {
    @Prop({ type: String, unique: true })
    title: string;

    @Prop({ required: true, unique: true })
    content: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User" })
    authorId: User;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }] })
    categoryId: Category;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }] })
    comments: Comment[];

    @Prop({ required: false, default: false })
    isPublished: boolean;
}

export const PostSchema = SchemaFactory.createForClass(Post);

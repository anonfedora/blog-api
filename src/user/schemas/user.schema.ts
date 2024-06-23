import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import * as mongoose from "mongoose";
import { Post } from "../../post/schemas/post.schema";
import { Comment } from "../../comment/schemas/comment.schema";
import { Role } from "../enums/role.enum";
import * as bcrypt from "bcryptjs";

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
    @Prop({ type: String, required: true })
    name: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true, unique: true })
    username: string;

    @Prop({ required: true, select: false })
    password: string;

    @Prop({ select: false })
    hash: string;

    @Prop({ select: false })
    passwordResetToken: string;

    @Prop()
    passwordResetExpires: Date;

    @Prop({ required: true, default: false })
    isVerified: boolean;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }] })
    comments: Comment[];

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }] })
    posts: Post[];

    @Prop({ type: String, enum: Role, default: Role.Guest })
    role: Role;
}
export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre("save", async function (next) {
    const user = this as User;
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(user.password, saltRounds);
        user.password = hashedPassword;
        next();
    } catch (err) {
        return next(err);
    }
});

UserSchema.pre("findOneAndUpdate", async function (next) {
    const update: any = this.getUpdate();
    if (!update.password) {
        return next();
    }

    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(update.password, saltRounds);
        update.password = hashedPassword;
        next();
    } catch (err) {
        return next(err);
    }
});

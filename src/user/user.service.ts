import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "./schemas/user.schema";
import { NullableType } from "src/utils/types/nullable.type";
import { EntityCondition } from "src/utils/types/entity-condition.type";
import * as crypto from "crypto";

@Injectable()
export class UserService {
    constructor(@InjectModel("User") private readonly userModel: Model<User>) {}

    async createUser(createUserDto: CreateUserDto): Promise<UserDocument> {
        const createdUser = new this.userModel(createUserDto);
        return await createdUser.save();
    }

    async validateUser(
        payload: EntityCondition<UserDocument>
    ): Promise<NullableType<UserDocument>> {
        return await this.userModel
            .findOne({ ...payload })
            .select("+password")
            .select("+hash")
            .exec();
    }

    async findById(userId: string): Promise<UserDocument | null> {
        return await this.userModel.findById(userId).exec();
    }

    async findOne(
        fields: EntityCondition<UserDocument>
    ): Promise<NullableType<UserDocument>> {
        return await this.userModel.findOne({ ...fields });
    }

    async update(userId: string, updateUserDto: UpdateUserDto): Promise<User> {
        const user = await this.userModel.findByIdAndUpdate(
            userId,
            updateUserDto,
            { new: true }
        );
        console.log(`Update user ${user}`)
        return user;
    }

    async remove(id: UserDocument["id"]): Promise<User> {
        const deletedUser = await this.userModel.findById({ id });
        return deletedUser;
    }

    // Method for generating password reset token
    async createPasswordResetToken(userId: string): Promise<string | null> {
        const user = await this.userModel.findById(userId);
        if (!user) return null;

        const resetToken = crypto.randomBytes(32).toString("hex"); //

        user.passwordResetToken = resetToken;
        user.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000); // Set expiry time to 1 hour
        await user.save();
        return resetToken;
    }
}

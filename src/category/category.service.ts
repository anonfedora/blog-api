import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { User } from "../user/schemas/user.schema";
import { CategoryDocument } from "./schemas/category.schema";

@Injectable()
export class CategoryService {
    constructor(
        @InjectModel("Category")
        private readonly categoryModel: Model<CategoryDocument>
    ) {}

    async create(authorId: any, createCategoryDto: CreateCategoryDto) {
        const newCategory = await this.categoryModel.create({
            authorId,
            ...createCategoryDto
        });
        return await newCategory.save();
    }

    async findAll() {
        return await this.categoryModel.find();
    }

    async update(id: string, updateCategoryDto: UpdateCategoryDto) {
        const updateCat = await this.categoryModel.findByIdAndUpdate(
            id,
            updateCategoryDto,
            { new: true }
        );
        return updateCat;
    }

    async remove(id: string) {
        return await this.categoryModel.findByIdAndDelete(id);
    }
}

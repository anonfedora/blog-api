import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { User } from "../user/schemas/user.schema";
import { CategoryDocument, Category } from "./schemas/category.schema";

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

    async findAll(): Promise<Category[]> {
        return await this.categoryModel.find();
    }

    async update(
        id: string,
        updateCategoryDto: UpdateCategoryDto
    ): Promise<Category> {
        const updateCat = await this.categoryModel
            .findByIdAndUpdate(id, updateCategoryDto, { new: true })
            .exec();
        if (!updateCat) {
            throw new NotFoundException(`Category with ID ${id} not found`);
        }
        return updateCat;
    }

    async remove(id: string): Promise<Category> {
        return await this.categoryModel.findByIdAndDelete(id).exec()
    }
}

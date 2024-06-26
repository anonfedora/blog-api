import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete
} from "@nestjs/common";
import { CategoryService } from "./category.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../utils/decorators/roles.decorator";
import { Role } from "../user/enums/role.enum";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("category")
@Controller("category")
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @Roles(Role.Admin)
    @Post()
    create(
        @Param("authorId") authorId: string,
        @Body() createCategoryDto: CreateCategoryDto
    ) {
        return this.categoryService.create(authorId, createCategoryDto);
    }

    @Get()
    findAll() {
        return this.categoryService.findAll();
    }

    @Roles(Role.Admin)
    @Patch(":id")
    update(
        @Param("id") id: string,
        @Body() updateCategoryDto: UpdateCategoryDto
    ) {
        return this.categoryService.update(id, updateCategoryDto);
    }

    @Roles(Role.Admin)
    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.categoryService.remove(id);
    }
}

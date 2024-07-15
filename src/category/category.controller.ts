import {
    Controller,
    Get,
    Req,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards
} from "@nestjs/common";
import { CategoryService } from "./category.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../utils/decorators/roles.decorator";
import { Category } from "./schemas/category.schema";
import { Role } from "../user/enums/role.enum";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("category")
@Controller("category")
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @UseGuards(RolesGuard, JwtAuthGuard)
    @Roles(Role.Guest)
    @Post()
    create(@Req() req, @Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
        const userId = req.user.sub;
        return this.categoryService.create(userId, createCategoryDto);
    }

    @Get()
    findAll() {
        return this.categoryService.findAll();
    }
    
    @UseGuards(JwtAuthGuard)
    //@Roles(Role.Admin)
    @Patch(":id")
    update(
        @Param("id") id: string,
        @Body() updateCategoryDto: UpdateCategoryDto
    ): Promise<Category> {
        return this.categoryService.update(id, updateCategoryDto);
    }


    @UseGuards( JwtAuthGuard)
    //@Roles(Role.Admin)
    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.categoryService.remove(id);
    }
}

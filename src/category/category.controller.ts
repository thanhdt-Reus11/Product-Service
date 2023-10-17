import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CategoryService } from './category.service';
import { ICategoryCreate } from './interfaces/category-update.interface';
import { ICategoryUpdate } from './interfaces/category-create.interface';

@Controller()
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @MessagePattern('createCategory')
  async create(@Payload() dataCreateCategory: ICategoryCreate) {
    return this.categoryService.create(dataCreateCategory);
  }

  @MessagePattern('findAllCategory')
  async findAll() {
    return this.categoryService.findAll();
  }

  @MessagePattern('findChildrensCategory')
  async findChildrens(@Payload() id: string) {
    return this.categoryService.findChildrens(id);
  }

  @MessagePattern('findAllRoot')
  async findAllRoot() {
    return this.categoryService.findAllRoot();
  }

  @MessagePattern('updateCategory')
  async update(@Payload() dataUpdateCategory: ICategoryUpdate) {
    return this.categoryService.update(dataUpdateCategory.id, dataUpdateCategory);
  }

  @MessagePattern('deleteCategory')
  async delete(@Payload() id: string) {
    return this.categoryService.deleteCategoryAndDescendants(id);
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './schemas/category.schema';
import mongoose, { Model, Types } from 'mongoose';
import { staticObject } from '../types';
import { ICategoryCreate } from './interfaces/category-update.interface';
import { ICategoryUpdate } from './interfaces/category-create.interface';
import { MsBadRequestException, MsNotFoundException, MsUnprocessableEntityException } from 'src/exceptions/ms-exception';

@Injectable()
export class CategoryService {

  logger = new Logger(CategoryService.name);
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel : Model<Category>,
  ) {}

  async create(dataCreateCategory: ICategoryCreate) {
    try {
      const oldCat = await this.categoryModel.findOne({ title: dataCreateCategory.title});
      if(oldCat)
      {
        throw new MsUnprocessableEntityException ('Category already exists.');
      }

      const newCat = await this.categoryModel.create({
        ...dataCreateCategory,
        _id: new Types.ObjectId(),
      });

      return newCat;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async findAll() {
    try {
      const categories = await this.categoryModel.aggregate([
        {
          $match: { parent: null }
        },
        {
          $project: {title: 1, _id: 1}
        }
      ]);

      const categoriesWithChildren = await this.populateChildren(categories);
      return categoriesWithChildren;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  private async populateChildren(categories: Category[]): Promise<Category[]> {
    const populatedCategories = [];

    for (const category of categories) {
      const children = await this.categoryModel.aggregate([
        {
          $match: { parent: category._id },
        },
        {
          $project: {title: 1, _id: 1}
        }
      ]);

      if (children.length > 0) {
        const populatedChildren = await this.populateChildren(children);
        category['children'] = populatedChildren;
      }

      populatedCategories.push(category);
    }

    return populatedCategories;
  }

  async findAllRoot() {
    try {
      const data = await this.categoryModel.find({ parent: { $exists: false } });
      return data;
    } catch (error) {
      this.logger.log(error);
      throw error;
    }
    
  }

  async findChildrens(id: string) {
    try {
      if(!mongoose.isValidObjectId(id)) {
        throw new MsBadRequestException('Please enter correct ID!');
      }

      const category = await this.categoryModel.findById(id);
      if (!category) {
        throw new MsNotFoundException('Category Not Found!')
      }

      const data = await this.categoryModel.find({parent : id});

      return data;
    } catch(error) {
      this.logger.error(error);
      throw error;
    }
  }

  async deleteCategoryAndDescendants(id: string) {
    if (!mongoose.isValidObjectId(id)) {
      throw new MsBadRequestException('Please enter correct ID!');
    }
    try {
      await this.deleteChildCategories(id);
      const data = await this.categoryModel.findByIdAndDelete(id);
      // const data = await this.categoryModel.findById(id);
      // data.status = staticObject.Delete;
      return {
        "message" : "Successfully deleted category!"
      }
    } catch(error) {
      this.logger.error(error);
      return new Error(error);
    }
  }

  private async deleteChildCategories(categoryId: string) {
    
    const childCategories = await this.categoryModel.find({
      parent: categoryId,
    });

    childCategories.forEach(async (category) => {
      await this.deleteChildCategories(category._id.toHexString());
    })

    await this.categoryModel.deleteMany({parent: categoryId});
    // const data = await this.categoryModel.find({parent: categoryId});
    // data.forEach((cat) => {
    //   cat.status = staticObject.Delete;
    // })
  }

  async update(id: string, dataUpdateCategory: ICategoryUpdate) {
    try {
      if (!mongoose.isValidObjectId(id)) {
        throw new MsBadRequestException('Please enter correct ID!');
      }

      const category = await this.categoryModel.findByIdAndUpdate(id, dataUpdateCategory,{
        new: true,
        runValidators: true
      });

      if(!category) {
        throw new MsNotFoundException('Category not found');
      }

      return category;
    } catch (error) {
      this.logger.error(error);
      return new Error(error);
    }
  }
}

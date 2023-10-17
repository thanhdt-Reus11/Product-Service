import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './schemas/product.schema';
import mongoose, { Model, Types } from 'mongoose';
import { IProductCreate } from './interfaces/product-create.interface';
import { IProductUpdate } from './interfaces/product-update.interface';
import { IQuery } from './interfaces/query.interface';
import { MsBadRequestException, MsNotFoundException, MsUnprocessableEntityException } from 'src/exceptions/ms-exception';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<Product>,
  ) {}

  async create(createProductDto: IProductCreate) {
    const oldProduct = await this.productModel.findOne({ title: createProductDto.title});
    if(oldProduct)
    {
      throw new MsUnprocessableEntityException ('Tittle of product already exists.');
    }

    console.log(createProductDto);
    const newProduct = await this.productModel.create({
      ...createProductDto,
      _id: new Types.ObjectId(),
    });

    return newProduct;
  }

  async findAll(query: IQuery) {
    const {title, description, author_id, sort, fields, category_id, isPublic, page, limit} = query;
    let searchOptions: any = {};

    if (title) {
      searchOptions.title = {
        $regex: title,
        $options: 'i'
      };
    }

    if (description) {
      searchOptions.description = {
        $regex: description,
        $options: 'i'
      };
    }

    if (author_id) {
      searchOptions.author_id = author_id;
    }

    if (category_id) {
      searchOptions.category_id = category_id;
    }

    if (isPublic) {
      searchOptions.isPublic = isPublic;
    }

    let selectOptions: string;

    if (fields && typeof fields === 'string') {
      selectOptions = fields.toString().split(',').join(' ');
    } else {
      selectOptions = '_id title description author_id price documentation version host endpoint';
    }

    let sortOptions: any = {};

    if (sort && typeof sort === 'string') {
      const sortFields = sort.split(',');

      for (const field of sortFields) {
        const sortOrder = field.startsWith('-') ? -1 : 1;
        const fieldName = field.replace(/^-/, '');
  
        sortOptions[fieldName] = sortOrder;
      }
    }
    else {
      sortOptions = { createdAt: -1 };
    }

    const pageNumber = page || 1;
    const limitNumber = limit || 10;
    const skip = (pageNumber-1)*limitNumber;

    const data = this.productModel.find(searchOptions)
                                  .skip(skip)
                                  .limit(limitNumber)
                                  .sort(sortOptions)
                                  .select(selectOptions);

    return data;
  }

  findOne(id: string) {
    if (!mongoose.isValidObjectId(id)) {
      throw new MsBadRequestException('Please enter correct id');
    }

    const data = this.productModel.findById(id)

    if(!data) {
      throw new MsNotFoundException('Product not found!');
    }

    return data;
  }

  async update(id: string, dataProductUpdate: IProductUpdate) {
    if (!mongoose.isValidObjectId(id)) {
      throw new MsBadRequestException('Please enter correct id');
    }

    const data = await this.productModel.findByIdAndUpdate(id, dataProductUpdate, {
      new: true,
      runValidators: true
    })

    if(!data) {
      throw new MsNotFoundException('Product not found');
    }

    return data;
  }

  async remove(id: string) {
    if (!mongoose.isValidObjectId(id)) {
      throw new MsBadRequestException('Please enter correct ID!');
    }
    
    const result = await this.productModel.findOneAndDelete({_id: id});
    if (!result) {
      throw new MsNotFoundException('Product not found');
    }
    return {
      "message": `Delete successfully product with id: ${id}`,
    }
  }
}

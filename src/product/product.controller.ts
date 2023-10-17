import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProductService } from './product.service';
import { IProductCreate } from './interfaces/product-create.interface';
import { IProductUpdate } from './interfaces/product-update.interface';
import { IQuery } from './interfaces/query.interface';

@Controller()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @MessagePattern('createProduct')
  async create(@Payload() dataCreateProduct: IProductCreate) {
    return this.productService.create(dataCreateProduct);
  }

  @MessagePattern('findAllProduct')
  async findAll(@Payload() query: IQuery) {
    return this.productService.findAll(query);
  }

  @MessagePattern('findOneProduct')
  findOne(@Payload() id: string) {
    return this.productService.findOne(id);
  }

  @MessagePattern('updateProduct')
  update(@Payload() dataProductUpdate: IProductUpdate) {
    return this.productService.update(dataProductUpdate.id, dataProductUpdate);
  }

  @MessagePattern('removeProduct')
  remove(@Payload() id: string) {
    return this.productService.remove(id);
  }
}

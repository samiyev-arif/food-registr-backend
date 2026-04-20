import { Inject, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './entities/product.entity';
import mongoose, { Model, mongo } from 'mongoose';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private readonly ProductRepo : Model<Product>
  ){}
  async create(createProductDto: CreateProductDto) {
    return await this.ProductRepo.create(createProductDto);
  }

  async findAll() {
    return await this.ProductRepo.find().sort({createdAt : -1});
  }

  async findOne(id: string) {
    return await this.ProductRepo.findById(id);
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    return await this.ProductRepo.findByIdAndUpdate(id , {...updateProductDto}, {new : true});
  }

  async remove(id: string) {
    return await this.ProductRepo.deleteOne({_id : id});
  }

  async getByCategory(id : string){
    return await this.ProductRepo.find({category : id})
  }
}

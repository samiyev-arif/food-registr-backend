import { Injectable } from '@nestjs/common';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ProductCategory } from './entities/product-category.entity';
import mongoose, { Model } from 'mongoose';

@Injectable()
export class ProductCategoryService {
  constructor(
    @InjectModel(ProductCategory.name) private readonly categoryRepo : Model<ProductCategory>
  ){}

  async create(createProductCategoryDto: CreateProductCategoryDto) {
    return await this.categoryRepo.create(createProductCategoryDto)
  }

  async findAll() {
    return await this.categoryRepo.find()
  }

  async findOne(id: string) {
    const cId = new mongoose.Types.ObjectId(id)
    return await this.categoryRepo.findById(cId);
  }

  async update(id: string, updateProductCategoryDto: UpdateProductCategoryDto) {
    const cId = new mongoose.Types.ObjectId(id)
    return await this.categoryRepo.findByIdAndUpdate(cId , updateProductCategoryDto, {new : true})
  }

  async remove(id: string) {
    const cId = new mongoose.Types.ObjectId(id)
    return await this.categoryRepo.findByIdAndDelete(cId);
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, UseGuards } from '@nestjs/common';
import { ProductCategoryService } from './product-category.service';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';
import DeliverGuard from 'src/guards/deliverGuard';
import { ApiBearerAuth, ApiOperation, ApiParam } from '@nestjs/swagger';

@Controller('product-category')
export class ProductCategoryController {
  constructor(private readonly productCategoryService: ProductCategoryService) {}

  @ApiBearerAuth()
  @UseGuards(DeliverGuard)
  @Post()
  @ApiOperation({description : 'categoriya qo`shish'})
  async create(@Body() createProductCategoryDto: CreateProductCategoryDto) {
   try {
     return await this.productCategoryService.create(createProductCategoryDto);
   } catch (error) {
     throw new HttpException(error.message , error.status || 500)
   }
  }

  @Get()
  @ApiOperation({description : 'categoriyalarni ko`rish'})
  async findAll() {
    try {
      return await this.productCategoryService.findAll();
    } catch (error) {
     throw new HttpException(error.message , error.status || 500)
    }
  }

  @Get(':id')
  @ApiOperation({description : 'categoriyani ko`rish'})
  @ApiParam({
    name : 'id',
    type : String,
    required : true
  })
  async findOne(@Param('id') id: string) {
    try {
      return await this.productCategoryService.findOne(id);
    } catch (error) {
     throw new HttpException(error.message , error.status || 500)
    }
  }

  @ApiBearerAuth()
  @UseGuards(DeliverGuard)
  @Patch(':id')
  @ApiOperation({description : 'categoriyani update qilish'})
  @ApiParam({
    name : 'id',
    type : String,
    required : true
  })
  async update(@Param('id') id: string, @Body() updateProductCategoryDto: UpdateProductCategoryDto) {
     try {
       return await this.productCategoryService.update(id, updateProductCategoryDto);    
      } catch (error) {
     throw new HttpException(error.message , error.status || 500)
    }
  }

  @ApiBearerAuth()
  @UseGuards(DeliverGuard)
  @Delete(':id')
  @ApiOperation({description : 'categoriyani o`chirish'})
  @ApiParam({
    name : 'id',
    type : String,
    required : true
  })
  async remove(@Param('id') id: string) {
    try {
      return await this.productCategoryService.remove(id);
    } catch (error) {
      throw new HttpException(error.message , error.status)
    }
  }
}

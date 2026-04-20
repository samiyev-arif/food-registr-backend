import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import DeliverGuard from 'src/guards/deliverGuard';
import { ApiBearerAuth, ApiOperation, ApiParam } from '@nestjs/swagger';
import { HttpAdapterHost } from '@nestjs/core';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}
  @ApiBearerAuth()
  @UseGuards(DeliverGuard)
  @Post()
  @ApiOperation({summary : 'yangi product qo`shish'})
  async create(@Body() createProductDto: CreateProductDto) {
    try {
      return await this.productsService.create(createProductDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('by-category/:id')
  @ApiOperation({summary : 'productni ko`rish ById'})
  @ApiParam({
    name : 'id',
    example : '690797eefdec07bb92b752e2',
    required : true
  })
  async getProductsBycategory(
    @Param('id') id : string
  ){
    try {
      return await this.productsService.getByCategory(id)
    } catch (error) {
      throw new HttpException(error.message  , error.status ||500)
    }
  }
  @ApiBearerAuth()
  @UseGuards(DeliverGuard)
  @Get()
  @ApiOperation({summary : 'barcha productlar ro`yhati'})
  async findAll() {
    try {
      return await this.productsService.findAll();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  @ApiBearerAuth()
  @UseGuards(DeliverGuard)
  @Get(':id')
  @ApiOperation({summary : 'productni ko`rish ById'})
  @ApiParam({
    name : 'id',
    example : '690797eefdec07bb92b752e2'
  })
  async findOne(@Param('id') id: string) {
    try {
      const product = await this.productsService.findOne(id);
      if (!product) throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      return product;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  @ApiBearerAuth()
  @UseGuards(DeliverGuard)
  @Patch(':id')
  @ApiOperation({summary : 'product ni taxrirlash'})
  @ApiParam({
  name : 'id',
  example : '690797eefdec07bb92b752e2'
  })
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    try {
      const updated = await this.productsService.update(id, updateProductDto);
      if (!updated) throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      return updated;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  @ApiBearerAuth()
  @UseGuards(DeliverGuard)
  @Delete(':id')
  @ApiOperation({summary : 'productni chopish ById'})
    @ApiParam({
    name : 'id',
    example : '690797eefdec07bb92b752e2'
  })
  async remove(@Param('id') id: string) {
    try {
      const result = await this.productsService.remove(id);
      if (result.deletedCount === 0) throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      return { message: 'Product successfully deleted' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}

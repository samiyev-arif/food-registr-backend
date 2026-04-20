import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpException, Res, Req, Query, BadRequestException } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import MarketGuard from 'src/guards/marketGuard';
import { Order } from './entities/order.entity';
import { Http2ServerRequest } from 'http2';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';
import DeliverGuard from 'src/guards/deliverGuard';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiProperty } from '@nestjs/swagger';
import type { Request } from 'express';

@ApiBearerAuth()
@UseGuards(MarketGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get('profile')
  @ApiOperation({ summary: `market/ o'z ma'lumotlarini ko'rish` })
  async FindOwnwnProfile(@Req() req: any) {
    try {
      return await this.ordersService.findOwnProfile(req.market.id);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

  @Post()
  @ApiOperation({ summary: 'buyurtma yaratish' })
  async create(@Body() body: CreateOrderDto, @Req() req: any) {
    try {
      return await this.ordersService.create(body, req.market.id);
    } catch (error) {
      throw new HttpException(error.message, error.status||500);
    }
  }

  @Get()
  @ApiOperation({ summary: "o'ziga tegishli barcha buyurtmalarni ko'rish" })
  async ownOrders(
    @Req() req: any,
    @Query('status') status?: 'new' | 'accepted' | 'rejected',
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const filter: any = { status };
    try {
      return await this.ordersService.findAllOwn(req.market.id, filter, {
        pageNum,
        limitNum,
      });
    } catch (error) {
      throw new HttpException(error.message, error.status||500);
    }
  }

  @Get('products')
  @ApiOperation({ summary: 'hamma productlarni olish(marketlar uchun)' })
  async productsList() {
    try {
      return await this.ordersService.findAllProducts();
    } catch (error) {
      throw new HttpException(error.message, error.status||500);
    }
  }

  @Get('products/:id')
  @ApiOperation({ summary: 'Productni Id bo`yicha olish(marketlar uchun)' })
  async productById(@Param('id') id: string) {
    try {
      return await this.ordersService.findoneProduct(id);
    } catch (error) {
      throw new HttpException(error.message, error.status||500);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'o`z buyurtmasini ko`rish' })
  async getById(@Param('id') id: string, @Req() req: any) {
    try {
      return await this.ordersService.findOne(id, req.market.id);
    } catch (error) {
      throw new HttpException(error.message, error.status||500);
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'buyurtmani update qilish (while status="new")' })
  async update(
    @Param('id') id: string,
    @Body() body: CreateOrderDto,
    @Req() req: any,
  ) {
    try {
      return await this.ordersService.update(id, req.market.id, body);
    } catch (error) {
      throw new HttpException(error.message, error.status||500);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'buyurtmani bekor qilish' })
  async remove(@Param('id') id: string, @Req() req: any) {
    try {
      return await this.ordersService.remove(id, req.market.id);
    } catch (error) {
      throw new HttpException(error.message, error.status||500);
    }
  }
}

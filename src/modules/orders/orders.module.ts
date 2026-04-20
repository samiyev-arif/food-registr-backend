import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { forwardRef } from '@nestjs/common';
import mongoose, { Document } from 'mongoose'; 
import { Market, MarketSchema } from '../markets/entities/market.entity'; 
import { Product, ProductSchema } from '../products/entities/product.entity'; 
import { Module } from '@nestjs/common';
import { Order, OrderSchema } from './entities/order.entity';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { ProductLimit, ProductLimitSchema } from '../product-limit/entities/product-limit.entity';
import { ProductsService } from '../products/products.service';
import { ProductLimitModule } from '../product-limit/product-limit.module';
import { MarketsModule } from '../markets/markets.module';

@Module({
  imports : [
    forwardRef(() => ProductLimitModule),
    MongooseModule.forFeature([
      {name : Order.name , schema : OrderSchema},
      {name : Market.name , schema : MarketSchema},
      {name : Product.name , schema : ProductSchema},
      {name : ProductLimit.name , schema : ProductLimitSchema}
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}

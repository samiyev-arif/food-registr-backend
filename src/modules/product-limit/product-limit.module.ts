import { Module, forwardRef } from '@nestjs/common';
import { ProductLimitService } from './product-limit.service';
import { ProductLimitController } from './product-limit.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductLimit, ProductLimitSchema } from './entities/product-limit.entity';
import { Order, OrderSchema } from '../orders/entities/order.entity';
import { OrdersService } from '../orders/orders.service';
import { OrdersModule } from '../orders/orders.module';
import { Product, ProductSchema } from '../products/entities/product.entity';

@Module({
  imports : [
      forwardRef(() => OrdersModule),
    MongooseModule.forFeature([
      {name : ProductLimit.name , schema : ProductLimitSchema},
      {name : Order.name , schema : OrderSchema},
      {name : Product.name , schema : ProductSchema}
    ])
  ],
  controllers: [ProductLimitController],
  providers: [ProductLimitService],
  exports: [ProductLimitService],
})
export class ProductLimitModule {}

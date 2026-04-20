import { Module } from '@nestjs/common';
import { MarketsService } from './markets.service';
import { MarketsController } from './markets.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Market, MarketSchema } from './entities/market.entity';
import { Contact, ContactSchema } from '../contact/entities/contact.entity';
import { ProductLimit, ProductLimitSchema } from '../product-limit/entities/product-limit.entity';
import { OrdersModule } from '../orders/orders.module';
import { ProductLimitModule } from '../product-limit/product-limit.module';


@Module({
  imports :[
    OrdersModule,
    ProductLimitModule,
    MongooseModule.forFeature([
      {name : Market.name , schema : MarketSchema},
      {name : Contact.name , schema : ContactSchema},
      {name : ProductLimit.name , schema : ProductLimitSchema}
    ]),
  ],
  controllers: [MarketsController],
  providers: [MarketsService],
  exports: [MarketsService],
})
export class MarketsModule {}
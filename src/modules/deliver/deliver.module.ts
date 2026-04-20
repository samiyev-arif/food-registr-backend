import { Module } from '@nestjs/common';
import { OrdersModule } from '../orders/orders.module';
import { MarketsModule } from '../markets/markets.module';
import { ContactModule } from '../contact/contact.module';
import { DeliverService } from './deliver.service';
import { DeliverController } from './deliver.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Deliver, DeliverSchema } from './entities/deliver.entity';
import { JwtService } from '@nestjs/jwt';
import { Order, OrderSchema } from '../orders/entities/order.entity';

@Module({
  imports : [
     OrdersModule,
     MarketsModule,
     ContactModule,
     MongooseModule.forFeature([
       {name : Deliver.name , schema : DeliverSchema},
       {name : Order.name , schema : OrderSchema}
     ])
   ],
  controllers: [DeliverController],
  providers: [DeliverService],
})
export class DeliverModule {}

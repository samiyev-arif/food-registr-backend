import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Deliver, DeliverSchema } from '../deliver/entities/deliver.entity';
import { Market, MarketSchema } from '../markets/entities/market.entity';

@Module({
  imports : [
       MongooseModule.forFeature([
        {name : Deliver.name, schema : DeliverSchema},
        {name : Market.name , schema : MarketSchema}
      ])
    ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}

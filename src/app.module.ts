import { Module } from '@nestjs/common';
import { DeliverModule } from './modules/deliver/deliver.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { MarketsModule } from './modules/markets/markets.module';
import { ProductsModule } from './modules/products/products.module';
import { OrdersModule } from './modules/orders/orders.module';
import * as dotenv from 'dotenv'
import { Deliver, DeliverSchema } from './modules/deliver/entities/deliver.entity';
import { DeliverSeed } from './modules/deliver/deliver.seed';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProductLimitModule } from './modules/product-limit/product-limit.module';
import DeliverGuard from './guards/deliverGuard';
import MarketGuard from './guards/marketGuard';
import { DocumentBuilder } from '@nestjs/swagger';
import { ContactModule } from './modules/contact/contact.module';
import { ProductCategoryModule } from './modules/product-category/product-category.module';
dotenv.config()

@Module({
  imports: [
     MongooseModule.forRoot(process.env.DB||""),DeliverModule,
     MongooseModule.forFeature([
          {name : Deliver.name, schema : DeliverSchema}
        ]),
        JwtModule.registerAsync({
          global : true,
          imports : [ConfigModule],
          inject : [ConfigService],
          useFactory:(ConfigService : ConfigService) =>{
            return {
              secret : ConfigService.get('JWT'),
              signOptions :{expiresIn : '30h'}
            }
          }
        }),
     AuthModule, MarketsModule, ProductsModule, OrdersModule, ProductLimitModule, ContactModule, ProductCategoryModule],
  controllers: [],
  providers: [DeliverSeed, DeliverGuard, MarketGuard],
})
export class AppModule {}

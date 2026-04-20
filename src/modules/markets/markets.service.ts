import { Injectable } from '@nestjs/common';
import { CreateMarketDto } from './dto/create-market.dto';
import { UpdateMarketDto } from './dto/update-market.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Market } from './entities/market.entity';
import { Model } from 'mongoose';
import { OrdersService } from '../orders/orders.service';
import { Contact } from '../contact/entities/contact.entity';
import { Types } from 'mongoose';
import { ProductLimit } from '../product-limit/entities/product-limit.entity';
import { ProductLimitService } from '../product-limit/product-limit.service';

@Injectable()
export class MarketsService {
  constructor(
    @InjectModel(Contact.name) private readonly contactRepo : Model<Contact>,
    @InjectModel(Market.name) private readonly MarketRepo : Model<Market>,
    private readonly orderService : OrdersService,
    private readonly limitService : ProductLimitService
  ){}

  async create(createMarketDto: CreateMarketDto) {
    return await this.MarketRepo.create(createMarketDto);
  }

  async findAll() {
    return await this.MarketRepo.find().sort({createdAt : -1})
  }

  async findOne(id: string) {
    return await this.MarketRepo.findById(id)
  }

  async update(id: string, updateMarketDto: UpdateMarketDto) {
    return await this.MarketRepo.findByIdAndUpdate(id, {...updateMarketDto}, {new : true})
  }

  async remove(id: string) {
    const objectId = new Types.ObjectId(id)
    await this.limitService.removeByMarketId(id)
    await this.orderService.removeMarketAllOrders(objectId)
    await this.contactRepo.deleteMany({$or :[{from : objectId}, {to : objectId}]})
    return await this.MarketRepo.deleteOne({_id:objectId},);
  }
}

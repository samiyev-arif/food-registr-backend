import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Deliver } from 'src/modules/deliver/entities/deliver.entity'
import *as dotenv from 'dotenv'
dotenv.config()

@Injectable()
export class DeliverSeed implements OnModuleInit {
  constructor(@InjectModel(Deliver.name) private deliverModel: Model<Deliver>) {}

  async onModuleInit() {
    const count = await this.deliverModel.countDocuments();
    if (count === 0) {
      await this.deliverModel.create({
        name: 'Orifjon',
        phone: process.env.D_PHONE,
        password : process.env.D_PASS,
        role : 'deliver'
      });
      console.log('Main deliver created successfully');
    } else {
      console.log('Main deliver already exist, creating skipped');
    }
  }
}
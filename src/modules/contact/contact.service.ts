import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Contact } from './entities/contact.entity';
import { Model } from 'mongoose';
import { MessageDto } from './dto/create-contact.dto';

@Injectable()
export class ContactService {
 constructor(
  @InjectModel(Contact.name) private readonly ContactRepo : Model<Contact>
 ){}

 async create(from : string, body:MessageDto){
  return await this.ContactRepo.create({from, message : body.message})
 }

async sendMessageToMarket(to: string, messageDto: MessageDto) {
  return this.ContactRepo.create({from :'deliver', to , message: messageDto.message });
}


 async findOwnChat(id : string){
    if(!id) throw new NotFoundException('marketId not found')
    await this.ContactRepo.updateMany({ to: id, status: 'new' },{ $set: { status: 'viewed' } }
  );    return await this.ContactRepo.find({
        $or:[{from : id},{to : id}]
    })
 }

 async findMarketChat(marketId : string){
    if(!marketId) throw new BadRequestException('market not found')
        await this.ContactRepo.updateMany({from : marketId, status : 'new'}, {$set : {status :'viewed'}})
    return await this.ContactRepo.find({$or :[{from : marketId}, {to : marketId}]})
 }
 async findAll(){
   return await this.ContactRepo.find()
 }
}

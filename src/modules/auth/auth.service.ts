import { Injectable, NotFoundException } from '@nestjs/common';
import { LoginDeliverDto, LoginMarketDto } from './dto/create-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Deliver } from '../deliver/entities/deliver.entity';
import { Model } from 'mongoose';
import { Market } from '../markets/entities/market.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Deliver.name) private readonly deliverRepo : Model<Deliver>,
    @InjectModel(Market.name) private readonly marketRepo : Model<Market>,
    private jwt : JwtService,
  ){}

 async DElogin(Body : LoginDeliverDto){
    const user = await this.deliverRepo.findOne({phone :Body.phone , password : Body.password})
    if(!user) throw new NotFoundException('login or password incorrect')
    const token = await this.jwt.signAsync({id : user._id , phone : user.phone, role : user.role})
    return {token , message :"deliver login success"}
 }

 async MAlogin(Body: LoginMarketDto) {
  const market = await this.marketRepo.findOne({phone: Body.phone, password: Body.password});
  if (!market) throw new NotFoundException('login or password incorrect');
  const token = await this.jwt.signAsync({id: market._id, phone: market.phone, role: market.role});
  return { token, message: 'market login success' };
}

  findAll() {
    return `This action returns all `;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: any) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}

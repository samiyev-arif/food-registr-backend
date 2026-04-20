import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { CreateDeliverDto } from './dto/create-deliver.dto';
import { UpdateDeliverDto } from './dto/update-deliver.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from '../orders/entities/order.entity';
import { Model } from 'mongoose';
import { OrderFilterDto } from '../orders/dto/create-order.dto';
import { Deliver } from './entities/deliver.entity';


@Injectable()
export class DeliverService {
  constructor(
    @InjectModel(Order.name) private readonly orderRepo : Model<Order>,
    @InjectModel(Deliver.name) private readonly deliverRepo : Model<Deliver>
){}

  async getOrderById(id : string){
    return await this.orderRepo.findById(id)
  }
async exportOrdersToExcel(filter: OrderFilterDto) {
  const query: Record<string, any> = {};

  if (filter.marketId) {
    query.marketId = filter.marketId;
  }

  if (filter.status) {
    query.status = filter.status;
  }

  if (filter.from || filter.to) {
    query.createdAt = {};
    if (filter.from) {
      query.createdAt.$gte = new Date(filter.from);
    }
    if (filter.to) {
      query.createdAt.$lte = new Date(filter.to);
    }
  }

  const orders = await this.orderRepo
    .find(query)
    .sort({ createdAt: -1 })
    .populate('products.productId')
    .populate('marketId')
    .lean<(Order & { createdAt: Date })[]>();


  const uniqueProducts = new Set<string>();
  const orderProductMap = new Map<string, Map<string, number>>();

  orders.forEach(order => {
    const marketName = order.marketId?.name || "Noma'lum";

   const date = order.createdAt
  ? new Date(order.createdAt)
      .toLocaleString('en-GB', { timeZone: 'Asia/Tashkent' })
  : "unknown time";
  const orderKey = `${marketName} (${date})`;


    const productQuantities = new Map<string, number>();

    (order.products || []).forEach((p: any) => {
      const productName = p.productId?.name || "Noma'lum";
      uniqueProducts.add(productName);
      productQuantities.set(productName, p.quantity || 0);
    });

    orderProductMap.set(orderKey, productQuantities);
  });

  const ExcelJS = require('exceljs');
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Orders');

  const orderKeys = Array.from(orderProductMap.keys());

  worksheet.columns = [
    { header: 'Products / Markets', key: 'productName', width: 28 },
    ...orderKeys.map(key => ({
      header: key,
      key,
      width: 22,
      style: {
        alignment: {
          wrapText: true,
          vertical: 'middle',
          horizontal: 'center',
        },
      },
    })),
    { header: 'Jami', key: 'total', width: 12 },
  ];

  const headerRow = worksheet.getRow(1);
  headerRow.height = 45;
  headerRow.alignment = {
    wrapText: true,
    vertical: 'middle',
    horizontal: 'center',
  };
  headerRow.font = { bold: true };

  uniqueProducts.forEach(productName => {
    const row: any = { productName };
    let total = 0;

    orderKeys.forEach(orderKey => {
      const qty = orderProductMap.get(orderKey)?.get(productName) || 0;
      row[orderKey] = qty;
      total += qty;
    });

    row.total = total;
    worksheet.addRow(row);
  });

  const totalRow: any = { productName: 'JAMI' };
  let allTotal = 0;

  orderKeys.forEach(key => {
    const sum = Array.from(uniqueProducts).reduce((acc, product) => {
      return acc + (orderProductMap.get(key)?.get(product) || 0);
    }, 0);
    totalRow[key] = sum;
    allTotal += sum;
  });

  totalRow.total = allTotal;
  worksheet.addRow(totalRow).font = { bold: true };

  return await workbook.xlsx.writeBuffer();
}

async getOwnProfile(id : string){
  return await this.deliverRepo.findById(id).select('-password')
}
async createDeliver(dto: CreateDeliverDto) {
  if (dto.password !== dto.return_password) {
    throw new BadRequestException('Parollar bir xil emas');
  }
  return await this.deliverRepo.create({
    name: dto.name,
    password: dto.password,
    phone: dto.phone
  });
}

async updateDeliver(dto: UpdateDeliverDto, id: string) {
  if (dto.password !== dto.return_password) throw new BadRequestException('passwordlar bir xil emas')
  return await this.deliverRepo.findByIdAndUpdate(id, dto, { new: true });
}

async allDelivers(){
  return await this.deliverRepo.find().select('-password')
}
async deliversById(id  :string){
  return await this.deliverRepo.findById(id).select('-password')
}

async removeById(id : string) {
  const deliver = await this.deliverRepo.findById(id)
  if(!deliver || deliver.phone===process.env.D_PHONE) throw new BadRequestException('you can not remove superadmin')
  return await this.deliverRepo.findByIdAndDelete(id)
}
}

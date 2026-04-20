import { BadRequestException, HttpException, Injectable, NotFoundException, Type } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { Product } from '../products/entities/product.entity';
import { Market } from '../markets/entities/market.entity';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Http2ServerRequest } from 'http2';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';
import { error } from 'console';
import { ProductLimitService } from '../product-limit/product-limit.service';
import { Types } from 'mongoose';
@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderRepo: Model<Order>,
    @InjectModel(Product.name) private productRepo: Model<Product>,
    @InjectModel(Market.name) private marketRepo: Model<Market>,
    private readonly productLimitService : ProductLimitService
  ){}

 async create(body: CreateOrderDto, marketId: string) {
  const isMarketExist = await this.marketRepo.findById(marketId)
  if(!isMarketExist) throw new BadRequestException('you can not create order')
  await this.limitedCreate(marketId);

  for (const item of body.products) {
    const product = await this.productRepo.findById(item.productId);
    if (!product)
      throw new NotFoundException(`Product ${item.productId} not found`);

    await this.productLimitService.checkProductLimit(
      item.productId.toString(),
      marketId,
      item.quantity,
    );
  }

  const orderData = { ...body, marketId };

  const order = new this.orderRepo(orderData);
  return order.save();
}


async find(
  filter: { marketId?: string; status?: string; from?: string; to?: string; categoryId?: string },
  pageNum: number,
  limitNum: number,
) {
  const matchStage: any = {};

  if (filter.marketId) {
    try {
      matchStage.marketId = new Types.ObjectId(filter.marketId);
    } catch (error) {
      throw new BadRequestException('Invalid marketId format');
    }
  }

  if (filter.status) matchStage.status = filter.status;

  if (filter.from || filter.to) {
    matchStage.createdAt = {};
    if (filter.from) matchStage.createdAt.$gte = new Date(filter.from);
    if (filter.to) matchStage.createdAt.$lte = new Date(filter.to);
  }

  const pipeline: any[] = [{ $match: matchStage }];

  pipeline.push({
    $lookup: {
      from: 'markets',
      localField: 'marketId',
      foreignField: '_id',
      as: 'marketInfo'
    }
  });

  pipeline.push({
    $unwind: {
      path: '$marketInfo',
      preserveNullAndEmptyArrays: true
    }
  });

  pipeline.push({
    $lookup: {
      from: 'products',
      localField: 'products.productId',
      foreignField: '_id',
      as: 'productInfo'
    }
  });

  if (filter.categoryId) {
    pipeline.push({
      $addFields: {
        products: {
          $filter: {
            input: {
              $map: {
                input: '$products',
                as: 'product',
                in: {
                  $mergeObjects: [
                    '$$product',
                    {
                      productDetails: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: '$productInfo',
                              as: 'prodInfo',
                              cond: {
                                $eq: ['$$prodInfo._id', '$$product.productId']
                              }
                            }
                          },
                          0
                        ]
                      }
                    }
                  ]
                }
              }
            },
            as: 'productWithDetails',
            cond: {
              $eq: [
                { $toString: '$$productWithDetails.productDetails.category' },
                filter.categoryId
              ]
            }
          }
        }
      }
    });
  } else {
    pipeline.push({
      $addFields: {
        products: {
          $map: {
            input: '$products',
            as: 'product',
            in: {
              $mergeObjects: [
                '$$product',
                {
                  productDetails: {
                    $arrayElemAt: [
                      {
                        $filter: {
                          input: '$productInfo',
                          as: 'prodInfo',
                          cond: {
                            $eq: ['$$prodInfo._id', '$$product.productId']
                          }
                        }
                      },
                      0
                    ]
                  }
                }
              ]
            }
          }
        }
      }
    });
  }

  pipeline.push({
    $match: {
      'products.0': { $exists: true }
    }
  });

  pipeline.push({
    $project: {
      __v: 0,
      productInfo: 0,
      'marketInfo.password': 0,
      'marketInfo.__v': 0,
      'products.productDetails.__v': 0
    }
  });

  pipeline.push({ $sort: { createdAt: -1 } });
  const countPipeline = [...pipeline];
  countPipeline.push({ $count: 'total' });
  pipeline.push({ $skip: (pageNum - 1) * limitNum });
  pipeline.push({ $limit: limitNum });
  const [orders, totalCountResult] = await Promise.all([
    this.orderRepo.aggregate(pipeline).exec(),
    this.orderRepo.aggregate(countPipeline).exec(),
  ]);

  const total = totalCountResult[0]?.total || 0;

  const formattedOrders = orders.map(order => ({
    ...order,
    marketId: order.marketInfo,
    products: order.products.map(product => ({
      productId: product.productDetails,
      quantity: product.quantity,
      _id: product._id
    }))
  }));

  return {
    total,
    page: pageNum,
    limit: limitNum,
    data: formattedOrders,
  };
}


async findAllOwn(
  marketId: string,
  filter: { status?: 'new' | 'accepted' | 'rejected' | 'delivered' },
  pagination: { pageNum: number; limitNum: number }
) {
  const query: any = {};
  query.marketId = marketId;
  if (filter.status) query.status = filter.status;
  const skip = (pagination.pageNum - 1) * pagination.limitNum;
  const orders = await this.orderRepo
    .find(query, '-__v')
    .sort({createdAt : -1})
    .populate('products.productId', 'name')
    .skip(skip)
    .limit(pagination.limitNum)
    .lean();
  const total = await this.orderRepo.countDocuments(query);

  return {
    total,
    page: pagination.pageNum,
    limit: pagination.limitNum,
    data: orders,
  };
}


async findOne(id: string , marketId : string) {
    await this.isOwnOrder(id , marketId)
    return await this.orderRepo.findById(id);
  }

async update(orderId: string, marketId: string, updateData: CreateOrderDto) {
  await this.isOwnOrder(orderId, marketId);
  const order = await this.orderRepo.findById(orderId);
  if (!order) throw new NotFoundException('Order not found');
  if (order.status !== 'new') {
    throw new BadRequestException(
      `your order already ${order.status}. you can not edit it`,
    );
  }
  for (const item of updateData.products) {
    const product = await this.productRepo.findById(item.productId);
    if (!product) throw new NotFoundException(`Product ${item.productId} not found`);
    await this.productLimitService.checkProductLimit(
      item.productId.toString(),
      marketId,
      item.quantity,
    );
  }
  const mergedProducts = this.mergeProducts(updateData.products);
  order.products = mergedProducts as any;

  await order.save();
  return order;
}

async updateByDeliver(orderId: string, updateData: CreateOrderDto) {
  const order = await this.orderRepo.findById(orderId);
  if (!order) throw new NotFoundException('Order not found');
  if (order.status !== 'new') {
    throw new BadRequestException(
      `order already ${order.status}. you can not edit it`,
    );
  }
  const mergedProducts = this.mergeProducts(updateData.products);
  order.products = mergedProducts as any;
  await order.save();
  return order;
}

private mergeProducts(products: { productId: any; quantity: number }[]) {
  const map = new Map<string, { productId: any; quantity: number }>();

  for (const item of products) {
    const id = item.productId.toString();

    if (!map.has(id)) {
      map.set(id, { productId: item.productId, quantity: item.quantity });
    } else {
      const existing = map.get(id)!; 
      existing.quantity += item.quantity;
      map.set(id, existing);
    }
  }

  return Array.from(map.values());
}



async setAccepted(orderId : string){
  return await this.orderRepo.findByIdAndUpdate(orderId , {status : 'accepted'}, {new : true})
}

async setDelivered(orderId : string){
  return await this.orderRepo.findByIdAndUpdate(orderId , {status : 'delivered'}, {new : true})
} 

async setRejected(id : string){
  return await this.orderRepo.findByIdAndUpdate(id , {status : 'rejected'}, {new : true})
}

async removeMarketAllOrders(id: mongoose.Types.ObjectId){
  return await this.orderRepo.deleteMany({marketId : id})
}

async remove(orderId: string, marketId: string) {
  await this.isOwnOrder(orderId, marketId);
  const order = await this.orderRepo.findById(orderId);
  if (!order) throw new NotFoundException('Order not found');
  if (order.status !== 'new')
    throw new BadRequestException(
      `Your order is already ${order.status}. You cannot delete it.`,
    );

  await this.orderRepo.findByIdAndDelete(orderId);
  return { message: 'Order deleted successfully' };
}
async removeByDeliver(orderId: string) {
  const order = await this.orderRepo.findById(orderId);
  if (!order) throw new NotFoundException('Order not found');
  await this.orderRepo.findByIdAndDelete(orderId);
  return { message: 'Order deleted successfully' };
}
async isOwnOrder(orderId: string, marketId: string): Promise<boolean> {
  const order = await this.orderRepo.findById(orderId);
  if (!order) return false;
  if (order.marketId?.toString() !== marketId.toString()) throw new BadRequestException('you can edit / see only your own orders');
  return true;
}

async limitedCreate(marketId: string) {
  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)
  const orders = await this.orderRepo.find({ marketId : marketId, createdAt: { $gte: startOfToday }})
  if (orders.length !== 0) throw new BadRequestException('daily order creating limit reached')
  return true
}

async findoneProduct(id : string){
  return await this.productRepo.findById(id)
}

async findAllProducts(){
  return await this.productRepo.find().sort({createdAt : -1})
}

async findOwnProfile(markedId : string){
  return await this.marketRepo.findById(markedId).select('-password')
}
}

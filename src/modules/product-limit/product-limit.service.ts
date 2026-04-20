import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductLimitDto } from './dto/create-product-limit.dto';
import { UpdateProductLimitDto } from './dto/update-product-limit.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ProductLimit } from './entities/product-limit.entity';
import mongoose, { Model, mongo, Types } from 'mongoose';
import { Order } from '../orders/entities/order.entity';
import { Product } from '../products/entities/product.entity';
import { error } from 'console';

@Injectable()
export class ProductLimitService {
  constructor(
    @InjectModel(ProductLimit.name) private readonly LimitsRepo : Model<ProductLimit>,
    @InjectModel(Order.name) private readonly OrderRepo : Model<Order>,
    @InjectModel(Product.name) private readonly ProductRepo : Model<Product>
  ){}

  async create(createProductLimitDto: CreateProductLimitDto) {
    if(!createProductLimitDto.marketId||!createProductLimitDto.productId) throw new BadRequestException('market or product not defined')
    const limit = await this.LimitsRepo.find({productId: createProductLimitDto.productId, marketId : createProductLimitDto.marketId})
    if(limit.length) throw new BadRequestException('limit already exist for this product on this market, you can edit it')
    return await this.LimitsRepo.create({...createProductLimitDto, createdAt : this.getUzbTime(), updatedAt: this.getUzbTime()});
  }

  async findAll(filter : {marketId? : string, productId? : string}) {
    const query : any ={}
    if(filter.productId?.length) query.productId = new mongoose.Types.ObjectId(filter.productId)
    if(filter.marketId?.length) query.marketId = new mongoose.Types.ObjectId(filter.marketId)
    return await this.LimitsRepo.find(query).sort({createdAt: -1}).lean();
  }

  async findOne(id: string) {
    return await  this.LimitsRepo.findById(id);
  }

  async update(id : string , updateProductLimitDto: UpdateProductLimitDto) {
    return await this.LimitsRepo.findByIdAndUpdate(id , {...updateProductLimitDto},  {new : true})
  }

  async remove(id: string) {
    return await this.LimitsRepo.findByIdAndDelete(id);
  }

  async removeByMarketId(id : string){
  return await this.LimitsRepo.deleteMany({marketId : new mongoose.Types.ObjectId(id)})
  }

  async findOwnLimits(id : string){
    const marketId = new mongoose.Types.ObjectId(id)
    if(!id) throw new NotFoundException('markedId is not defined')
    return await this.LimitsRepo.find({marketId})
  }

 async checkProductLimit(productId: string, marketId: string, amount: number) {
  // 🔹 ObjectId sifatida ishlash uchun
  const productObjId = new Types.ObjectId(productId);
  const marketObjId = new Types.ObjectId(marketId);

  // 1️⃣ Limitni topamiz (har bir do'kon uchun alohida)
  const limit = await this.LimitsRepo.findOne({ productId: productObjId, marketId: marketObjId });
  if (!limit) return; // limit yo'q bo'lsa — cheklov yo'q

  // 2️⃣ Limitning tugash vaqtini hisoblaymiz
  const endDate = new Date(limit.startDate);
  endDate.setDate(endDate.getDate() + limit.days);

  // 3️⃣ Agar limit muddati tugagan bo'lsa — yangi davr boshlaymiz
  if (new Date() > endDate) {
    limit.startDate = new Date(); // hozirgi sanadan yangilaymiz
    await limit.save();
    return; // yangi limit davri boshlandi
  }

  // 4️⃣ Shu do'kondagi buyurtmalarni topamiz
  const orders = await this.OrderRepo.find({
    marketId: marketObjId,
    'products.productId': productObjId,
    createdAt: { $gte: limit.startDate, $lte: endDate },
  });

  // 5️⃣ Shu mahsulotdan jami qancha buyurtma berilganini hisoblaymiz
  let totalOrdered = 0;
  for (const order of orders) {
    const productItem = order.products.find(
      (p) => p.productId.toString() === productId.toString(),
    );
    if (productItem) totalOrdered += productItem.quantity;
  }

  // 6️⃣ Qancha miqdor qoldi
  const remaining = limit.amount - totalOrdered;

  // 🔍 Mahsulot nomi (xabar uchun)
  const product = await this.ProductRepo.findById(productObjId);

  // 7️⃣ Tekshiruvlar
  if (remaining <= 0)
    throw new BadRequestException(
      `${product?.name || 'Nomaʼlum mahsulot'} uchun limit tugagan!`,
    );

  if (amount > remaining)
    throw new BadRequestException(
      `${product?.name || 'Nomaʼlum mahsulot'} uchun faqat ${remaining} birlik zakaz bera olasiz.`,
    );
}


getUzbTime() {
  const nowUTC = new Date();
  return new Date(nowUTC.getTime() + 5 * 60 * 60 * 1000);
}

}

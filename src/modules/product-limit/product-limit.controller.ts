import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpException, Query, Req,} from '@nestjs/common';
import { ProductLimitService } from './product-limit.service';
import { CreateProductLimitDto } from './dto/create-product-limit.dto';
import { UpdateProductLimitDto } from './dto/update-product-limit.dto';
import DeliverGuard from 'src/guards/deliverGuard';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { UpdateMarketDto } from '../markets/dto/update-market.dto';
import MarketGuard from 'src/guards/marketGuard';

// @UseGuards(DeliverGuard)
@Controller('product-limit')
export class ProductLimitController {
  constructor(private readonly productLimitService: ProductLimitService) {}

@ApiBearerAuth()
@UseGuards(MarketGuard)
@Get('own')
@ApiOperation({summary : 'market / o`ziga tegishli bo`lgan barcha mahsulot limitlarini ko`rish'})
async getAllOwnLimits(
  @Req() req : any
){
  try {
    return await this.productLimitService.findOwnLimits(req.market.id)
  } catch (error) {
    throw new HttpException(error.message , error.status ||500)
  }
}

@Post(':marketId/:productId')                                                          //  worked
@ApiOperation({ summary: 'biror product uchun limit qo`yish (ex: 7 kun uchun 70kg )' })
@ApiParam({
  name: 'marketId',
  example: '6904da8156c4cca9dbccf758',
  type: String,
})
@ApiParam({
  name: 'productId',
  example: '690648a11d2854575b18ffa3',
  type: String,
})
create(
  @Body() createProductLimitDto: CreateProductLimitDto,
  @Param('marketId') marketId: string,
  @Param('productId') productId: string
) {
  try {
    createProductLimitDto.marketId = new Types.ObjectId(marketId);
    createProductLimitDto.productId = new Types.ObjectId(productId);

    return this.productLimitService.create(createProductLimitDto);
  } catch (error) {
    throw new HttpException(error.message, error.status || 500);
  }
}

  @Get()
  @ApiOperation({summary : 'limiti bor barcha maxsulotlarni ko`rish || query qabul qiladi'})       // worked
  findAll(
    @Query('marketId') marketId? : string,
    @Query('productId') productId? : string
  ) {
    try {
      const filter : any ={marketId , productId}
      return this.productLimitService.findAll(filter);
    } catch (error) {
      throw new HttpException(error.message, error.status||500)
    }
  }

  @Get(':id')
  @ApiOperation({summary : "id bo'yicha limitlarni ko'rish"})                                                // worked
  @ApiParam({
    name : 'id',
    example : '690792686619bf16a7be55b3'
  })
  findOne(@Param('id') id: string) {
    try {
      return this.productLimitService.findOne(id);
    } catch (error) {
      throw new HttpException(error.message , error.status||500)    
    }
  }

  @Patch(':id')
  @ApiOperation({summary : 'limitni taxrirlash'})                                                 // worked
  @ApiParam({
    name : 'id',
    example : '6904da8156c4cca9dbccf758',
    description : 'uptade by limit id',
    required : true
  })
  update(
    @Param('id') id : string,
    @Body() updateProductLimitDto: UpdateProductLimitDto) {
    try {
      return this.productLimitService.update(id, updateProductLimitDto);
    } catch (error) {
      throw new HttpException(error.message , error.status||500)
    }
  }

  @Delete(':id')                                            // worked
  @ApiOperation({summary : "limitni o'chirish"})
  @ApiParam({
    name : 'id',
    example : '6925e3dcb832d53d106b2f21'
  })
  remove(@Param('id') id: string) {
    try {
      return this.productLimitService.remove(id);
    } catch (error) {
      throw new HttpException(error.message , error.status||500)
    }
  }

 
}

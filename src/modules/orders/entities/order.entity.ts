import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ref } from "process";
import { Market } from "src/modules/markets/entities/market.entity";
import { Product } from "src/modules/products/entities/product.entity";
import mongoose, { Document } from "mongoose";


@Schema({timestamps : true})
export class Order extends Document {
    @Prop({type : mongoose.Schema.Types.ObjectId , ref : 'Market'})
    marketId? : Market

    @Prop([
        {
         productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
         quantity : Number
        }
    ])
    products : {productId : Product ; quantity : number}[]

    @Prop({enum :['new' , 'accepted', 'delivered', 'rejected'], default : 'new'})
    status : string
}

export const OrderSchema = SchemaFactory.createForClass(Order)
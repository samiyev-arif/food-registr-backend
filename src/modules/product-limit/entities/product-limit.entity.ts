import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Types } from "mongoose";

@Schema({timestamps : true})
export class ProductLimit {
    @Prop({type : Types.ObjectId, ref : 'Market', required : true})
    marketId : Types.ObjectId

    @Prop({type : Types.ObjectId , ref : 'Product' , required : true})
    productId : Types.ObjectId

    @Prop()
    amount : number

    @Prop()
    days : number

    @Prop({default : Date.now()})
    startDate : Date
}

export const ProductLimitSchema = SchemaFactory.createForClass(ProductLimit)
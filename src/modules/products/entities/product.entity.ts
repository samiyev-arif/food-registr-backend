import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from 'mongoose';
import { ProductCategory } from "src/modules/product-category/entities/product-category.entity";


@Schema({ timestamps :true})
export class Product extends Document {
    @Prop({unique : true})
    name : string

    @Prop({enum :['piece', 'liter', 'kg', 'm' ]})
    unit : string

    @Prop({type : Types.ObjectId, ref : ProductCategory.name, })
    category? : ProductCategory
}

export const ProductSchema = SchemaFactory.createForClass(Product);

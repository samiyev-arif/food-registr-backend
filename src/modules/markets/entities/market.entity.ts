import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({timestamps : true})
export class Market extends Document {
    @Prop()
    name : string

    @Prop({unique :  true})
    phone : string

    @Prop({required: false})
    address? : string

    @Prop()
    password : string

    @Prop({default : 'market'})
    role? : string
}

export const MarketSchema = SchemaFactory.createForClass(Market);

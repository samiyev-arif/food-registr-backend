import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({timestamps : true})
export class Contact {

    @Prop()
    from : string

    @Prop({default : 'deliver'})
    to : string

    @Prop({required : true})
    message : string

    @Prop({enum : ['new','viewed'], default :'new'})
    status : string
}

export const ContactSchema = SchemaFactory.createForClass(Contact)
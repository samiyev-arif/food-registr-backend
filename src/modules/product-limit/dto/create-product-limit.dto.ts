import { Type } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, isMongoId, IsNotEmpty, IsOptional } from "class-validator";
import { Types } from "mongoose";

export class CreateProductLimitDto {

    @IsOptional()
    @IsMongoId()
    marketId? : Types.ObjectId

    @IsOptional()
    @IsMongoId()
    productId? : Types.ObjectId

    @ApiProperty({type : 'number' , example : 200})
    @IsNotEmpty()
    amount : number

    @ApiProperty({type : 'number' , example :7})
    @IsNotEmpty()
    days : number
}

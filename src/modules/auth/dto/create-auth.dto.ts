import { ApiBody, ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";


export class LoginDeliverDto {
    @ApiProperty({type : String , default : '+998934928892'})
    @IsString()
    phone : string

    @ApiProperty({type: String , default : 'admin77'})
    @IsString()
    password : string
}

export class LoginMarketDto {
    @ApiProperty({type : String ,default : '999999999'})
    @IsString()
    phone : string

    @ApiProperty({type : String ,default : '1111'})
    @IsString()
    password : string
}
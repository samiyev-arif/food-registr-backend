import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, isString, IsString, Length, MaxLength } from "class-validator";

export class CreateMarketDto {
    @ApiProperty({type : 'string', example : 'uzum-market'})
    @IsString()
    @Length(5,255)
    name : string

    @ApiProperty({type : String , example : 'A.Navoiy-ko`chasi 34-A uy'})
    @IsOptional()
    @IsString()
    @MaxLength(300)
    address? : string

    @ApiProperty({type : 'string', example : '996666666'})
    @IsString()
    @Length(9,9)
    phone : string

    @ApiProperty({type : 'string', example : '1111'})
    @Length(0,8)
    @IsString()
    password : string
}

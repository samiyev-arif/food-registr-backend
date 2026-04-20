import { PartialType } from '@nestjs/mapped-types';
import { CreateMarketDto } from './create-market.dto';
import { IsOptional, IsString, Length, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateMarketDto extends PartialType(CreateMarketDto) {
        
        @ApiProperty({type : 'string', example : 'uzum-market'})
        @IsOptional()
        @IsString()
        @Length(5,255)
        name? : string
    
        @ApiProperty({type : 'string', example : '996666666'})
        @IsOptional()
        @IsString()
        @Length(9,9)
        phone? : string

        @ApiProperty({type : String , example : 'A.Navoiy-ko`chasi 34-A uy'})
        @IsOptional()
        @IsString()
        @MaxLength(300)
        address? : string
    
        @ApiProperty({type : 'string', example : '1111'})
        @IsOptional()
        @Length(0,8)
        @IsString()
        password? : string
}

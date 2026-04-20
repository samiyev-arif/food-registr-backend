import { PartialType } from '@nestjs/mapped-types';
import { CreateDeliverDto } from './create-deliver.dto';
import { IsOptional, IsString, Length, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateDeliverDto extends PartialType(CreateDeliverDto) {

        @ApiProperty({type : String, example : `Murodjon`})
        @IsOptional()
        @IsString()
        @Length(2,20)
        name? : string
    

        @ApiProperty({type : String, maxLength:9, minLength : 9 , example : '987787878'})
        @MaxLength(9)
        @IsOptional()
        @IsString()
        phone? : string
    
        @ApiProperty({type : String, minLength : 4, example : '1111'})
        @IsOptional()
        @IsString()
        @Length(4,16)
        password? : string
    
        @ApiProperty({type : String , minLength : 4, example : '1111'})
        @IsOptional()
        @IsString()
        @Length(4,16)
        return_password? :string
}

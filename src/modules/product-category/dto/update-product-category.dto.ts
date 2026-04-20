import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateProductCategoryDto } from './create-product-category.dto';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class UpdateProductCategoryDto extends PartialType(CreateProductCategoryDto) {
    @ApiProperty({example : 'sabzavotlar' , type : String ,required  : false})
    @IsString()
    @Length(2,100)
    name? : string
}

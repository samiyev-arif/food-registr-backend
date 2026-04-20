import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Length } from "class-validator";

export class CreateProductCategoryDto {
    @ApiProperty({example : 'sabzavotlar' , type : String})
    @IsNotEmpty()
    @IsString()
    @Length(2,100)
    name : string
}

import { ApiProperty } from "@nestjs/swagger";
import { IsString, Length, MaxLength } from "class-validator";

export class CreateDeliverDto {
    @ApiProperty({type : String, example : 'Murodron'})
    @IsString()
    @Length(2,20)
    name : string

    @ApiProperty({type : String, minLength : 9 , maxLength : 9, example : '996663333'})
    @MaxLength(9)
    @IsString()
    phone : string

    @ApiProperty({type : String, minLength : 4, example : '1111'})
    @IsString()
    @Length(4,16)
    password : string

    @ApiProperty({type : String , minLength : 4, example : '1111'})
    @IsString()
    @Length(4,16)
    return_password :string
}

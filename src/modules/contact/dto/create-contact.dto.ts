import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Length } from "class-validator";

export class MessageDto {
    @ApiProperty({description :  `xabar matni`, example : 'salomaat, yaxshimisiiz ? '})
    @IsNotEmpty()
    @IsString()
    @Length(2,1000)
    message : string
}
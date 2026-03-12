import { IsNumber, IsString } from "class-validator";

export class CreateLocationDto {
    @IsNumber()
    lat: number;

    @IsNumber()
    lng: number;

    @IsString()
    address: string;

}


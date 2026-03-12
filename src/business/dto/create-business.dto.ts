import { IsOptional, IsString } from "class-validator";

export class CreateBusinessDto {
    @IsString()
    name: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    locationId: string;
}
import { IsArray, IsOptional, IsString, Matches } from "class-validator";

export class CreateBusinessDto {
    @IsString()
    name: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    locationId: string;

    @IsOptional()
    @IsString()
    @Matches(/^([01]\d|2[0-3]):[0-5]\d$/)
    pickupStartTime?: string;

    @IsOptional()
    @IsString()
    @Matches(/^([01]\d|2[0-3]):[0-5]\d$/)
    pickupEndTime?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    imageUrls?: string[];
}

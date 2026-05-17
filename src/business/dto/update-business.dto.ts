import { IsOptional, IsString, Matches } from "class-validator";

export class UpdateBusinessDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    locationId?: string;

    @IsOptional()
    @IsString()
    @Matches(/^([01]\d|2[0-3]):[0-5]\d$/)
    pickupStartTime?: string;

    @IsOptional()
    @IsString()
    @Matches(/^([01]\d|2[0-3]):[0-5]\d$/)
    pickupEndTime?: string;
}

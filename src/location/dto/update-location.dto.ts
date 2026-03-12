import { IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdateLocationDto {
  @IsOptional()
  @IsNumber()
  lat?: number;

  @IsOptional()
  @IsNumber()
  lng?: number;

  @IsOptional()
  @IsString()
  address?: string;
}
import { IsEnum, IsString, IsDateString, IsNumber, IsOptional, IsBoolean } from "class-validator";

enum Category {
    FOOD = 'food',
    DRINKS = 'drinks',
    BAKERY = 'bakery',
    OTHER = 'other',
}

export class UpdateProductDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsNumber()
    price?: number;

    @IsOptional()
    @IsNumber()
    quantity?: number;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @IsOptional()
    @IsEnum(Category)
    category?: Category;

    @IsOptional()
    @IsDateString()
    expiryDate?: Date;

    @IsOptional()
    @IsString()
    imgUrls?: string[];
}
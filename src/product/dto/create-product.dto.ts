import { IsEnum, IsString, IsNumber, IsOptional, IsBoolean, IsArray } from "class-validator";

enum Category {
    FOOD = 'food',
    DRINKS = 'drinks',
    BAKERY = 'bakery',
    OTHER = 'other',
}

export class CreateProductDto {
    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsNumber()
    price: number;

    @IsNumber()
    quantity: number;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @IsEnum(Category)
    category: Category;

    @IsString()
    businessId: string;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    imageUrl?: string[];
}

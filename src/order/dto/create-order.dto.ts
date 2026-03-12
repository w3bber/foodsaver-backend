import { IsArray, IsNumber, IsOptional, IsString, ValidateNested, IsEnum } from "class-validator";
import { Type } from "class-transformer";
import { OrderStatus } from "src/generated/prisma/enums";

export class CreateOrderItemDto {
    @IsString()
    productId: string;

    @IsNumber()
    quantity: number;
}

export class CreateOrderDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateOrderItemDto)
    items: CreateOrderItemDto[];

    @IsOptional()
    @IsEnum(OrderStatus)
    status?: OrderStatus;

    @IsString()
    businessId: string;
}
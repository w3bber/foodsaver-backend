import { IsEnum, IsOptional } from "class-validator";
import { OrderStatus } from "src/generated/prisma/enums";

export class UpdateOrderDto {
    @IsOptional()
    @IsEnum(OrderStatus)
    status?: OrderStatus;
}
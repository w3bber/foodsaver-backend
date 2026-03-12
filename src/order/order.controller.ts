import { Controller, UseGuards, Post, Body, Get, Param, Put, Delete, ForbiddenException } from "@nestjs/common";
import { OrderService } from "./order.service";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guards";
import  { CurrentUser } from "src/common/decorators/current-user.decorator";
import { Role, type User } from "src/generated/prisma/client";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { Roles } from "src/common/decorators/roles.decorator";
import { RolesGuard } from "src/common/guards/roles.guard";


@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrderController {
    constructor(private orderService: OrderService) {}

    @Post()
    async createOrder(
        @CurrentUser() user: User,
        @Body() dto: CreateOrderDto
    ) {
         return this.orderService.createOrder(user.id, dto);
    }

    @Get('/user')
    async getOrders(@CurrentUser() user: User) {
        return this.orderService.getOrdersByUserId(user.id);
    }

    @Get('/business/:id')
    async getOrdersByBusiness(@CurrentUser() user: User, @Param('id') businessId: string) {
        if (user.role !== Role.BUSINESS) {
            throw new ForbiddenException('Access denied');
        }
        return this.orderService.getOrdersByBusinessId(businessId);
    }

    @Get(':id')
    async getOrderById(@Param('id') id: string, @CurrentUser() user: User) {
        const order = await this.orderService.getOrderById(id);
        if (user.role === Role.USER){
            if (order?.userId !== user.id) {
                throw new ForbiddenException('Access denied');
            }
        }
        
        return order;
    }

    @Put(':id')
    async updateOrder(
        @Param('id') id: string,
        @Body() dto: UpdateOrderDto,
        @CurrentUser() user: User
    ) {
        return this.orderService.updateOrder(id, dto);
    }

    @Delete(':id')
    @UseGuards(RolesGuard)
    @Roles('ADMIN')
    async deleteOrder(@Param('id') id: string, @CurrentUser() user: User) {
        return this.orderService.deleteOrder(id);
    }    
}
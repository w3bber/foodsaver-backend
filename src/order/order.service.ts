import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { OrderStatus } from "src/generated/prisma/browser";
import { UpdateOrderDto } from "./dto/update-order.dto";

interface OrderItem {
    productId: string;
    quantity: number;
    price: number;
}

@Injectable()
export class OrderService {
    constructor(private prismaService: PrismaService) {}

    async createOrder(userId: string, dto: CreateOrderDto) {
        const { items, status = OrderStatus.PENDING, businessId } = dto;
        const orderItemsData: OrderItem[] = [];
        let total = 0;

        for (const item of items) {
            const product = await this.prismaService.product.findUnique({
                where: { id: item.productId },
            });

            if (!product) {
                throw new Error(`Product with ID ${item.productId} not found`);
            }

            if (product.quantity < item.quantity) {
                throw new Error(`Insufficient quantity for product ID ${item.productId}`);
            }

            if (!product.isActive) {
                throw new Error(`Product with ID ${item.productId} is not active`);
            }

            total += product.price * item.quantity;

            orderItemsData.push({
                productId: item.productId,
                quantity: item.quantity,
                price: product.price,
            });
        }

        const order = await this.prismaService.order.create({
            data: {
                userId,
                status, 
                total,
                items: {
                    create: orderItemsData,
                },
                businessId,
            },
            include: {
                items: true,
                business: {
                    include: {
                        location: true,
                    }
                }
            },
        });

        for (const item of items) {
            const product = await this.prismaService.product.findUnique({
                where: { id: item.productId },
            });

            if (!product) {
                throw new Error(`Product with id ${item.productId} not found`);
            }

            const newQuantity = product.quantity - item.quantity;

            await this.prismaService.product.update({
                where: { id: item.productId },
                data: {
                    quantity: newQuantity,
                    isActive: newQuantity > 0,
                }
            });
        }

        return order;
    }

    async getOrderById(id: string) {
        return this.prismaService.order.findUnique({
            where: { id },
            include: {
                items: {
                    include: {
                        product: true,
                    }  
                },
                user: true,
                business: {
                    include: {
                        location: true,
                    }
                }
            },
        });
    }

    async getOrdersByUserId(userId: string) {
        return this.prismaService.order.findMany({
            where: { userId },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
                business: {
                    include: {
                        location: true,
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async getOrdersByBusinessId(businessId: string) {
        return this.prismaService.order.findMany({
            where: { businessId },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
                business: {
                    include: {
                        location: true,
                    }
                }
            },
        });
    }

    async updateOrder(id: string, dto: UpdateOrderDto) {
        return this.prismaService.order.update({
            where: { id },
            data: dto,
        });
    }

    async deleteOrder(id: string) { 
        await this.prismaService.orderItem.deleteMany({
            where: { orderId: id},
        });

        return this.prismaService.order.delete({
            where: { id },
        });
    }
}    
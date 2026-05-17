import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { NotificationService } from "src/notification/notification.service";

@Injectable()
export class ProductService {
    constructor(
        private prismaService: PrismaService, 
        private notificationService: NotificationService
    ) {}

    async createProduct(dto: CreateProductDto) {
        return this.prismaService.product.create({
            data: dto,
        });
    }

    async getProductById(id: string) {
        const product = this.prismaService.product.findUnique({
            where: { id },
            include: {
                business: {
                    include: {
                        location: true,
                    }
                }
            }
        });

        if (!product) {
            throw new NotFoundException(`Product with id ${id} not found`);
        }

        return product;
    }

    async getProducts(filters?: {
        category?: string;
        isActive?: boolean;
        businessId?: string;
        locationId?: string;
    }) {
        const {category, isActive, businessId, locationId} = filters || {};

        return this.prismaService.product.findMany({
            where: {
                ...(category && { category }),
                ...(businessId && { businessId }),
                ...(isActive && {isActive}),
                ...(locationId && {
                    business: {
                        locationId: locationId,
                    },
                }),
            },
            include: {
                business: {
                    include: {
                        location: true,
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async updateProduct(id: string, dto: UpdateProductDto) {
        const existingProduct = await this.prismaService.product.findUnique({
            where: { id },
            select: { price: true, quantity: true, businessId: true },
        });

        if (!existingProduct) {
            throw new NotFoundException('Product not found');
        }
        const updatedProduct = await this.prismaService.product.update({
            where: { id },
            data: dto,
        });

        const priceChanged = dto.price !== undefined && dto.price !== existingProduct.price;
        const quantityChanged = dto.quantity !== undefined && dto.quantity !== existingProduct.quantity;

        if (priceChanged || quantityChanged) {
            this.notificationService.notifyProductRestock(updatedProduct.businessId)
                .catch(err => console.error('Failed to send notification:', err));
        }

        return updatedProduct;
    }
    

    async deleteProduct(id: string) {
        return this.prismaService.product.delete({
            where: { id },
        });
    }
}

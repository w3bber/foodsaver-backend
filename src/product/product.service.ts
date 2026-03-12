import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";

@Injectable()
export class ProductService {
    constructor(private prismaService: PrismaService) {}

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
        minExpiryDate?: Date;
        maxExpiryDate?: Date;
    }) {
        const {category, isActive, businessId, locationId, minExpiryDate, maxExpiryDate} = filters || {};

        console.log('minExpiryDate:', minExpiryDate, 'isValid:', (minExpiryDate?.getDate()));
        console.log('maxExpiryDate:', maxExpiryDate, 'isValid:', (maxExpiryDate?.getDate()));

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
                ...(minExpiryDate || maxExpiryDate ? {
                    expiryDate: {
                        ...(minExpiryDate && {gte: minExpiryDate}),
                        ...(maxExpiryDate && {lte: maxExpiryDate}),
                    }
                } : {}),
            },
            include: {
                business: {
                    include: {
                        location: true,
                    }
                }
            },
            orderBy: { expiryDate: 'asc' },
        });
    }

    async updateProduct(id: string, dto: UpdateProductDto) {
        return this.prismaService.product.update({
            where: { id },
            data: dto,
        });
    }

    async deleteProduct(id: string) {
        return this.prismaService.product.delete({
            where: { id },
        });
    }
}
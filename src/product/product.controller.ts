import { Body, Controller, Delete, ForbiddenException, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { ProductService } from "./product.service";
import { CurrentUser } from "src/common/decorators/current-user.decorator";
import type { User } from "src/generated/prisma/client";
import { CreateProductDto } from "./dto/create-product.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guards";
import { UpdateProductDto } from "./dto/update-product.dto";
import { RolesGuard } from "src/common/guards/roles.guard";
import { Roles } from "src/common/decorators/roles.decorator";


@Controller('products')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'BUSINESS')
export class ProductController {
    constructor(private productService: ProductService,
        private prisma: PrismaService
    ) {}

    @Post()
    async createProduct(@Body() dto: CreateProductDto, @CurrentUser() user: User) {
        const business = await this.prisma.business.findUnique({
            where: { id: dto.businessId },
        });

        if (!business || business.ownerId !== user.id) {
            throw new ForbiddenException('access denied');
        }

        return this.productService.createProduct(dto);
    }

    @Get(':id')
    async getProductById(@Param('id') id: string) {
        return this.productService.getProductById(id);
    }

    @Get()
    async getProducts(
        @Query('category') category?: string,
        @Query('isActive') isActive?: boolean,
        @Query('businessId') businessId?: string,
        @Query('locationId') locationId?: string,
    ) {
        return this.productService.getProducts({
            category,
            isActive: isActive ? isActive === true : undefined,
            businessId,
            locationId,
        });
    }

    @Put(':id')
    async updateProduct(
        @Param('id') id: string,
        @Body() dto: UpdateProductDto,
        @CurrentUser() user: User
    ) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: { business: true },
        });

        if (!product || product.business.ownerId !== user.id) {
            throw new ForbiddenException('acces denied');
        }

        return this.productService.updateProduct(id, dto);
    }

    @Delete(':id')
    async deleteProduct(@Param('id') id: string, @CurrentUser() user: User) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: { business: true },
        });
        if (!product || product.business.ownerId !== user.id) {
            throw new Error('Access denied');
        }
        return this.productService.deleteProduct(id);
    }
}

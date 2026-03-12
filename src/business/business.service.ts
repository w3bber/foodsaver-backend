import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateBusinessDto } from "./dto/create-business.dto";
import { NotFoundException, ForbiddenException } from "@nestjs/common";
import { UpdateBusinessDto } from "./dto/update-business.dto";
import { Role } from "src/generated/prisma/enums"; 

@Injectable()
export class BusinessService {
    constructor(private prisma: PrismaService) {}

    async createBusiness(userId: string, dto: CreateBusinessDto) {        
        const location = await this.prisma.location.findUnique({
            where: { id: dto.locationId },
        });

        if(!location) {
            throw new NotFoundException(`Location with id ${dto.locationId} not found`);
        }

        return this.prisma.business.create({
            data: {
                name: dto.name,
                description: dto.description,
                ownerId: userId,
                locationId: dto.locationId,
            },
        });
    }

    async getBusinessById(id: string) {
        const business = await this.prisma.business.findUnique({
            where: { id },
            include: {
                owner: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                    }
                },
                location: true,
                products: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        category: true,
                        price: true,
                        quantity: true,
                        isActive: true,
                        expiryDate: true,
                        imageUrl: true,
                    }
                }
            }
        });

        if (!business) {
            throw new NotFoundException(`Business with id ${id} not found`);
        }

        return business;
    }

    async getBusinessesByOwnerId(ownerId: string) {
        return this.prisma.business.findMany({
            where: { ownerId },
            include: {
                location: true,
                products: {
                    select: {
                        id: true,
                        name: true,
                        category: true,
                        price: true,
                        quantity: true,
                        isActive: true,
                        expiryDate: true,
                    }
                }
            }
        });
    }

    async getAllBusinesses() {
        return this.prisma.business.findMany({
            select: {
                id: true,
                name: true,
                description: true,
                imageUrl: true,
                location: {
                    select: {
                        lat: true,
                        lng: true,
                        address: true,
                    }
                }
            }
        });
    }

    async updateBusiness(id: string, dto: UpdateBusinessDto, userId: string) {
        const business = await this.prisma.business.findUnique({
            where: { id },
        });

        if (!business || business.ownerId !== userId) {
            throw new NotFoundException(`Business with id ${id} not found or access denied`);
        }

        return this.prisma.business.update({
            where: { id },
            data: dto,
        });
    }

    async deleteBusiness(id: string, userId: string) {
        const business = await this.prisma.business.findUnique({
            where: { id },
        });

        if (!business || business.ownerId !== userId) {
            throw new NotFoundException(`Business with id ${id} not found or access denied`);
        }

        return this.prisma.business.delete({
            where: { id },
        });
    }   
}
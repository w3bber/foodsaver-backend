import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class FavoriteService {
    constructor(private readonly prisma: PrismaService) {}

    async addToFavorites(userId: string, businessId: string) {
        try {
            const favorite = await this.prisma.favoriteBusiness.create({
                data: {
                    userId,
                    businessId,
                },
            });

            return favorite;
        } catch (error) {
            console.error('Error adding to favorites:', error);
            throw error;
        }
    }

    async removeFromFavorites(userId: string, businessId: string) {
        try {
            await this.prisma.favoriteBusiness.deleteMany({
                where: { userId, businessId },
            });
        } catch (error) {
            console.error('Error removing from favorites:', error);
            throw error;
        }
    }

    async getUserFavorites(userId: string) {
        try {
            const favorites = await this.prisma.favoriteBusiness.findMany({
                where: { userId },
                include: {
                    business: {
                        include: {
                            location: true,
                        }
                    }
                }
            });

            return favorites.map(fav => fav.business);
        } catch (error) {
            console.error('Error fetching user favorites:', error);
            throw error;
        }
    }

    async isFavorite(userId: string, businessId: string): Promise<boolean> {
        const favorite = await this.prisma.favoriteBusiness.findUnique({
            where: {
                userId_businessId: {
                    userId,
                    businessId,
                },
            },
            select: {
                id: true, 
            },
        });

        return !!favorite;
    }
}
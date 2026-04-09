import { Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guards";
import { CurrentUser } from "src/common/decorators/current-user.decorator";
import { type User } from "src/generated/prisma/client";
import { FavoriteService } from "./favorite.service";

@Controller('favorites')
@UseGuards(JwtAuthGuard)
export class FavoriteController {
    constructor(private readonly favoriteService: FavoriteService) {}

    @Post(':businessId')
    addToFavorites(@CurrentUser() user: User, @Param('businessId') businessId: string) {
        return this.favoriteService.addToFavorites(user.id, businessId);
    }

    @Delete(':businessId')
    removeFromFavorites(@CurrentUser() user: User, @Param('businessId') businessId: string) {
        return this.favoriteService.removeFromFavorites(user.id, businessId);
    }

    @Get()
    getFavorites(@CurrentUser() user: User) {
        return this.favoriteService.getUserFavorites(user.id);
    }

    @Get(':businessId/check')
    async isFavorite(
        @CurrentUser() user: User,
        @Param('businessId') businessId: string,
    ) {
        return this.favoriteService.isFavorite(user.id, businessId);
    }

}
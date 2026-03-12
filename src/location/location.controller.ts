import { Body, Controller, Get, Param, Post, Query, UseGuards, Put, Delete } from "@nestjs/common";
import { LocationService } from "./location.service";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guards";
import { CreateLocationDto } from "./dto/create-location.dto";
import { UpdateLocationDto } from "./dto/update-location.dto";
import { CurrentUser } from "src/common/decorators/current-user.decorator";
import type { User } from "src/generated/prisma/client";

@Controller('locations')
export class LocationController {
    constructor(private locationService: LocationService) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    async createLocation(@Body() dto: CreateLocationDto) {
        return this.locationService.createLocation(dto);
    }

    @Get(':id')
    async getLocation(@Param('id') id: string) {
        return this.locationService.getLocationById(id);
    }

    @Get()
    async getLocations(
        @Query('lat') lat?: string,
        @Query('lng') lng?: string,
        @Query('radius') radius?: string,
    ) {
        return this.locationService.getLocations({
            lat: lat ? parseFloat(lat) : undefined,
            lng: lng ? parseFloat(lng) : undefined,
            radius: radius ? parseFloat(radius) : undefined,
        }); 
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async updateLocation(
        @Param('id') id: string,
        @Body() dto: UpdateLocationDto, 
        @CurrentUser() user: User
    ) {
        if (user.role !== 'ADMIN' && user.role !== 'BUSINESS') {
            throw new Error('Access denied');
        }

        return this.locationService.updateLocation(id, dto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteLocation(
        @Param('id') id: string,
        @CurrentUser() user: User
    ) {
        if (user.role !== 'ADMIN' && user.role !== 'BUSINESS') {
            throw new Error('Access denied');
        }
        return this.locationService.deleteLocation(id);
    }
}
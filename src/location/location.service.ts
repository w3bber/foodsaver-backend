import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateLocationDto } from "./dto/create-location.dto";
import { UpdateLocationDto } from "./dto/update-location.dto";

@Injectable()
export class LocationService {
    constructor(private prisma: PrismaService) {}

    async createLocation(dto: CreateLocationDto) {
        return this.prisma.location.create({
            data: dto
        });
    }

    async getLocationById(id: string) {
        const location = this.prisma.location.findUnique({
            where: { id },
            include: {
                businesses: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                    }
                }
            }
        });

        if (!location) {
            throw new NotFoundException(`Location with ID ${id} not found`);
        }

        return location;
    }
    
    async getLocations(filters: {lat?: number, lng?: number, radius?: number}) {
        const {lat, lng, radius} = filters;

        if (lat && lng && radius) {
            // 6371 - earth radius (km)
            return this.prisma.$queryRaw`
            SELECT *,
               (6371 * acos(
                 cos(radians(${lat})) *
                 cos(radians(lat)) *
                 cos(radians(lng) - radians(${lng})) +
                 sin(radians(${lat})) *
                 sin(radians(lat))
               )) AS distance
            FROM "Location"
            HAVING distance < ${radius}
            ORDER BY distance;`; 
        }

        return this.prisma.location.findMany({
            include: {
                businesses: {
                    select: {
                        id: true,
                        name: true,
                        description: true
                    }
                }
            }
        });
    }

    async updateLocation(id: string, dto: UpdateLocationDto) {
        return this.prisma.location.update({
            where: { id },
            data: dto,
        });
    }

    async deleteLocation(id: string) {
        return this.prisma.location.delete({
            where: { id }
        });
    }


}
import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { Role } from "src/generated/prisma/client";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UserService {
    constructor(private prismaService: PrismaService) {}

    async createUser(dto: CreateUserDto) {
        return this.prismaService.user.create({
            data: {
                email: dto.email,
                password: dto.password,
                firstName: dto.firstName,
                lastName: dto.lastName,
                role: dto.role || Role.USER,
            },
        });
    }

    async findUserById(id: string) {
        return this.prismaService.user.findUnique({
            where: { id },
        });
    }

    async findUserByEmail(email: string) {
        return this.prismaService.user.findUnique({
            where: { email },
        });
    }

    async findAllUsers() {
        return this.prismaService.user.findMany({
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            }
        });
    }

    async updateUser(id: string, dto: UpdateUserDto) {
        return this.prismaService.user.update({
            where: { id },
            data: dto
        });
    }

    async deleteUser(id: string) {
        return this.prismaService.user.delete({
            where: { id },
        });
    }
}
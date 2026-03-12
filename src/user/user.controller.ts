import { Controller, Get, UseGuards, Body, Param, Post, Put, Delete } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guards";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { CurrentUser } from "src/common/decorators/current-user.decorator";
import { Role, type User } from "src/generated/prisma/client";
import { RolesGuard } from "src/common/guards/roles.guard";
import { Roles } from "src/common/decorators/roles.decorator";


@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
    constructor(private userService: UserService) {}

    @Roles('ADMIN')
    @Post()
    async createUser(@Body() dto: CreateUserDto) {
        return this.userService.createUser(dto);
    }
    
    @Roles('ADMIN', 'USER', 'BUSINESS')
    @Get(':id')
    async getUserById(@Param('id') id: string) {
        return this.userService.findUserById(id);
    }

    @Roles('ADMIN')
    @Get()
    async getAllUsers() {
        return this.userService.findAllUsers();
    }

    @Roles('ADMIN')
    @Delete(':id')
    async deleteUser(@Param('id') id: string) {
        return this.userService.deleteUser(id);
    }

    @Roles('ADMIN', 'BUSINESS', 'USER')
    @Put(':id')
    async updateUser(@Param('id') id: string, @Body() dto: UpdateUserDto) {
        return this.userService.updateUser(id, dto);
    }
}
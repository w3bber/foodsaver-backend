import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { Role } from "src/generated/prisma/enums";


@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService, 
        private jwtService: JwtService
    ) {}

    async register(dto: RegisterDto) {
        // Проверка: пользователь не может назначить себе роль ADMIN
        if (dto.role === Role.ADMIN) {
            throw new BadRequestException('Cannot register as ADMIN. Contact administrator.');
        }

        return this.prisma.user.create({
            data: {
                email: dto.email,
                password: dto.password,
                firstName: dto.firstName,
                lastName: dto.lastName,
                role: dto.role || Role.USER
            },
        })
    }

    async login(dto: LoginDto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (!user || user.password !== dto.password) {
            throw new Error('Invalid credentials');
        }
        return this.generateToken(user);
    }

    private generateToken(user: any) {
        const payload = { sub: user.id, email: user.email, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
        }
    }
}
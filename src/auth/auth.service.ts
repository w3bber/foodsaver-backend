import { Injectable, BadRequestException, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { Role } from "src/generated/prisma/enums";
import type { StringValue } from "ms";


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
        const accessExpiresIn = (process.env.JWT_ACCESS_EXPIRES_IN || '15m') as StringValue;
        const refreshExpiresIn = (process.env.JWT_REFRESH_EXPIRES_IN || '30d') as StringValue;

        return {
            access_token: this.jwtService.sign(payload, {
                expiresIn: accessExpiresIn,
            }),
            refresh_token: this.jwtService.sign(payload, {
                secret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || 'defaultRefreshSecret',
                expiresIn: refreshExpiresIn,
            }),
        }
    }

    async refreshAccessToken(refreshToken: string) {
        if (!refreshToken) {
            throw new UnauthorizedException('Refresh token is required');
        }

        let payload: any;
        try {
            payload = await this.jwtService.verifyAsync(refreshToken, {
                secret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || 'defaultRefreshSecret',
            });
        } catch {
            throw new UnauthorizedException('Invalid refresh token');
        }

        const userId = payload.sub;
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        return this.generateToken(user);
    }
}

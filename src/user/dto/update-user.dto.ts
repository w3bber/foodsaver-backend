import { IsEmail, IsIn, IsOptional, IsString } from "class-validator";
import { Role } from "src/generated/prisma/enums";

export class UpdateUserDto {
    @IsEmail()
    @IsOptional()
    email?: string;

    @IsString()
    @IsOptional()
    firstName?: string;

    @IsString()
    @IsOptional()
    lastName?: string;

    @IsString()
    @IsOptional()
    password?: string;

    @IsOptional()
    @IsIn([Role.ADMIN, Role.USER, Role.BUSINESS])
    role?: Role;
}
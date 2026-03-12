import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { BusinessService } from './business.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guards";
import  { CurrentUser } from "src/common/decorators/current-user.decorator";
import type { User } from "src/generated/prisma/client";
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';


@Controller('businesses')
export class BusinessController {
  constructor(private businessService: BusinessService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'BUSINESS')
  @Post()
  async createBusiness(@CurrentUser() user: User, @Body() dto: CreateBusinessDto) {
    return this.businessService.createBusiness(user.id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'BUSINESS', 'USER')
  @Get('all')
  async getAllBusinesses() {
    return await this.businessService.getAllBusinesses();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'BUSINESS', 'USER')
  @Get(':id')
  async getBusinessById(@Param('id') id: string, @CurrentUser() user: User) {
    return await this.businessService.getBusinessById(id);
  }

  

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'BUSINESS')
  @Get()
  async getBusinessesByOwnerId(@CurrentUser() user: User) {
    return await this.businessService.getBusinessesByOwnerId(user.id);
  }


  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'BUSINESS')
  @Put(':id')
  async updateBusiness(
    @Param('id') id: string,
    @Body() dto: UpdateBusinessDto,
    @CurrentUser() user: User,
  ) {
    return await this.businessService.updateBusiness(id, dto, user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'BUSINESS')
  @Delete(':id')
  async deleteBusiness(@Param('id') id: string, @CurrentUser() user: User) {
    return await this.businessService.deleteBusiness(id, user.id);
  }
}
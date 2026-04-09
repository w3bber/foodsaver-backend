import { Controller, Post, UseGuards, Body, Delete, Param, Get } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guards";
import { NotificationService } from "./notification.service";
import { CurrentUser } from "src/common/decorators/current-user.decorator";
import { type User } from "src/generated/prisma/client";
import { SaveDeviceTokenDto } from "./dto/save-device-token.dto";
import { RemoveDeviceTokenDto } from "./dto/remove-device-token.dto";


@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) {}

    @Post('device-token')
    saveDeviceToken(@CurrentUser() user: User, @Body() dto: SaveDeviceTokenDto) {
        return this.notificationService.saveDeviceToken(user.id, dto.token, dto.platform);
    }

    @Delete('device-token')
    deleteDeviceToken(@CurrentUser() user: User, @Body() token: RemoveDeviceTokenDto) {
        return this.notificationService.removeDeviceToken(user.id, token.token);
    }
}


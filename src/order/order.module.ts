import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { OrderController } from "./order.controller";
import { OrderService } from "./order.service";
import { NotificationModule } from "src/notification/notification.module";

@Module({
    imports: [PrismaModule, NotificationModule],
    controllers: [OrderController],
    providers: [OrderService],
})
export class OrderModule {}
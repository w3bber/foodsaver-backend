import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { ProductController } from "./product.controller";
import { ProductService } from "./product.service";
import { NotificationModule } from "src/notification/notification.module";

@Module({
    imports: [PrismaModule, NotificationModule],
    controllers: [ProductController],
    providers: [ProductService],
})
export class ProductModule {}
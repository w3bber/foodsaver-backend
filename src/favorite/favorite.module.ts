import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { FavoriteService } from "./favorite.service";
import { FavoriteController } from "./favorite.controller";

@Module({
  imports: [PrismaModule],
  providers: [FavoriteService],
  exports: [FavoriteService],
  controllers: [FavoriteController],
})
export class FavoriteModule {}
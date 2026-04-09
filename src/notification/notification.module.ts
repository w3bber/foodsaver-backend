import { Module } from "@nestjs/common";
import { FirebaseModule } from "./firebase/firebase.module";
import { PrismaModule } from "src/prisma/prisma.module";
import { NotificationService } from "./notification.service";
import { NotificationController } from "./notification.controller";

@Module({
  imports: [FirebaseModule, PrismaModule],
  providers: [NotificationService],
  exports: [NotificationService],
  controllers: [NotificationController],
})
export class NotificationModule {}
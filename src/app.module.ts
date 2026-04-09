import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BusinessModule } from './business/business.module';
import { LocationModule } from './location/location.module';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { NotificationModule } from './notification/notification.module';
import { FavoriteModule } from './favorite/favorite.module';


@Module({
  imports: [
    PrismaModule, 
    AuthModule, 
    UserModule, 
    BusinessModule, 
    LocationModule, 
    ProductModule,
    OrderModule,
    NotificationModule,
    FavoriteModule
  ],
})
export class AppModule {}

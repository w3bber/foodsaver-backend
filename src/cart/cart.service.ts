import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async getCart(userId: string) {
    return this.prisma.cart.findMany({
      where: { userId },
      include: this.cartInclude,
      orderBy: { updatedAt: 'desc' },
    });
  }

  async addItem(userId: string, productId: string, quantity: number) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: { business: true },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (!product.isActive) {
      throw new BadRequestException('Product is not active');
    }

    const cart = await this.prisma.cart.upsert({
      where: {
        userId_businessId: {
          userId,
          businessId: product.businessId,
        },
      },
      create: {
        userId,
        businessId: product.businessId,
      },
      update: {},
    });

    const existingItem = await this.prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    });
    const nextQuantity = (existingItem?.quantity ?? 0) + quantity;

    if (nextQuantity > product.quantity) {
      throw new BadRequestException('Insufficient product quantity');
    }

    await this.prisma.cartItem.upsert({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
      create: {
        cartId: cart.id,
        productId,
        quantity,
      },
      update: {
        quantity: {
          increment: quantity,
        },
      },
    });

    return this.getCart(userId);
  }

  async updateItem(userId: string, productId: string, quantity: number) {
    const item = await this.prisma.cartItem.findFirst({
      where: {
        productId,
        cart: { userId },
      },
      include: {
        product: true,
      },
    });

    if (!item) {
      throw new NotFoundException('Cart item not found');
    }

    if (!item.product.isActive) {
      throw new BadRequestException('Product is not active');
    }

    if (quantity > item.product.quantity) {
      throw new BadRequestException('Insufficient product quantity');
    }

    await this.prisma.cartItem.update({
      where: { id: item.id },
      data: { quantity },
    });

    return this.getCart(userId);
  }

  async removeItem(userId: string, productId: string) {
    const item = await this.prisma.cartItem.findFirst({
      where: {
        productId,
        cart: { userId },
      },
      include: { cart: true },
    });

    if (!item) {
      return this.getCart(userId);
    }

    await this.prisma.cartItem.delete({
      where: { id: item.id },
    });

    await this.deleteCartIfEmpty(item.cartId);

    return this.getCart(userId);
  }

  async clearBusinessCart(userId: string, businessId: string) {
    const cart = await this.prisma.cart.findUnique({
      where: {
        userId_businessId: {
          userId,
          businessId,
        },
      },
    });

    if (!cart) {
      return this.getCart(userId);
    }

    await this.prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });
    await this.prisma.cart.delete({
      where: { id: cart.id },
    });

    return this.getCart(userId);
  }

  async clearCart(userId: string) {
    const carts = await this.prisma.cart.findMany({
      where: { userId },
      select: { id: true },
    });
    const cartIds = carts.map((cart) => cart.id);

    await this.prisma.cartItem.deleteMany({
      where: { cartId: { in: cartIds } },
    });
    await this.prisma.cart.deleteMany({
      where: { userId },
    });

    return [];
  }

  private async deleteCartIfEmpty(cartId: string) {
    const itemsCount = await this.prisma.cartItem.count({
      where: { cartId },
    });

    if (itemsCount === 0) {
      await this.prisma.cart.delete({
        where: { id: cartId },
      });
    }
  }

  private readonly cartInclude = {
    business: {
      include: {
        location: true,
      },
    },
    items: {
      include: {
        product: true,
      },
    },
  };
}

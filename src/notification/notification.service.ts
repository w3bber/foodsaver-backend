import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { FirebaseService } from "./firebase/firebase.service";
import { Order, Product } from "src/generated/prisma/client";
import { NotificationPayload, NotificationType } from "./types";

@Injectable()
export class NotificationService {
    constructor(private readonly prisma: PrismaService,
                private readonly firebase: FirebaseService
    ) {}

    async notifyNewOrder(order: Order) {
        try {
            const business = await this.prisma.business.findUnique({
                where: { id: order.businessId },
                include: {
                    owner: {
                        include: {
                            deviceTokens: true,
                        }
                    }
                }
            });

            if (!business) {
                throw new Error(`Business with ID ${order.businessId} not found`);
            }

            const tokens = business.owner.deviceTokens.map(dt => dt.token);

            if (tokens.length === 0) {
                console.log(`No device tokens for user ${business.ownerId}`);
                return;
            }

            const payload: NotificationPayload = {
                notification: {
                    title: '🛒 Новый заказ!',
                    body: `Заказ на сумму ${order.total} ₽ ожидает подтверждения`,
                },
                data: {
                    type: NotificationType.NEW_ORDER,
                    orderId: order.id,
                    businessId: order.businessId,
                }, 
                tokens: tokens,
            };

            await this.firebase.sendToDevices(tokens, payload);
        } catch (error) {
            console.error('Error sending notification NEW_ORDER:', error);
        }
    }

    async notifyOrderCompleted(order: Order) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id: order.userId },
                include: {
                    deviceTokens: true,
                }
            });

            if (!user) {
                throw new Error(`User with ID ${order.userId} not found`);
            }

            const tokens = user.deviceTokens.map((dt) => dt.token);

            if (tokens.length === 0) {
                console.log(`No device tokens for user ${order.userId}`);
                return;
            }

            const payload: NotificationPayload = {
                notification: {
                    title: '✅ Заказ готов!',
                    body: 'Ваш заказ собран и ожидает выдачи',
                },
                data: {
                    type: NotificationType.ORDER_COMPLETED,
                    orderId: order.id,
                    businessId: order.businessId,
                },
                tokens: tokens,
            };

            await this.firebase.sendToDevices(tokens, payload);
        } catch (error) {
            console.error('Error sending notification ORDER_COMPLETED:', error);
        }
    }

    async notifyProductRestock(businessId: string) {
        try {
            const business = await this.prisma.business.findUnique({
                where: { id: businessId },
            });

            if (!business) {
                throw new Error(`Business with ID ${businessId} not found`);
            }

            const favorites = await this.prisma.favoriteBusiness.findMany({
                where: { businessId },
                include: {
                    user: {
                        include: {
                            deviceTokens: true,
                        }
                    }
                },
            });

            if (favorites.length === 0) {
                console.log(`No users have favorited business ${businessId}`);
                return;
            }

            const tokens = favorites.flatMap(fav => fav.user.deviceTokens.map(dt => dt.token));

            if (tokens.length === 0) {
                console.log(`No device tokens for users who favorited business ${businessId}`);
                return;
            }

            const payload: NotificationPayload = {
                notification: {
                    title: `🔥 Пополнение в "${business.name}"!`,
                    body: 'Посмотрите новые товары, которые появились в наличии',
                },
                data: {
                    type: NotificationType.PRODUCT_RESTOCK,
                    businessId,
                },
                tokens: tokens,
            };
                
            await this.firebase.sendToDevices(tokens, payload);
        } catch (error) {
            console.error('Error sending notification PRODUCT_RESTOCK:', error);
        }
    }

    async saveDeviceToken(userId: string, token: string, platform: string) {
        try {
            const deviceToken = await this.prisma.deviceToken.upsert({
                where: { token },
                update: { userId, platform },
                create: { userId, token, platform },
            });

            return deviceToken;
        } catch (error) {
            console.error('Error saving device token:', error);
            throw error;
        }
    }

    async removeDeviceToken(userId: string, token: string) {
        try {
            await this.prisma.deviceToken.delete({
                where: { token, userId },
            });
        } catch (error) {
            console.error('Error removing device token:', error);
            throw error;
        }
    }
}
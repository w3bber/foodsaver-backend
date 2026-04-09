export enum NotificationType {
  NEW_ORDER = 'NEW_ORDER',
  ORDER_COMPLETED = 'ORDER_COMPLETED',
  PRODUCT_RESTOCK = 'PRODUCT_RESTOCK',
}

export interface NotificationPayload {
  notification: {
    title: string;
    body: string;
  };
  data: {
    type: NotificationType;
    orderId?: string;
    businessId?: string;
    productId?: string;
    userId?: string;
  };
  tokens: string[];
}
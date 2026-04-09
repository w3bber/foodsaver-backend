import { Injectable, OnModuleInit } from "@nestjs/common";
import * as admin from "firebase-admin";

@Injectable()
export class FirebaseService implements OnModuleInit {
    private app: admin.app.App;

    onModuleInit() {
        try {   
            this.app = admin.initializeApp({
                credential: admin.credential.cert(
                process.env.FIREBASE_CREDENTIALS || './src/config/firebase-service-account.json'  
                ),
            });
        } catch (error) {
            throw new Error(`Failed to initialize Firebase Admin SDK: ${error.message}`);
        }
    }

    getMessaging(): admin.messaging.Messaging {
        return admin.messaging(this.app);
    }

    async sendToDevice(token: string, payload: admin.messaging.Message) {
        try {
            const message: admin.messaging.Message = {
                ...payload,
                token,
            };

            const response = await this.getMessaging().send(message);
            return true;
        } catch (error) {
            throw new Error(`Failed to send notification: ${error.message}`);
        }
    }

    async sendToDevices(tokens: string[], payload: admin.messaging.MulticastMessage) {
        try {
            const response = await this.getMessaging().sendEachForMulticast(payload);
            return response;
        } catch (error) {
            throw new Error(`Failed to send notifications: ${error.message}`);
        }
    }
}
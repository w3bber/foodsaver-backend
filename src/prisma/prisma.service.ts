import "dotenv/config";
import { Global, Injectable } from '@nestjs/common';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
@Global()
export class PrismaService extends PrismaClient {
  constructor() {
    const adapter = new PrismaPg({ url: process.env.DATABASE_URL });
    super({ 
      adapter,
      log: ['info', 'warn', 'error'], 
    });
  }
}

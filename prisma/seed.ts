import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...\n');

  // Clean up existing data (только для разработки!)
  await prisma.favoriteBusiness.deleteMany();
  await prisma.deviceToken.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.business.deleteMany();
  await prisma.location.deleteMany();
  await prisma.user.deleteMany();

  console.log('✓ Cleaned existing data\n');

  // Создаем локации
  const location1 = await prisma.location.create({
    data: {
      lat: 55.7558,
      lng: 37.6173,
      address: 'Москва, Красная площадь, 1',
    },
  });

  console.log('✓ Created locations\n');

  // Хешируем пароли
  const hashedPassword = await bcrypt.hash('password123', 10);

  // 1️⃣ АДМИН
  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'ADMIN',
      firstName: 'Admin',
      lastName: 'User',
      imageUrl: [],
    },
  });
  console.log(`✓ Created ADMIN: ${admin.email}`);

  // 2️⃣ БИЗНЕС ВЛАДЕЛЕЦ (Business Owner)
  const businessOwner = await prisma.user.create({
    data: {
      email: 'business@example.com',
      password: hashedPassword,
      role: 'BUSINESS',
      firstName: 'Иван',
      lastName: 'Владелец',
      imageUrl: [],
    },
  });
  console.log(`✓ Created BUSINESS owner: ${businessOwner.email}`);

  // 3️⃣ ОБЫЧНЫЙ ПОЛЬЗОВАТЕЛЬ (Regular User)
  const regularUser = await prisma.user.create({
    data: {
      email: 'user@example.com',
      password: hashedPassword,
      role: 'USER',
      firstName: 'Петр',
      lastName: 'Клиент',
      imageUrl: [],
    },
  });
  console.log(`✓ Created USER: ${regularUser.email}\n`);

  // Создаем бизнес для владельца
  const business = await prisma.business.create({
    data: {
      name: 'Эко-Кафе "Зеленый лист"',
      description: 'Кафе с акцентом на переработку и спасение продуктов',
      ownerId: businessOwner.id,
      locationId: location1.id,
      imageUrl: [],
    },
  });
  console.log(`✓ Created business: ${business.name}\n`);

  // Создаем товары (со скидкой - они близки к сроку)
  const product1 = await prisma.product.create({
    data: {
      name: 'Свежие булочки',
      description: 'Булочки, сделанные утром. Экономия 40%',
      price: 30,
      category: 'bakery',
      expiryDate: new Date(Date.now() + 2 * 60 * 60 * 1000), // на 2 часа позже
      quantity: 15,
      isActive: true,
      businessId: business.id,
      imageUrl: [],
    },
  });

  const product2 = await prisma.product.create({
    data: {
      name: 'Овощной салат',
      description: 'Свежий салат. Срок действительности 3 часа. Скидка 50%',
      price: 60,
      category: 'food',
      expiryDate: new Date(Date.now() + 3 * 60 * 60 * 1000),
      quantity: 8,
      isActive: true,
      businessId: business.id,
      imageUrl: [],
    },
  });

  console.log('✓ Created products\n');

  // Добавляем бизнес в избранное у обычного пользователя
  await prisma.favoriteBusiness.create({
    data: {
      userId: regularUser.id,
      businessId: business.id,
    },
  });
  console.log('✓ Added business to favorites\n');

  console.log('✅ Seed completed successfully!');
  console.log('\n📝 Test credentials:');
  console.log('   Admin:    admin@example.com / password123');
  console.log('   Business: business@example.com / password123');
  console.log('   User:     user@example.com / password123');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

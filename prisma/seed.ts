import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client';

const prisma = new PrismaClient();

const password = 'password123';

const coverImages = [
  'https://fra.cloud.appwrite.io/v1/storage/buckets/69725afe001897636f4a/files/6a09aa37001eb1c1283f/view?project=6972581d002dc8c7cecb&mode=admin',
  'https://fra.cloud.appwrite.io/v1/storage/buckets/69725afe001897636f4a/files/6a09aa37001ebfc0e3d6/view?project=6972581d002dc8c7cecb&mode=admin',
];

const productImages = [
  'https://fra.cloud.appwrite.io/v1/storage/buckets/69725afe001897636f4a/files/6a09ad710010cf79ebf3/view?project=6972581d002dc8c7cecb&mode=admin',
  'https://fra.cloud.appwrite.io/v1/storage/buckets/69725afe001897636f4a/files/6a09ad710010c49905b4/view?project=6972581d002dc8c7cecb&mode=admin',
  'https://fra.cloud.appwrite.io/v1/storage/buckets/69725afe001897636f4a/files/6a09ad710010c282fa29/view?project=6972581d002dc8c7cecb&mode=admin',
  'https://fra.cloud.appwrite.io/v1/storage/buckets/69725afe001897636f4a/files/6a09ad710010cc997361/view?project=6972581d002dc8c7cecb&mode=admin',
];

async function clearDatabase() {
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.favoriteBusiness.deleteMany();
  await prisma.deviceToken.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.business.deleteMany();
  await prisma.location.deleteMany();
  await prisma.user.deleteMany();
}

async function main() {
  console.log('Starting database seed...');

  await clearDatabase();
  console.log('Cleaned existing data');

  const [locationBakery, locationCafe] = await Promise.all([
    prisma.location.create({
      data: {
        lat: 58.583322,
        lng: 49.576227,
        address: 'Киров, ул. Валерия Зянкина, 12',
      },
    }),
    prisma.location.create({
      data: {
        lat: 58.579962,
        lng: 49.576227,
        address: 'Киров, ул. Дмитрий Козуелва, 2',
      },
    }),
  ]);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password,
      role: 'ADMIN',
      firstName: 'Admin',
      lastName: 'User',
      imageUrl: [],
    },
  });

  const businessOwner = await prisma.user.create({
    data: {
      email: 'business@example.com',
      password,
      role: 'BUSINESS',
      firstName: 'Иван',
      lastName: 'Владелец',
      imageUrl: [],
    },
  });

  const secondBusinessOwner = await prisma.user.create({
    data: {
      email: 'business2@example.com',
      password,
      role: 'BUSINESS',
      firstName: 'Анна',
      lastName: 'Пекарь',
      imageUrl: [],
    },
  });

  const regularUser = await prisma.user.create({
    data: {
      email: 'user@example.com',
      password,
      role: 'USER',
      firstName: 'Петр',
      lastName: 'Клиент',
      imageUrl: [],
    },
  });

  const bakery = await prisma.business.create({
    data: {
      name: 'Пекарня "Хлебница"',
      description: 'Свежая выпечка со скидкой в конце дня',
      ownerId: businessOwner.id,
      locationId: locationBakery.id,
      pickupStartTime: '19:00',
      pickupEndTime: '21:00',
      imageUrl: [coverImages[0]],
    },
  });

  const cafe = await prisma.business.create({
    data: {
      name: 'Пекарня "Бублик"',
      description: 'Свежая выпечка со скидкой в конце дня',
      ownerId: secondBusinessOwner.id,
      locationId: locationCafe.id,
      pickupStartTime: '18:30',
      pickupEndTime: '20:30',
      imageUrl: [coverImages[1]],
    },
  });

  const buns = await prisma.product.create({
    data: {
      name: 'Свежие булочки',
      description: 'Булочки, приготовленные утром. Скидка 40%.',
      price: 30,
      category: 'bakery',
      quantity: 15,
      isActive: true,
      businessId: bakery.id,
      imageUrl: [productImages[0]],
    },
  });

  const croissant = await prisma.product.create({
    data: {
      name: 'Круассан с миндалем',
      description: 'Осталось несколько круассанов из дневной партии.',
      price: 85,
      category: 'bakery',
      quantity: 6,
      isActive: true,
      businessId: bakery.id,
      imageUrl: [productImages[2]],
    },
  });

  const pizza = await prisma.product.create({
    data: {
      name: 'Пицца школьная',
      description: 'Пицца со скидкой 50%.',
      price: 60,
      category: 'food',
      quantity: 8,
      isActive: true,
      businessId: cafe.id,
      imageUrl: [productImages[1]],
    },
  });

  const rybnik = await prisma.product.create({
    data: {
      name: 'Рыбник',
      description: 'Рыбник со скидкой.',
      price: 60,
      category: 'bakery',
      quantity: 10,
      isActive: false,
      businessId: cafe.id,
      imageUrl: [productImages[3]],
    },
  });

  console.log('Created users, locations, businesses and products');
  console.log('Seed completed successfully');
  console.log('');
  console.log('Test credentials:');
  console.log(`Admin:     ${admin.email} / ${password}`);
  console.log(`Business:  ${businessOwner.email} / ${password}`);
  console.log(`Business2: ${secondBusinessOwner.email} / ${password}`);
  console.log(`User:      ${regularUser.email} / ${password}`);
}

main()
  .catch((error) => {
    console.error('Seed error:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

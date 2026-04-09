# 🍱 Food Waste App - Backend

> Приложение для борьбы с пищевыми отходами через спасение остатков еды из кафе и ресторанов

## 📚 Быстрый старт

### Первый запуск:

```bash
# 1. Установите зависимости
npm install

# 2. Скопируйте .env файл и отредактируйте
cp .env.example .env

# 3. Запустите базу данных (Docker)
docker-compose up -d

# 4. Примените миграции
npm run prisma:migrate:dev

# 5. Заполните БД тестовыми данными
npm run seed

# 6. Запустите backend
npm run start:dev
```

API будет доступен на: [http://localhost:3000](http://localhost:3000)

---

## 🏗️ Архитектура проекта

```
src/
├── auth/              # JWT аутентификация
├── user/              # Управление пользователями
├── business/          # Управление бизнесом
├── product/           # Каталог продуктов
├── order/             # Управление заказами
├── location/          # Геолокация
├── notification/      # Push-уведомления через Firebase
├── favorite/          # Избранные бизнесы
├── common/            # DTOs, guards, decorators
└── prisma/            # Инициализация Prisma
```

---

## 📦 Технологический стек

- **Backend Framework:** [NestJS](https://nestjs.com/)
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT
- **Notifications:** Firebase Cloud Messaging
- **Testing:** Jest

---

## 🗄️ Базы данных и ORM

### Prisma Миграции

```bash
# Создать новую миграцию (при изменении schema.prisma)
npm run prisma:migrate:dev

# Применить миграции
npm run prisma:migrate:dev

# Просмотреть статус миграций
npx prisma migrate status

# Просмотр БД в UI
npx prisma studio
```

### Seed (тестовые данные)

```bash
# Создать тестовые пользователей и данные
npm run seed

# Скрипт находится в: prisma/seed.ts
```

**Создаёт:**
- ✅ Admin пользователя: `admin@example.com`
- ✅ Business владельца: `business@example.com`
- ✅ Regular пользователя: `user@example.com`
- ✅ Тестовый бизнес с продуктами
- ✅ Демо данные для разработки

---

## 🐳 Docker

### Только База Данных

Контейнер содержит только PostgreSQL. Backend запускается локально на вашей машине.

```bash
# Запустить контейнер
docker-compose up -d

# Остановить
docker-compose down

# Просмотр логов БД
docker-compose logs postgres

# Подключение к БД из контейнера
docker-compose exec postgres psql -U foodwaste_user -d foodwaste
```

### PgAdmin (управление БД в UI)

```bash
# Запустить с профилем debug (включает PgAdmin)
docker-compose --profile debug up

# Откройте: http://localhost:5050
# Email: admin@example.com
# Password: admin
```

---

## 🔐 Роли пользователей

Система имеет 3 роли:

| Роль | Описание | Права |
|------|---------|-------|
| **USER** | Обычный пользователь | Просмотр продуктов, заказы, избранное |
| **BUSINESS** | Владелец бизнеса | Управление бизнесом, продуктами, заказами |
| **ADMIN** | Администратор | Полный доступ к системе |

---

## 🚀 Скрипты

```bash
# Development
npm run start:dev          # Запуск с hot-reload
npm run start:debug        # Запуск с debugger
npm start                  # Production режим

# Build
npm run build              # Компилировать TypeScript

# Testing
npm test                   # Jest тесты
npm run test:watch        # Тесты с hot-reload
npm run test:e2e          # E2E тесты

# Linting
npm run lint              # ESLint проверка
npm run format            # Prettier форматирование

# Database
npm run prisma:generate    # Генерировать Prisma клиент
npm run prisma:migrate:dev # Миграции
npm run seed               # Заполнить БД тестовыми данными
npm run prisma:studio     # Открыть Prisma Studio
```

---

## 📡 API Endpoints

### Auth
- `POST /auth/register` - Регистрация пользователя
- `POST /auth/login` - Вход в систему

### Users
- `GET /user/profile` - Получить профиль текущего пользователя
- `PUT /user/profile` - Обновить профиль

### Business
- `GET /business` - Список бизнесов
- `GET /business/:id` - Детали бизнеса
- `POST /business` - Создать бизнес (для BUSINESS роли)
- `PUT /business/:id` - Обновить бизнес

### Products
- `GET /product` - Все продукты
- `GET /product/business/:id` - Продукты бизнеса
- `POST /product` - Создать продукт

### Orders
- `GET /order` - История заказов
- `POST /order` - Создать заказ
- `PUT /order/:id/status` - Обновить статус заказа

### Notifications
- `POST /notification/device-token` - Зарегистрировать device token

---

## 🔧 Конфигурация

### Переменные окружения (.env)

Скопируйте `.env.example` в `.env` и заполните:

```bash
DATABASE_URL="postgresql://user:pass@localhost:5432/dbname"
JWT_SECRET="ваш_секрет"
JWT_EXPIRY="7d"
PORT=3000
NODE_ENV="development"
FIREBASE_CREDENTIALS="./src/config/firebase-service-account.json"
```

### Docker переменные (.env.docker)

```bash
DB_NAME=foodwaste
DB_USER=foodwaste_user
DB_PASSWORD=foodwaste_pass
DB_PORT=5432
```

---

## 💾 Миграция между машинами

**Перейдите на разработку с другого компьютера:**

1. Клонируйте репозиторий
2. Установите зависимости: `npm install`
3. Скопируйте .env: `cp .env.example .env`
4. Запустите БД: `docker-compose up -d`
5. Примените миграции: `npm run prisma:migrate:dev`
6. Заполните данные: `npm run seed`
7. Запустите: `npm run start:dev`

📖 **Подробной гайд:** [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)

---

## 🐛 Дебаг

### Логирование (Prisma)

```typescript
// В сервисе, включите логирование Prisma:
const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
});
```

### Просмотр SQL запросов

```bash
# Включите логирование в .env
DATABASE_LOG_QUERIES=true
```

### Prisma Studio

```bash
npx prisma studio
# Откройте http://localhost:5555
```

---

## 📋 Checklist для разработки

- [ ] Установлены зависимости (`npm install`)
- [ ] Скопирован `.env` файл и заполнены переменные
- [ ] БД запущена (`docker-compose up -d`)
- [ ] Миграции применены (`npm run prisma:migrate:dev`)
- [ ] Seed выполнен (`npm run seed`)
- [ ] Backend запущен (`npm run start:dev`)
- [ ] Тестовый запрос работает

---

## 🆘 Troubleshooting

| Проблема | Решение |
|----------|---------|
| `ECONNREFUSED` БД | Запустите `docker-compose up -d` |
| Port 5432 занят | Измените `DB_PORT` в `.env.docker` |
| Миграции конфликтуют | Запустите `npm run prisma:migrate:dev` и решите конфликты |
| `node_modules` проблемы | `rm -r node_modules && npm install` |
| Prisma клиент не обновился | `npm run prisma:generate` |

---

## 📞 Помощь и поддержка

Если что-то не работает:

1. Проверьте [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)
2. Посмотрите логи: `docker-compose logs postgres`
3. Создайте issue в репозитории

---

## 📝 Лицензия

UNLICENSED

---

**Версия:** 0.0.1  
**Последнее обновление:** апрель 2026

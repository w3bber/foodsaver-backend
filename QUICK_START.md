# 🎯 Полный гайд: Seed, Docker и кроссмашинная разработка

## Содержание
1. [Как запустить Seed](#-как-запустить-seed)
2. [Docker конфигурация](#-docker-конфигурация)
3. [Миграция разработки](#-миграция-разработки-между-машинами)
4. [Рекомендации](#-мои-рекомендации)
5. [Быстрые команды](#-быстрые-команды)

---

## 🌱 Как запустить Seed

### Что создать Seed?

Seed - это скрипт, который автоматически заполняет базу данных тестовыми данными. Я создал для вас `prisma/seed.ts` который создаёт:

✅ **Admin** пользователя  
✅ **Business** владельца + его бизнес  
✅ **Regular User**  
✅ Тестовые продукты со скидками  
✅ Демо данные для разработки  

### Команды для запуска Seed:

```bash
# Способ 1: через npm
npm run seed

# Способ 2: через prisma
npx prisma db seed

# Способ 3: через ts-node (в случае проблем)
npx ts-node --project tsconfig.json prisma/seed.ts
```

### После запуска:

```
✅ Seed completed successfully!

📝 Test credentials:
   Admin:    admin@example.com / password123
   Business: business@example.com / password123
   User:     user@example.com / password123
```

### Если нужно изменить Seed:

Отредактируйте `prisma/seed.ts`:

```typescript
// Например, изменить email, количество продуктов, локации и т.д.

// Создать дополнительного пользователя:
const another_user = await prisma.user.create({
  data: {
    email: 'another@example.com',
    password: hashedPassword,
    role: 'USER',
    firstName: 'Иван',
    lastName: 'Новый',
    imageUrl: [],
  },
});
```

### ⚠️ Важно!

Каждый раз, когда вы запускаете `npm run seed`, он:
1. **Удаляет** все текущие данные
2. **Создаёт** новые тестовые данные

Это нормально для разработки! Не используйте Seed на production БД.

---

## 🐳 Docker конфигурация

### Что я создал:

| Файл | Назначение |
|------|-----------|
| `Dockerfile` | Образ PostgreSQL для контейнера |
| `docker-compose.yml` | Оркестрация контейнеров (БД + опционально PgAdmin) |
| `.env.docker.example` | Переменные для Docker |

### Быстрый старт Docker:

```bash
# 1. Запустить контейнер БД
docker-compose up -d

# 2. Проверить, что всё работает
docker-compose ps

# Expected output:
# NAME              STATUS
# foodwaste-db      Up 2 seconds
# pgadmin           Up 2 seconds (если запущен профиль debug)

# 3. Запустить команды (миграции, seed и т.д.)
npm run prisma:migrate:dev
npm run seed
npm run start:dev

# 4. Остановить контейнер
docker-compose down
```

### Структура Docker Compose:

```yaml
services:
  postgres:           # Основной сервис - база данных
    container_name: foodwaste-db
    ports: [5432]
    volumes: [postgres_data]
    healthcheck: проверка каждые 10 сек

  pgadmin: (опционально)  # Веб-интерфейс для БД
    ports: [5050]
    profiles: [debug]  # Запускается отдельно
```

### Использование PgAdmin (UI для БД):

```bash
# Запустить с PgAdmin
docker-compose --profile debug up -d

# Откройте браузер
# http://localhost:5050

# Вход:
# Email:    admin@example.com
# Password: admin

# Добавить сервер в PgAdmin:
# Hostname: postgres   (имя сервиса из docker-compose)
# Port:     5432
# Username: foodwaste_user
# Password: foodwaste_pass
# Database: foodwaste
```

### Storage и Persistence:

```bash
# Данные хранятся в named volume
# Если переделать контейнер - данные остаются:

docker-compose down    # Контейнер удалён, данные есть
docker-compose up -d   # Вернулись все данные

# Полное удаление данных:
docker volume rm backend_postgres_data
```

### Проблемы?

```bash
# Просмотр логов
docker-compose logs postgres

# Подключение к БД прямо из контейнера
docker-compose exec postgres psql -U foodwaste_user -d foodwaste

# Команда SQL для проверки
SELECT * FROM users;
\q  # Выход

# Перезагрузить контейнер
docker-compose restart

# Удалить и заново создать
docker-compose down
docker-compose up -d
```

### Port 5432 уже занят?

Если на вашей машине уже есть PostgreSQL:

```yaml
# В docker-compose.yml измените:
ports:
  - "5433:5432"  # Внешний порт -> 5432 внутри контейнера

# Тогда в .env:
DATABASE_URL="postgresql://user:pass@localhost:5433/dbname"
```

---

## 🚀 Миграция разработки между машинами

### Сценарий:

Вы разрабатываете на ноутбуке, хотите переключиться на стационарный компьютер (или наоборот).

### Шаг 1️⃣: На первой машине (ноутбук)

```bash
cd backend

# Убедитесь, что нет uncommitted changes
git status

# Залейте всё в GitHub
git add .
git commit -m "Версия для синхронизации"
git push

# Опционально: сохраните .env файл где-нибудь в облаке
# Но НИКОГДА не коммитьте его в Git!
```

### Шаг 2️⃣: На новой машине (ПК)

```bash
# 1. Установите ПО (if не установлено)
# - Node.js v20+
# - Docker Desktop
# - Git

# 2. Клонируйте репозиторий
git clone https://github.com/ВАШ_ЮЗЕР/food-waste-app.git
cd food-waste-app/backend

# 3. Установите зависимости
npm install

# 4. Скопируйте конфиги из примеров
cp .env.example .env              # Основной конфиг
cp .env.docker.example .env.docker  # Docker конфиг (если нужен)

# 5. Отредактируйте .env если нужно
# (обычно значения по умолчанию работают)

# 6. Запустите БД в Docker
docker-compose up -d

# 7. Поставьте миграции
npm run prisma:migrate:dev

# 8. Заполните тестовыми данными
npm run seed

# 9. Запустите backend
npm run start:dev
```

✅ **Готово!** Вы готовы к разработке на новой машине.

### Синхронизация кода

Когда вы работаете на разных машинах:

```bash
# На машине A - сделали изменения:
git add .
git commit -m "Добавил feature X"
git push

# На машине B - хотите получить изменения:
git pull

# Если изменилась БД schema:
npm run prisma:migrate:dev

# Если добавили новые завиимости:
npm install

# Если добавили новые seed данные:
npm run seed

# Запустите обновлённому backend:
npm run start:dev
```

### ⚠️ Что НЕ нужно коммитить:

```gitignore
# .gitignore должен содержать:
.env                    # Конфиг с паролями
.env.local
.env.docker             # Docker переменные
node_modules/           # Зависимости (их переустанавливают через npm install)
dist/                   # Скомпилированный код (его генерируют через npm run build)
*.log                   # Логи
.DS_Store               # macOS системные файлы
firebase-service-account.json  # Чувствительные credentials
```

---

## 💡 Мои рекомендации

### 1. Git workflow

Используйте простую систему:

```bash
# Ветвь develop для разработки
git checkout -b develop
git push -u origin develop

# Feature ветки для новых фич
git checkout -b feature/add-email-notifications

# После завершения фичи:
git push origin feature/add-email-notifications
# Создайте Pull Request на GitHub
```

### 2. Локальная разработка

**Рекомендую использовать Docker для БД:**

✅ Преимущества:
- Нет нужды установить PostgreSQL на компьютер
- Одинаковая БД на всех машинах
- Легко сбросить БД: `docker-compose down` + `docker volume rm ...`
- Просто подключить PgAdmin для UI управления

❌ Если не используете Docker:
- Нужно установить PostgreSQL на каждую машину
- Может быть версионные конфликты
- Сложнее синхронизировать состояние БД

### 3. Переменные окружения между машинами

**Способ 1: Использовать одинаковые значения (рекомендно для dev)**
```bash
# Все скопируют из .env.example - просто работает!
DATABASE_URL="postgresql://foodwaste_user:foodwaste_pass@localhost:5432/foodwaste"
```

**Способ 2: Использовать облако (для sensitive данных)**
```bash
# Если DATABASE_URL содержит пароль production базы:
# - Сохраняйте в 1Pass, LastPass или подобном
# - Каждый разработчик копирует вручную в файл
# - НИКОГДА не коммитьте в Git
```

### 4. Seed для разных окружений

Если нужны разные seed данные для разных мест:

```typescript
// prisma/seed.ts - добавьте логику:

const environment = process.env.NODE_ENV || 'development';

if (environment === 'staging') {
  // Создать большой объём тестовых данных
} else {
  // Создать минимальные тестовые данные
}
```

### 5. Backup данных

Если вы работали на ноутбуке и хотите сохранить БД:

```bash
# Экспортировать БД
docker-compose exec postgres pg_dump \
  -U foodwaste_user \
  -d foodwaste > backup.sql

# На новой машине импортировать:
docker-compose up -d
docker-compose exec -T postgres psql \
  -U foodwaste_user \
  -d foodwaste < backup.sql
```

### 6. Версионирование Prisma миграций

Миграции **обязательно** коммитьте в Git:

```bash
git add prisma/migrations/
git commit -m "Migration: add user email verification"
git push

# На другой машине:
git pull
npm run prisma:migrate:dev  # Автоматически применит
```

---

## ⚡ Быстрые команды

### Запуск проекта с нуля на новой машине:

```bash
# Copy-paste этот блок целиком:

git clone https://github.com/YOUR_USER/food-waste-app.git && \
cd food-waste-app/backend && \
cp .env.example .env && \
cp .env.docker.example .env.docker && \
npm install && \
docker-compose up -d && \
npm run prisma:migrate:dev && \
npm run seed && \
npm run start:dev
```

### Ежедневная разработка:

```bash
# Утром - получить обновления:
git pull
npm run start:dev

# После работы:
git add .
git commit -m "Описание"
git push

# Если что-то сломалось:
npm run prisma:migrate:dev  # Обновить БД
npm run seed                 # Переделать данные
```

### Управление Docker:

```bash
# Запустить БД
docker-compose up -d

# Остановить БД
docker-compose down

# Просмотр статуса
docker-compose ps

# Логи
docker-compose logs postgres

# Удалить всё (⚠️):
docker-compose down -v

# Перезагрузить
docker-compose restart
```

### Prisma утилиты:

```bash
# Открыть UI для БД
npx prisma studio

# Создать миграцию (при изменении schema)
npm run prisma:migrate:dev

# Сбросить БД (⚠️ удаляет данные):
npx prisma migrate reset

# Просмотреть статус миграций:
npx prisma migrate status

# Переустановить Prisma клиент:
npm run prisma:generate
```

### Разработка:

```bash
# Development с hot-reload
npm run start:dev

# Development с debugger
npm run start:debug

# Build
npm run build

# Тесты
npm test
npm run test:e2e

# Lint + format
npm run lint
npm run format
```

---

## 🎓 Примеры использования

### Пример 1: Добавить нового пользователя в seed

```typescript
// prisma/seed.ts - добавьте после создания regularUser:

const teacherUser = await prisma.user.create({
  data: {
    email: 'teacher@example.com',
    password: hashedPassword,
    role: 'USER',
    firstName: 'Мария',
    lastName: 'Учитель',
    imageUrl: [],
  },
});
console.log(`✓ Created TEACHER: ${teacherUser.email}`);
```

### Пример 2: Изменить учетные данные для Docker

```yaml
# docker-compose.yml
environment:
  POSTGRES_PASSWORD: "мой_новый_пароль"

# .env
DATABASE_URL="postgresql://user:мой_новый_пароль@localhost:5432/foodwaste"
```

### Пример 3: Запустить с другим портом

```bash
# .env.docker
DB_PORT=5433

# .env
DATABASE_URL="postgresql://user:pass@localhost:5433/foodwaste"

# docker-compose.yml уже учитывает переменную из .env.docker
```

---

## 📞 Если что-то не понятно

Все гайд находятся здесь:
- 📖 [README_SETUP.md](./README_SETUP.md) - общее описание
- 📖 [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) - подробный гайд миграции
- 📖 **Этот файл** - краткая справка

Используйте `Ctrl+F` для поиска нужной информации!

---

**Версия:** 1.0  
**Дата:** апрель 2026  
**Создано для:** Бесболезненной кроссмашинной разработки 🚀

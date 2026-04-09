# 🚀 Гайд по миграции разработки между машинами

## 📋 Сценарий

Вы уже залили весь код в GitHub репозиторий и теперь хотите переключиться на другой компьютер или ноутбук.

---

## ✅ На первой машине (перед переходом):

### 1. Убедитесь, что всё залито в Git:
```bash
cd backend
git status  # Не должно быть uncommitted changes
git push    # Залейте все коммиты
```

### 2. Экспортируйте текущую конфигурацию (опционально):
```bash
# Сохраните .env файл в безопасном месте (переводите вручную, не коммитьте!)
cp .env .env.backup
```

### 3. Очистите локальные данные (опционально):
```bash
# Удалите node_modules и кэш
rm -r node_modules
npm cache clean --force

# Если используете Docker БД - стопьте контейнер
docker-compose down
```

---

## 🎯 На новой машине:

### 1. Установите необходимое ПО:

**Для Windows:**
- [Node.js](https://nodejs.org/) (v20+)
- [PostgreSQL](https://www.postgresql.org/download/windows/) или используйте Docker
- [Docker Desktop](https://www.docker.com/products/docker-desktop) (рекомендуется)
- [Git](https://git-scm.com/download/win)

**Для macOS:**
```bash
# Используя Homebrew
brew install node postgresql docker
brew install --cask docker

# Запустите Docker Desktop
open /Applications/Docker.app
```

**Для Linux (Ubuntu/Debian):**
```bash
# Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# PostgreSQL
sudo apt-get install postgresql postgresql-contrib

# Docker
sudo apt-get install docker.io docker-compose
sudo usermod -aG docker $USER
```

### 2. Клонируйте репозиторий:
```bash
git clone https://github.com/ВАШ_НИКНЕЙМ/food-waste-app.git
cd food-waste-app/backend
```

### 3. Установите зависимости:
```bash
npm install
```

### 4. Настройте переменные окружения:
```bash
# Скопируйте шаблон .env
cp .env.example .env

# Отредактируйте .env файл (ваны должны быть в .gitignore!)
nano .env  # или откройте в VS Code
```

**Пример .env файла:**
```bash
DATABASE_URL="postgresql://foodwaste_user:foodwaste_pass@localhost:5432/foodwaste"
JWT_SECRET="ваш_сложный_секрет_здесь"
JWT_EXPIRY="7d"
FIREBASE_CREDENTIALS=./config/firebase-service-account.json
```

### 5. Запустите базу данных (2 варианта):

#### Вариант A: Docker (рекомендуется - не требует установки PostgreSQL)
```bash
# Создайте .env.docker из примера
cp .env.docker.example .env.docker

# Запустите контейнер БД
docker-compose up -d

# Проверьте статус
docker-compose ps

# Логи
docker-compose logs postgres

# Остановка
docker-compose down
```

#### Вариант B: Локальный PostgreSQL
```bash
# Windows (Open psql) или используйте pgAdmin

# macOS/Linux - создайте БД
createdb -U postgres foodwaste  # если используете postgres пользователя

# Или через SQL
psql -U postgres
CREATE DATABASE foodwaste;
CREATE USER foodwaste_user WITH PASSWORD 'foodwaste_pass';
GRANT ALL PRIVILEGES ON DATABASE foodwaste TO foodwaste_user;
\q
```

### 6. Выполните миграции Prisma:
```bash
# Примените все миграции к БД
npm run prisma:migrate:dev

# Когда спросит имя миграции, введите что-то вроде "sync_database"
```

### 7. Заполните БД тестовыми данными:
```bash
npm run seed
```

**Вывод должен быть:**
```
✓ Cleaned existing data
✓ Created locations
✓ Created ADMIN: admin@example.com
✓ Created BUSINESS owner: business@example.com
✓ Created USER: user@example.com
✓ Created business: Эко-Кафе "Зеленый лист"
✓ Created products
✓ Added business to favorites
✅ Seed completed successfully!

📝 Test credentials:
   Admin:    admin@example.com / password123
   Business: business@example.com / password123
   User:     user@example.com / password123
```

### 8. Запустите backend:
```bash
npm run start:dev
```

Ожидаемый вывод:
```
[Nest] 12345 - 04/09/2026, 10:00:00 AM LOG [NestFactory] Starting Nest application...
...
[Nest] 12345 - 04/09/2026, 10:00:05 AM LOG [InstanceLoader] PrismaService dependencies initialized
[Nest] 12345 - 04/09/2026, 10:00:05 AM LOG [NestFactory] Nest application successfully started

Application is running on: http://localhost:3000
```

### 9. Проверьте, что всё работает:
```bash
# В другом терминале - тестируйте API
curl http://localhost:3000

# Или импортируйте в Postman коллекцию
```

---

## 🔄 Синхронизация между машинами

Если вы разрабатываете на нескольких машинах:

### После работы на одной машине:
```bash
git add .
git commit -m "описание изменений"
git push
```

### Перед работой на другой машине:
```bash
git pull
npm install  # если изменились зависимости
npm run prisma:migrate:dev  # если новые миграции
npm run seed  # если нужны новые семена
npm run start:dev
```

---

## 🛠️ Полезные команды

```bash
# Генерация Prisma клиента
npm run prisma:generate

# Просмотр БД в UI (требует профиль debug)
docker-compose --profile debug up -d pgadmin
# Откройте http://localhost:5050
# Email: admin@example.com | Password: admin

# Сброс БД (ОСТОРОЖНО - удаляет все данные!)
npm run prisma:migrate:reset

# Stop Docker контейнер
docker-compose down

# View database logs
docker-compose logs postgres

# Connect to DB container shell
docker-compose exec postgres psql -U foodwaste_user -d foodwaste
```

---

## ⚠️ Важные замечания

1. **Никогда не коммитьте .env файл** в Git!
   - Добавьте в `.gitignore`:
     ```
     .env
     .env.local
     .env.docker
     node_modules/
     dist/
     ```

2. **Синхронизируйте .env значения вручную** между машинами или используйте защищённый сервис

3. **Если используете Firebase** - убедитесь, что `firebase-service-account.json` в `.gitignore`

4. **При изменении schema.prisma**:
   ```bash
   npm run prisma:migrate:dev  # Создаст новую миграцию
   ```

5. **Docker volume сохраняет данные** даже после `docker-compose down`
   - Для полного удаления: `docker volume rm backend_postgres_data`

---

## 🐛 Дебаг-утилиты

### Для развития с PgAdmin:
```bash
docker-compose --profile debug up
# Откройте http://localhost:5050
```

### Запустить Prisma Studio:
```bash
npm run prisma:studio
# Откройте http://localhost:5555
```

### Логирование миграций:
```bash
npm run prisma:migrate:status
```

---

## 📞 Если что-то не работает:

### БД не подключается:
```bash
# Проверьте DATABASE_URL в .env
echo $DATABASE_URL

# Если используете Docker - проверьте контейнер:
docker-compose ps
docker-compose logs postgres
```

### Port 5432 уже занят:
```bash
# Измените порт в .env.docker:
DB_PORT=5433

# Обновите DATABASE_URL в .env:
DATABASE_URL="postgresql://user:pass@localhost:5433/dbname"
```

### node_modules issues:
```bash
rm -r node_modules package-lock.json
npm install
```

---

Успешной разработки! 🚀

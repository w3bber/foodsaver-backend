# ✅ Чек-лист: От установки до первого запуска

## 🎯 Этап 1: Подготовка окружения

### на Windows:
- [ ] Установили [Node.js v20+](https://nodejs.org/)
  ```bash
  node --version  # Должно вывести v20.x.x или выше
  ```
- [ ] Установили [Docker Desktop](https://www.docker.com/products/docker-desktop)
  ```bash
  docker --version
  docker-compose --version
  ```
- [ ] Установили [Git](https://git-scm.com/download/win)
  ```bash
  git --version
  ```

### на macOS:
- [ ] Установили через Homebrew:
  ```bash
  brew install node docker
  brew install --cask docker
  # Запустите Docker.app
  ```

### на Linux:
- [ ] Установили зависимости:
  ```bash
  sudo apt-get install nodejs npm docker.io
  sudo usermod -aG docker $USER
  ```

---

## 📂 Этап 2: Клонирование и установка

- [ ] Клонировали репозиторий:
  ```bash
  git clone https://github.com/ВАШ_НИК/food-waste-app.git
  cd food-waste-app/backend
  ```

- [ ] Установили npm зависимости:
  ```bash
  npm install
  ```
  ⏱️ Это займёт 2-5 минут.

---

## 🔧 Этап 3: Конфигурация

- [ ] Скопировали .env файл:
  ```bash
  cp .env.example .env
  ```
  
  ✅ **По умолчанию в .env должно быть:**
  ```
  DATABASE_URL="postgresql://foodwaste_user:foodwaste_pass@localhost:5432/foodwaste"
  JWT_SECRET="ВАШ_СЛОЖНЫЙ_СЕКРЕТ_ЗДЕСЬ_32_И_БОЛЕЕ_СИМВОЛОВ"
  JWT_EXPIRY="7d"
  PORT=3000
  NODE_ENV="development"
  ```

- [ ] Скопировали .env.docker файл (если используете Docker):
  ```bash
  cp .env.docker.example .env.docker
  ```

- [ ] Проверили, что все файлы на месте:
  ```bash
  ls -la | grep env
  # output:
  # .env
  # .env.example
  # .env.docker
  # .env.docker.example
  ```

---

## 🐳 Этап 4: Запуск базы данных

### Опция A: Docker (рекомендуется) ⭐

- [ ] Запустили контейнер PostgreSQL:
  ```bash
  docker-compose up -d
  ```

- [ ] Проверили статус:
  ```bash
  docker-compose ps
  ```
  
  ✅ Должно вывести:
  ```
  NAME          STATUS
  foodwaste-db  Up 2 seconds
  ```

- [ ] Проверили подключение к БД:
  ```bash
  docker-compose exec postgres psql -U foodwaste_user -d foodwaste -c "SELECT 1"
  ```
  ✅ Должно вывести: `1`

### Опция B: Локальный PostgreSQL

- [ ] Установили PostgreSQL (если ещё не установили)
- [ ] Создали БД:
  ```bash
  createdb -U postgres foodwaste
  ```
- [ ] Создали юзера:
  ```bash
  psql -U postgres
  CREATE USER foodwaste_user WITH PASSWORD 'foodwaste_pass';
  GRANT ALL PRIVILEGES ON DATABASE foodwaste TO foodwaste_user;
  \q
  ```

---

## 📊 Этап 5: Миграции Prisma

- [ ] Выполнили миграции:
  ```bash
  npm run prisma:migrate:dev
  ```
  
  ⏱️ Первый раз может занять 1-2 минуты.
  
  ✅ Должно вывести:
  ```
  ✔ Your database is now in sync with your schema.
  ```

- [ ] Проверили, что таблицы созданы:
  ```bash
  docker-compose exec postgres psql -U foodwaste_user -d foodwaste -c "\dt"
  ```
  
  ✅ Должны видеть таблицы: users, products, orders, и т.д.

---

## 🌱 Этап 6: Заполнение БД тестовыми данными

- [ ] Запустили seed скрипт:
  ```bash
  npm run seed
  ```
  
  ✅ Должно вывести:
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

- [ ] Проверили данные в БД:
  ```bash
  docker-compose exec postgres psql -U foodwaste_user -d foodwaste -c "SELECT email, role FROM users;"
  ```

---

## 🚀 Этап 7: Запуск Backend

- [ ] Запустили development server:
  ```bash
  npm run start:dev
  ```
  
  ⏱️ Ожидайте 5-10 секунд.
  
  ✅ Должно вывести:
  ```
  [Nest] 12345 - 04/09/2026, 10:00:00 AM LOG [NestFactory] Starting Nest application...
  ...
  [Nest] 12345 - 04/09/2026, 10:00:05 AM LOG [NestFactory] Nest application successfully started
  
  Application is running on: http://localhost:3000
  ```

- [ ] В новом терминале - проверили, что API работает:
  ```bash
  curl http://localhost:3000
  ```

---

## 🧪 Этап 8: Тестирование API

### Способ 1: через curl

```bash
# Вход (login)
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }'

# Response должен содержать access_token, например:
# {"access_token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."}
```

### Способ 2: через Postman

1. Откройте [Postman](https://www.postman.com/downloads/)
2. Создайте новый request:
   - **Method:** POST
   - **URL:** http://localhost:3000/auth/login
   - **Body (JSON):**
     ```json
     {
       "email": "admin@example.com",
       "password": "password123"
     }
     ```
3. Нажмите Send
4. Должны получить токен

### Способ 3: через VS Code REST Client

```bash
# Установите расширение REST Client
# Создайте файл requests.http и напишите:

POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123"
}
```

---

## ✨ Готово!

Если все чек-листы пройдены:

- ✅ Backend запущен на http://localhost:3000
- ✅ БД подключена и содержит тестовые данные
- ✅ Можете логиниться
- ✅ Готовы к разработке!

---

## 🐛 Если что-то не работает

### Ошибка: ECONNREFUSED (БД не подключается)

```bash
# 1. Проверьте, что Docker запущен
docker-compose ps

# 2. Если контейнер не запущен:
docker-compose up -d

# 3. Если порт 5432 уже занят:
# Измените в .env.docker и .env:
# DB_PORT=5433 (или другой свободный 5432)
```

### Ошибка: Port 3000 уже занят

```bash
# 1. Измените PORT в .env:
PORT=3001

# 2. Или убейте процесс (узнайте PID):
# Windows: netstat -ano | findstr :3000
# macOS/Linux: lsof -i :3000
```

### Ошибка: Миграции не применяются

```bash
# Сбросьте и переделайте:
npm run prisma:migrate:dev

# Если совсем не работает:
docker-compose down -v  # Удаляет БД
docker-compose up -d    # Создаёт заново
npm run prisma:migrate:dev
npm run seed
```

### Ошибка: node_modules проблемы

```bash
# Полная переустановка:
rm -rf node_modules package-lock.json
npm install
```

---

## 📞 Помощь

Если что-то не понятно:

1. **Краткий гайд:** читайте [QUICK_START.md](./QUICK_START.md)
2. **Подробный гайд:** читайте [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)
3. **Общая инфо:** читайте [README_SETUP.md](./README_SETUP.md)

---

## 🎊 Поздравляем!

Вы готовы к разработке! 🚀

Дальше:
- 📝 Изучите существующий код в `src/`
- 🔧 Создавайте новые ендпоинты
- 🧪 Пишите тесты
- 📤 Коммитьте и пушьте в Git

**Удачи!** 🎉

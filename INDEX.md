# 📚 Индекс документации

> Вся информация о проекте, seed, Docker и миграции разработки

## 🚀 Начните отсюда

**Первый раз?** → Прочитайте [CHECKLIST.md](./CHECKLIST.md) и следуйте пошагово.

**Знаете что делаете?** → Используйте [QUICK_START.md](./QUICK_START.md) для быстрых команд.

---

## 📖 Полные гайды

### 1. 🌱 Seed
**Файл:** [prisma/seed.ts](./prisma/seed.ts)

Создаёт тестовых пользователей:
- Admin: `admin@example.com`
- Business: `business@example.com`
- User: `user@example.com`

Команды:
```bash
npm run seed                    # Запустить seed
npm run prisma:seed            # Альтернативно
npx ts-node prisma/seed.ts     # Напрямую
```

**Документация:** [QUICK_START.md#запустить-seed](./QUICK_START.md#🌱-как-запустить-seed)

---

### 2. 🐳 Docker & Docker Compose
**Файлы:**
- [Dockerfile](./Dockerfile) - образ PostgreSQL
- [docker-compose.yml](./docker-compose.yml) - оркестрация
- [.env.docker.example](./.env.docker.example) - переменные

Быстрый старт:
```bash
docker-compose up -d     # Запустить БД
docker-compose down      # Остановить БД
docker-compose ps        # Статус
docker-compose logs      # Логи
```

**Документация:** [QUICK_START.md#docker-конфигурация](./QUICK_START.md#-docker-конфигурация)

**С PgAdmin (UI):**
```bash
docker-compose --profile debug up -d
# Откройте http://localhost:5050
```

---

### 3. 📱 Миграция разработки между машинами
**Основной гайд:** [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) ⭐

Содержит:
- ✅ Что делать на первой машине перед переходом
- ✅ Полная инсталяция на новой машине
- ✅ Синхронизацию между машинами
- ✅ Дебаг-утилиты

**Краткое резюме:** [QUICK_START.md#миграция-разработки-между-машинами](./QUICK_START.md#-миграция-разработки-между-машинами)

---

## 📋 Быстрые ссылки на разделы

### Управления проектом

| Задача | Команда | Гайд |
|--------|---------|------|
| Запустить Backend | `npm run start:dev` | [README_SETUP.md](./README_SETUP.md) |
| Заполнить БД | `npm run seed` | [QUICK_START.md](./QUICK_START.md) |
| Применить миграции | `npm run prisma:migrate:dev` | [QUICK_START.md](./QUICK_START.md) |
| Открыть Prisma Studio | `npx prisma studio` | [README_SETUP.md](./README_SETUP.md) |
| Запустить тесты | `npm test` | [README_SETUP.md](./README_SETUP.md) |

### Docker команды

| Задача | Команда | Гайд |
|--------|---------|------|
| Запустить БД | `docker-compose up -d` | [QUICK_START.md](./QUICK_START.md) |
| Остановить БД | `docker-compose down` | [QUICK_START.md](./QUICK_START.md) |
| Просмотр БД | `docker-compose --profile debug up` | [QUICK_START.md](./QUICK_START.md) |
| Логи | `docker-compose logs` | [QUICK_START.md](./QUICK_START.md) |

---

## 📁 Созданные файлы

### 📚 Документация
```
✅ CHECKLIST.md              - Пошаговый чек-лист инсталляции
✅ QUICK_START.md            - Краткий гайд с быстрыми командами
✅ MIGRATION_GUIDE.md        - Подробный гайд миграции между машинами
✅ README_SETUP.md           - Общая документация проекта
✅ INDEX.md                  - Этот файл (индекс всей информации)
```

### 🔧 Конфигурация
```
✅ .env.example              - Шаблон переменных окружения
✅ .env.docker.example       - Шаблон Docker переменных
✅ Dockerfile                - Образ PostgreSQL
✅ docker-compose.yml        - Композиция контейнеров
```

### 🌱 Seed
```
✅ prisma/seed.ts            - Скрипт создания тестовых данных
```

### 📝 Обновления
```
✅ package.json              - Добавлены:
                             - npm run seed (команда)
                             - npm run prisma:* (команды)
                             - bcrypt (зависимость)
                             - @types/bcrypt (devDependency)
```

---

## 🎯 Рекомендуемый порядок чтения

### Для новечка в проекте:
1. ✅ [CHECKLIST.md](./CHECKLIST.md) - установка и первый запуск
2. ✅ [README_SETUP.md](./README_SETUP.md) - понимание проекта
3. ✅ [QUICK_START.md](./QUICK_START.md) - быстрые команды
4. 📦 Начните разработку!

### Для работы на несколько машинами:
1. ✅ [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) - главный гайд
2. ✅ [QUICK_START.md](./QUICK_START.md) - синхронизация
3. 🚀 Работайте на разных машинах!

### Для дебага:
1. 📖 [QUICK_START.md#быстрые-команды](./QUICK_START.md#-быстрые-команды) - команды
2. 📖 [QUICK_START.md#troubleshooting](./QUICK_START.md#troubleshooting) - решение проблем
3. ✅ [CHECKLIST.md#если-что-то-не-работает](./CHECKLIST.md#-если-что-то-не-работает) - конкретные ошибки

---

## 🔑 Тестовые учётные данные

```
Admin:    admin@example.com / password123
Business: business@example.com / password123
User:     user@example.com / password123
```

Доступны после запуска: `npm run seed`

---

## 🌐 Доступные URL

| Сервис | URL | Примечание |
|--------|-----|-----------|
| Backend API | http://localhost:3000 | NestJS приложение |
| Prisma Studio | http://localhost:5555 | При запуске `npx prisma studio` |
| PgAdmin | http://localhost:5050 | При `docker-compose --profile debug up` |

---

## 🛠️ Основные команды

```bash
# Development
npm run start:dev           # Запуск с hot-reload
npm run build              # Компиляция

# Database
npm run seed               # Заполнить БД
npm run prisma:migrate:dev # Миграции
npm run prisma:studio      # Открыть UI

# Docker
docker-compose up -d       # Запустить БД
docker-compose down        # Остановить БД
docker-compose down -v     # Удалить данные БД

# Testing
npm test                   # Запустить тесты
npm run test:e2e          # E2E тесты

# Code quality
npm run lint              # Проверка ESLint
npm run format            # Форматирование Prettier
```

---

## 📞 Помощь

**Проблема что-то не работает?**

1. Откройте [CHECKLIST.md#-если-что-то-не-работает](./CHECKLIST.md#-если-что-то-не-работает)
2. Вам помогут частые ошибки и решения

**Нужен быстрый ответ?**

1. Используйте `Ctrl+F` для поиска по документам
2. Смотрите [QUICK_START.md](./QUICK_START.md) - там вся информация структурирована

**Что-то не понято?**

1. Прочитайте полный гайд по теме
2. Посмотрите примеры в коде

---

## 📅 История документации

| Дата | Что изменилось |
|------|----------------|
| 04/09/2026 | ✅ Созданы все документы, seed, Docker конфиги |
| | ✅ Обновлен package.json |
| | ✅ Готово к разработке на разных машинах |

---

## 🎊 Итого

**Что было создано:**
- ✅ 5 документов с полным руководством
- ✅ Seed скрипт для 3 ролей
- ✅ Docker + Docker Compose конфигурация
- ✅ Примеры .env файлов
- ✅ Список команд и быстрые ссылки

**Что дальше:**
1. Следуйте [CHECKLIST.md](./CHECKLIST.md)
2. Запустите `npm run seed` для получения тестовых данных
3. Начните разработку!

---

**Версия документации:** 1.0  
**Дата:** апрель 2026  
**Тип:** Полное руководство разработки 🚀

---

👉 **Начните с:** [CHECKLIST.md](./CHECKLIST.md)

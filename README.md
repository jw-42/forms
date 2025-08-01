# Анкеты
Современная микросервисная AI-платформа для создания форм и опросов, интегрированная с ВКонтакте для идентификации пользователей и безопасной организации системы платежей.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white) ![Bun](https://img.shields.io/badge/Bun-000000?style=for-the-badge&logo=bun&logoColor=white) ![Hono](https://img.shields.io/badge/Hono-000000?style=for-the-badge&logo=hono&logoColor=white) ![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)

## 🚀 Ключевые особенности
- **Умная генерация анкет** — благодаря интеграции с OpenRouter API, можно генерировать описание анкет, вопросы и варианты ответов; подбирать альтернативные формулировки и исправлять ошибки.
- **Микросервисная архитектура** с разделением ответственности: Nginx, API, база данных, брокер сообщений и сервис уведомлений.
- **Монетизация** — разноплановые подписки и внутренняя валюта; система платежей, интегрированная с ВКонтакте.
- **Docker-контейнеризация** для простого развертывания.

## 🏗️ Архитектура проекта
### Технологический стек
#### Backend
- **Bun** — быстрый JavaScript runtime
- **Hono** — современный веб-фреймворк
- **Prisma** — ORM для PostgreSQL
- **Zod** — валидация схем
- **KafkaJS** — работа с Apache Kafka
- **VK-IO** — интеграция с VK API

#### Инфраструктура
- **Docker & Docker Compose** — контейнеризация
- **PostgreSQL 16** — основная БД
- **Apache Kafka** — брокер сообщений
- **Nginx** — веб-сервер и прокси
- **Let's Encrypt** — SSL сертификаты

### 📁 Архитектурные принципы
```
forms-cloud/
├── backend/                 # Основной API сервис
│   ├── src/
│   │   ├── features/       # Доменная логика
│   │   │   ├── auth/       # Авторизация VK
│   │   │   ├── forms/      # Управление формами
│   │   │   ├── questions/  # Вопросы форм
│   │   │   ├── responses/  # Ответы пользователей
│   │   │   ├── payments/   # Система платежей
│   │   │   └── users/      # Пользователи
│   │   ├── shared/         # Общие утилиты
│   │   └── infra/          # Инфраструктура
│   └── prisma/             # Схема БД и миграции
├── notify-service/          # Сервис уведомлений
├── nginx/                   # Конфигурация веб-сервера
├── legal-docs/             # Юридические документы
└── docker-compose.yml      # Оркестрация контейнеров
```

### Микросервисы
1. **Backend API** (`backend/`) — основной API сервис
2. **Notify Service** (`notify-service/`) — сервис уведомлений
3. **Nginx** (`nginx/`) — reverse proxy и SSL терминация
4. **PostgreSQL** — основная база данных
5. **Kafka + Zookeeper** — брокер сообщений

### Ключевые паттерны
- **Clean Architecture** — разделение на слои (API → Service → Repository → Database)
- **Repository Pattern** — абстракция доступа к данным
- **Service Layer** — бизнес-логика и валидация
- **Factory Pattern** — создание обработчиков Hono
- **Middleware Pattern** — авторизация, лимиты, логирование

#### Структура модуля
```
form/
├── api/                    # HTTP обработчики (Controllers)
│ ├── create.ts            # Создание ресурса
│ ├── get.ts               # Получение списка
│ ├── getById.ts           # Получение по ID
│ ├── update.ts            # Обновление
│ ├── delete.ts            # Удаление
│ └── index.ts             # Экспорт всех handlers
├── repository.ts          # Слой доступа к данным
├── service.ts             # Бизнес-логика
├── router.ts              # Маршрутизация
├── types.ts               # TypeScript типы и схемы
└── index.ts               # Публичный API модуля
```

## 🔧 Установка и запуск
```bash
# Клонирование репозитория
git clone https://github.com/jw-42/forms.git
cd forms

# Для разработки
./deploy.sh

# Для production
./deploy.sh production
```

### Разработка
#### Полный запуск через deploy.sh (рекомендуется)
```bash
# Запуск всех сервисов в режиме разработки
./deploy.sh

# Или запуск только определенных сервисов
docker compose up backend postgres kafka
```

#### Локальный запуск отдельных сервисов
```bash
# Backend API
cd backend
bun install
bun run dev

# Notify Service
cd notify-service
bun install
bun run dev

# Только база данных
docker compose up postgres
```

### 🧪 Тестирование
#### Линтинг и форматирование
```bash
cd backend
bun run lint        # Проверка кода
bun run lint:fix    # Автоисправление
bun run format      # Форматирование
bun run check       # Полная проверка
```

#### API тестирование
Backend API доступен по адресу `http://localhost/api`:
```bash
# Проверка здоровья сервиса
curl http://localhost/api/health

# Создание формы (требует авторизацию)
curl -X POST http://localhost/api/forms \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"title": "Тестовая форма", "description": "Описание формы"}'
```

## 🔌 API Endpoints

### RESTful API Design
Все endpoints следуют REST принципам с единообразной структурой ответов и обработкой ошибок.

#### Аутентификация
- `POST /api/auth/check-vk-launch-params` - проверка параметров запуска VK мини-приложения

#### Формы (CRUD операции)
- `GET /api/forms` - получение списка форм с пагинацией
- `POST /api/forms` - создание новой формы с валидацией
- `GET /api/forms/:id` - получение формы по ID с проверкой прав
- `PUT /api/forms/:id` - обновление формы (только владелец)
- `DELETE /api/forms/:id` - удаление формы (только владелец)

#### Вопросы (вложенные ресурсы)
- `GET /api/forms/:form_id/questions` - вопросы конкретной формы
- `POST /api/forms/:form_id/questions` - создание вопроса в форме
- `PUT /api/forms/:form_id/questions/:id` - обновление вопроса
- `DELETE /api/forms/:form_id/questions/:id` - удаление вопроса

#### Ответы пользователей
- `POST /api/forms/:form_id/answers` - отправка ответов на форму
- `GET /api/forms/:form_id/answers` - получение ответов (только владелец)

#### Платежи и подписки
- `GET /api/payments/balance` - текущий баланс пользователя
- `GET /api/payments/transactions` - история транзакций
- `POST /api/payments/get-item` - обработка платежей VK

#### AI-функциональность
- `POST /api/forms/generate-description` - AI-генерация описания формы

#### Юридические документы
- `GET /api/forms/:form_id/data-proccessing` - соглашение об обработке данных
- `GET /api/forms/:form_id/personal-data` - согласие на обработку персональных данных

## 📊 Мониторинг
### Health Checks
- Backend: `http://localhost/api/health`
- PostgreSQL: автоматическая проверка готовности
- Kafka: проверка доступности брокера

## 👨‍💻 Автор

**Автор**: Владислав Лаукман
**Email**: v.laukman@mail.ru
**GitHub**: github.com/jw-42

--- 
⭐ Если вам понравился проект, поставьте звездочку! Это мотивирует на дальнейшую разработку.
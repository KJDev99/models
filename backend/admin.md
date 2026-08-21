# Admin — frontend

Base: `http://localhost:8000/api/v1/admin`

Все запросы кроме логина:

```
Authorization: Bearer <access_token>
```

Ответ всегда `{ "success": true, "data": ... }` или `{ "success": false, "error": { "code", "message" } }`.

## Вход

`POST /admin/auth/login` → сохранить tokens. Список страниц = теги Swagger `Admin: …`.

## Дашборд

`GET /admin/dashboard` → `stats`, `latest_moderation`, `latest_users`.

Кнопки в таблице модерации: approve/reject см. Модерация.

## Исполнители

- Список: `GET /admin/performers?q=&status=&page=`
- Создать: `POST /admin/performers` (пример в Swagger)
- Карточка: `GET /admin/performers/{id}`
- Блок: `POST /admin/performers/{id}/block` `{ measure, reason, days }`
- Разблок: `POST .../unblock`
- Скрыть: `POST .../hide?hidden=true`
- Удалить: `DELETE ...`

## Заказчики / агентства

Аналогично `/customers`, `/agencies`.
Компания: `customer_type=company` + `company_name`.
В агентство анкета: `POST /admin/agencies/{id}/performers`.

## Проекты / площадки

`POST /admin/projects` — `owner_id` = UUID заказчика.
`POST /admin/venues/{id}/photos` `{ "url", "album": "Белый зал" }`.

## Модерация

`GET /admin/moderation`
`POST /admin/moderation/{user|project|venue}/{id}/approve`
`POST /admin/moderation/{source}/{id}/reject` `{ "comment": "..." }`

## Жалобы

`GET /admin/complaints/{id}/messages` — переписка.
`POST .../accept` — применяет блок к обвиняемому.
`POST .../reject` — закрыть без мер.

## FAQ сайта

`GET /admin/faqs?type=agencies&status=pending_review`  
`POST /admin/faqs` — сразу `published`  
`POST /admin/faqs/{id}/publish` — предложение от роли  
`PUT /admin/faqs/{id}` · `DELETE /admin/faqs/{id}`  
`PUT /admin/contacts` — страница «Контакты»

Подробные example body — в Swagger http://localhost:8000/docs

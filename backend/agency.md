# Agency — frontend

Base: `http://localhost:8000/api/v1/agency`

Токен: обычный вход агентства (`/auth/login`, `role=agency`), не админский.

```
Authorization: Bearer <access_token>
```

Ответ всегда `{ "success": true, "data": ... }`. Ошибка `FORBIDDEN`, если роль не `agency`.

Список страниц = теги Swagger `Agency: …`.

## Кабинет

`GET /agency/cabinet?specialty=model&q=&status=active`

- Шапка: `logo_url`, `user.agency_name`, `user.city`, `about`, `contact_links` / `contact_phone`
- Счётчики: `stats.performers`, `stats.models`, `stats.photographers`, `stats.videographers`
- Сетка: `performers[]` (`specialty`, `status`, `height_cm`, `is_hidden`)
- Вкладки: `specialty=model|photographer|videographer` или без параметра = Все
- Пусто: `performers.length === 0` → текст «Пока нет исполнителей»

## Редактировать профиль

| Вкладка | Запрос |
|---|---|
| Информация | `PATCH /agency/profile/info` |
| Контакты | `PATCH /agency/profile/contacts` |
| Безопасность | `PATCH /agency/profile/security` |
| Фото | `POST /agency/profile/photo` `{ "url": "..." }` |
| Удаление | `DELETE /agency/profile` |

После смены пароля — заново логин.

## Добавить исполнителя

`POST /agency/performers` — то же JSON, что админка (пример в Swagger **Agency: Исполнители**).

Не передавайте `agency_id` и не ставьте `status: active` — сервер сам: `agency_id` = вы, статус `pending_review`.

Портфолио после создания: `POST /agency/performers/{id}/photos`.

Карточка: `GET /agency/performers/{id}` (параметры, цены, опыт, медиа, отзывы).

Меню карточки: скрыть `POST .../hide?hidden=true`, удалить `DELETE`.

## Отзывы

`GET /agency/reviews` — блок на профиле агентства (`rating_avg`, `items`, `meta` для «Показать ещё»).

`GET /agency/performers/{id}/reviews` — отзывы на карточке исполнителя.

## Чаты

`GET /agency/chats` — список (`peer_id`, имя, `last_message`, `last_at`).

`POST /agency/chats` `{ "peer_id": "<uuid>" }` — открыть диалог.

`GET /agency/chats/{id}` — история. «Перейти в профиль» = `peer_id`.

`POST /agency/chats/{id}/messages` `{ "body": "...", "attachment_url": null }`.

`POST /agency/chats/{id}/invite` `{ "project_id": "<uuid>" }` — «Позвать в проект».

Подробные example body — в Swagger http://localhost:8000/docs

# Customer — frontend

Base: `http://localhost:8000/api/v1/customer`

Токен: `/auth/login` с `role=customer`.

```
Authorization: Bearer <access_token>
```

Ответ всегда `{ "success": true, "data": ... }`. Ошибка `FORBIDDEN`, если роль не `customer`.

## Кабинет

`GET /customer/cabinet?status=`

- Пусто: `empty === true` → «Разместить проект» / «Добавить площадку»
- Частное лицо: `user.customer_type === "individual"` — `first_name` + `last_name`
- Компания: `company` — `user.company_name`, `inn`
- Счётчики: `stats.projects`, `venues`, `reviews`, `publications`, `responses`
- Вкладки публикаций: `?status=active` / `archived` (также `draft`, `pending_review`, `rejected`)

## Редактировать профиль

| Вкладка / модалка | Запрос |
|---|---|
| Информация | `PATCH /customer/profile/info` |
| Контакты | `PATCH /customer/profile/contacts` |
| Фото | `POST /customer/profile/photo` `{ "url" }` |
| Безопасность (просмотр) | `GET /customer/settings` → `email_masked`, `phone_masked`, `password_changed_at` |
| Пароль | `PATCH /customer/settings/password` `{ current_password, new_password, repeat_password }` |
| Почта | `POST /customer/settings/email` `{ "email" }` → экран «Подтвердите почту» |
| Повтор письма | `POST /customer/settings/email/resend` |
| Ссылка из письма | `GET /customer/settings/email/confirm?token=` → «Почта подтверждена» |
| Телефон | `PATCH /customer/settings/phone` → SMS код, затем `POST /customer/settings/phone/confirm` `{ "code" }` |
| Удаление | `DELETE /customer/settings` |

После смены пароля — новый логин (refresh отозваны).

Письмо: если в `.env` задан `SMTP_HOST` — уходит на почту. Иначе local: `data.token` / `data.confirm_url`.

SMS: `SMS_PROVIDER=log` (local, `data.code`) / `smsru` / `eskiz`. Код живёт 10 минут.

## Новый проект

1. `POST /customer/projects` — шаги «Основная информация» + «Подробнее». Статус `draft`
2. `POST /customer/projects/{id}/cover` `{ "url" }`
3. «В черновик»: уже `draft`, либо `POST .../draft`
4. «Опубликовать проект»: `POST /customer/projects/{id}/submit` → экран «на модерации»
5. Отклонён: `GET .../projects/{id}` → `status=rejected`, `moderation_comment`, кнопка «Отправить на проверку» = снова `submit`
6. Карандаш: `PUT /customer/projects/{id}`
7. Корзина: `DELETE /customer/projects/{id}`

Примеры тела — Swagger **Customer: Проекты**.

## Новая площадка

1. `POST /customer/venues` — информация, характеристики, `prices[]`
2. Фото: `POST /customer/venues/{id}/photos`  
   - обложка: `{ "url" }`  
   - альбом: `{ "url", "album": "Интерьер" }`
3. `POST /customer/venues/{id}/submit` → «площадка отправлена на модерацию»
4. Галерея: `GET /customer/venues/{id}/photos?album=&page=` — «Показать ещё»: `page++`

## Избранное / отзывы / чаты

«Добавить в избранное»: `POST /customer/favorites` `{ target_type, target_id }`  
`target_type`: `user` | `venue` | `project`

Отзыв: `POST /customer/reviews` `{ target_id, venue_id?, rating, body }`

«Написать сообщение»: `POST /customer/chats` `{ peer_id }` затем `POST /customer/chats/{id}/messages`

«Пригласить в проект»: `POST /customer/invites` `{ performer_id, project_id }`  
Отклики на свои проекты: `GET /customer/applications` → accept/reject.

## Каталог (шапка)

| Пункт меню | Запрос |
|---|---|
| Модели | `GET /customer/catalog/performers?specialty=model` |
| Фотографы | `?specialty=photographer` |
| Видеографы | `?specialty=videographer` |
| Площадки | `GET /customer/catalog/venues?city=` |
| Агентства | `GET /customer/catalog/agencies` |
| Проекты | `GET /customer/catalog/projects` |

Карточка площадки (характеристики, цены, отзывы, `latitude`/`longitude` для карты):  
`GET /customer/catalog/venues/{id}`

Подробные example — http://localhost:8000/docs

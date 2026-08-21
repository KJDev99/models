# Public site — frontend

Base: `http://localhost:8000/api/v1/site`

Каталог и FAQ **без токена**. Остальное:

```
Authorization: Bearer <access_token>
```

## FAQ («ЧАСТЫЕ ВОПРОСЫ»)

На каждой странице свой блок. Тип страницы:

```
GET /site/faqs?type=models
GET /site/faqs?type=photographers
GET /site/faqs?type=videographers
GET /site/faqs?type=venues
GET /site/faqs?type=projects
GET /site/faqs?type=project_detail
GET /site/faqs?type=agencies
GET /site/faqs?type=agency_profile
GET /site/faqs?type=performer_profile
GET /site/faqs?type=customer_profile
GET /site/faqs?type=contacts
GET /site/faqs?type=favorites
GET /site/faqs?type=home
```

Ответ: массив `{ id, question, answer, sort_order }` — аккордеон, `+` раскрывает `answer`.

Селект «направление» при добавлении: `GET /site/faq-types`.

Добавить (любая роль, обязателен `page_type`):

```
POST /site/faqs
{ "page_type": "agencies", "question": "...", "answer": "..." }
```

Не-админ: вопрос уходит на модерацию (`pending_review`). Админ в панели: **Admin: FAQ** → publish.

## Каталог шапки

| Меню | Запрос |
|---|---|
| Модели | `GET /site/performers?specialty=model&sort=popular&age_min=&height_min=&price_min=` |
| Фотографы | `?specialty=photographer` |
| Видеографы | `?specialty=videographer` |
| Площадки | `GET /site/venues?city=&area_min=&price_min=&sort=popular` |
| Проекты | `GET /site/projects` |
| Агентства | `GET /site/agencies` |
| Контакты | `GET /site/contacts` |
| Поиск шапки | `GET /site/search?q=` |

Карточка проекта: `GET /site/projects/{id}`  
`related[]` — «Другие проекты». `owner_stats` — счётчики бренда.

«Подать заявку»: `POST /site/projects/{id}/apply` `{ "message" }`  
- нет токена → модалка входа (`UNAUTHORIZED`)  
- не исполнитель → тот же текст (`FORBIDDEN`)  
- успех → «Заявка отправлена», кнопка «Перейти в чат» = `/site/chats/{conversation_id}`

Заказчик принимает отклик: `POST /customer/applications/{id}/accept`.  
«Пригласить в проект» на анкете: `POST /site/performers/{id}/invite` `{ "project_id" }` (роль `customer`).

Профиль заказчика/компании: `GET /site/customers/{id}`  
Агентство: `GET /site/agencies/{id}`  
Исполнитель: `GET /site/performers/{id}` + `related` («Другие модели»).

## Live-чат

`new WebSocket(\`${WS}/api/v1/ws/chat/${conversationId}?token=${accessToken}\`)`  
Отправка: `socket.send(JSON.stringify({ body, attachment_url }))`.  
Входящие: `event === "message"` → `data` (строка сообщения). REST по-прежнему работает.

## Файлы / бронь / юр. страницы

Фото: `POST /site/upload` FormData `file` → `data.url`.  
Бронь площадки: `POST /site/venues/{id}/book` `{ shoot_date }`.  
Оплата: `POST /site/bookings/{id}/pay` `{ method: "offline" }`.  
Соглашение: `GET /site/legal/terms?locale=ru`.  
Язык: `PATCH /site/me/locale` `{ "locale": "uz" }`.  
Поделиться: `POST /site/share` `{ target_type: "user", target_id }`.  
Карта: `GET /site/geocode?address=` если задан ключ Яндекса.

## Избранное / уведомления / жалоба

`GET /site/favorites?tab=all|models|photographers|videographers|agencies|venues|projects`  
`counts` — цифры на вкладках.

`GET /site/notifications` → `unread` для бейджа колокольчика.

Типы `ntype`: `project_application`, `application_accepted`, `application_rejected`, `project_invite`, `profile_published`, `project_published`, `venue_published`, `*_rejected`, `complaint_accepted`, `complaint_rejected`, `booking_*`, `chat_message`.

Жалоба из чата: `POST /site/complaints` `{ accused_id, conversation_id, reason, body }`.

Подробные example — http://localhost:8000/docs теги **Site: …**

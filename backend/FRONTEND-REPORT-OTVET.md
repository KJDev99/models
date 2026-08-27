# Ответ бэкенда на отчёты фронта

Дата: 26.08.2026  
API: `https://admin.agunastroy.ru/api/v1`  
Swagger: `https://admin.agunastroy.ru/docs`  
Формат: `{ "success": true, "data": ... }` / `{ "success": false, "error": { "code", "message", "details" } }`.

Это один актуальный файл.

---

## Демо-учётки

Пароли не менялись.

| Роль | Email | Пароль | Куда логиниться |
|---|---|---|---|
| админ | `admin@shootinghub.local` | `Admin12345` | `POST /admin/auth/login` |
| заказчик | `customer@shootinghub.local` | `Demo12345` | `/auth/identify` → `/auth/login` |
| компания | `company@shootinghub.local` | `Demo12345` | то же |
| модель | `performer@shootinghub.local` | `Demo12345` | то же |
| фотограф | `photographer@shootinghub.local` | `Demo12345` | то же |
| видеограф | `videographer@shootinghub.local` | `Demo12345` | то же |
| агентство | `agency@shootinghub.local` | `Demo12345` | то же |

CORS: `localhost:3000` / `3131` / `5173`, `basemodels.ru`, `www.basemodels.ru`, `admin.agunastroy.ru`.

---

## Что только что закрыто (отчёт №10)

Три пункта с бэкенда. На проде. Ключи — как вы читаете, фронт менять не нужно.

---

### 1. Число съёмок / кейсов в списке исполнителей

`GET /site/performers` — в каждом `items[]` те же счётчики, что в анкете:

```json
{
  "years_experience": 3,
  "shoots_count": 44,
  "cases_count": 15
}
```

| Поле | Куда идёт |
|---|---|
| `years_experience` | чип «N лет опыта» |
| `shoots_count` | чип «N съёмок» (фотограф) |
| `cases_count` | чип «N кейсов» (видеограф) |

`cases_count` = `cases_count ?? brands_count`. Если оба пустые — `null`, чип не рисуете.

---

### 2. Агентство на карточке исполнителя

`GET /site/performers/{id}` — блок **на верхнем уровне**, рядом с `user` / `profile` / `media`:

```json
{
  "agency": {
    "id": "b0c314c5-7273-48f1-bc59-cf18c8d5139c",
    "slug": "u-b0c314c57273",
    "name": "Star Agency",
    "logo_url": "https://admin.agunastroy.ru/uploads/demo/p-agency.jpg"
  }
}
```

Нет агентства → `"agency": null`. Тот же объект есть в `GET /site/performers` → `items[].agency`.

| Поле | Куда идёт |
|---|---|
| `agency.name` | подпись на плашке |
| `agency.logo_url` | логотип |
| `agency.slug` (или `id`) | ссылка `/agencies/{slug}` |

В `GET /site/agencies/{id}` → `performers[].slug` больше не `null` (пример: `u-1c1bc7316c4d`).

---

### 3. Чат техподдержки

```
GET /site/support
Authorization: Bearer <любая роль>
```

```json
{
  "user_id": "00000000-0000-0000-0000-000000000001",
  "name": "Поддержка",
  "logo_url": "https://admin.agunastroy.ru/uploads/support.png"
}
```

Дальше как «Написать» в профиле:

```
POST /customer/chats   { "peer_id": "00000000-0000-0000-0000-000000000001" }
POST /performer/chats  { "peer_id": "…" }
POST /agency/chats     { "peer_id": "…" }
```

| Поле | Куда идёт |
|---|---|
| `user_id` | `peer_id` при открытии диалога |
| `name` | подпись на кнопке (если пусто — «Поддержка») |
| `logo_url` | аватар в списке чатов |

Диалоги видны админу в `GET /admin/chats`. Ответ админа уходит от пользователя поддержки.

---

## Отчёт №7 (закрыт ранее)

Вкладки «Скрытые» больше не падают с 500. Неизвестный `status` — `422`, не `500`.

### 1. `?status=hidden`

Скрытие — флаг `is_hidden`, не значение enum `status`. Поэтому:

```
GET /agency/performers?status=hidden
GET /customer/venues?status=hidden
GET /customer/projects?status=hidden
```

→ `200`, фильтр `is_hidden = true`.

Можно и так: `?is_hidden=true` / `?is_hidden=false`.  
`?status=all` — без фильтра (как у приглашений).

В элементе `/customer/venues` теперь есть `is_hidden`. Скрыть площадку/проект:

```
POST /customer/venues/{id}/hide?hidden=true
POST /customer/projects/{id}/hide?hidden=true
```

Вкладка «Активные» (`status=active`) скрытые не показывает.

### 2. Неизвестный статус → 422

```
GET /agency/performers?status=pending
GET /customer/venues?status=accepted
```

```json
{ "success": false, "error": { "code": "VALIDATION_ERROR", "message": "Неизвестный статус", "details": { "status": "Допустимо: …" } } }
```

### 3. Демо-фото

Карточки заново залиты уникальными фото (не градиент, не 128×128, без копий одного лица). `p-vid7.jpg` тоже.

---

## Отчёт №6 (закрыт ранее)

Три пункта отчёта №5 остаются закрытыми. Ниже — два пункта по демо-данным и мелочь по списку откликов.

### 1. Демо-картинки — реальные размеры

Файлы в `uploads/demo/` перезалиты. Хост тот же: `https://admin.agunastroy.ru/uploads/demo/…`

| Было | Стало |
|---|---|
| обложки / логотипы 1×1, 148 байт | ~1200×800 JPEG |
| аватары исполнителей 128×128, ~3 КБ | ~800×1000 JPEG |

`next/image` больше не растягивает чёрный пиксель. Примеры:

```
GET https://admin.agunastroy.ru/uploads/demo/g-customer.jpg
GET https://admin.agunastroy.ru/uploads/demo/p-model.jpg
```

Оба `200 image/jpeg`, вес десятки килобайт, не 148 байт.

### 2. В приглашениях есть дата съёмки и цена

`GET /performer/invites` (и `GET /agency/invites`) в каждом элементе:

```json
{
  "id": "…",
  "project_id": "…",
  "project_slug": "p-…",
  "title": "Lookbook весна 2026",
  "cover_url": "https://admin.agunastroy.ru/uploads/demo/g-project.jpg",
  "city": "Москва",
  "shoot_date": "2026-09-16",
  "price_from": 45000,
  "status": "pending",
  "project_status": "active"
}
```

Карточка как в каталоге: «Москва • 16 сентября 2026 г.» и «от 45 000 ₽» (`price_from` — число). Те же поля есть в `GET /site/projects`.

### Мелочь: `/customer/applications` теперь `{ items, meta }`

```
GET /customer/applications
GET /customer/applications?status=pending&page=1&page_size=20
```

```json
{
  "items": [ … ],
  "meta": { "page": 1, "page_size": 20, "total": N, "pages": N }
}
```

Как у `GET /agency/applications` и `GET /performer/invites`. Старый голый массив больше не отдаём.

---

## Настройки (отчёт №5, закрыто)

`GET /performer/settings`, `PATCH /performer/settings/visibility`, `POST /performer/settings/hide?hidden=true|false` → `200`.
`GET /customer/settings` → `200`, маски на месте.

```json
{
  "email": "performer@shootinghub.local",
  "email_masked": "p*******r@shootinghub.local",
  "phone": "+79001230001",
  "phone_masked": "+7 (900)-***-**-01",
  "is_hidden": false,
  "show_phone": true,
  "show_email": false,
  "allow_invites": true,
  "password_changed_at": "2026-08-22T..."
}
```

Экран «Видимость профиля» можно вернуть на штатные ручки (не только на `GET /performer/cabinet`).

```
PATCH /performer/settings/visibility
{ "is_hidden": false, "show_phone": true, "show_email": false, "allow_invites": true }
```

Скрытие анкеты:

```
POST /performer/settings/hide?hidden=true
POST /performer/settings/hide?hidden=false
```

На `/visibility` метод только `PATCH` (`POST` / `PUT` → `405`).

| Переключатель | Поле |
|---|---|
| Показывать анкету | `is_hidden` (`true` = скрыта) |
| Показывать телефон | `show_phone` |
| Показывать почту | `show_email` |
| Разрешить приглашения | `allow_invites` |

Те же четыре поля есть в `GET /performer/cabinet`.

### 2. `GET /customer/settings` — больше не 500

```
GET /customer/settings
Authorization: Bearer <customer@shootinghub.local>
```

```json
{
  "email": "customer@shootinghub.local",
  "email_masked": "c*******r@shootinghub.local",
  "phone": "...",
  "phone_masked": "+7 (900)-***-**-00",
  "phone_display": "+7 (900)-123-00-00",
  "pending_email": null,
  "email_verified_at": null,
  "password_changed_at": "2026-08-22T..."
}
```

Блок «Безопасность» читайте отсюда — почта и телефон уже с маской. Кабинет для этого больше не нужен.

### 3. Демо-медиа со своего домена

Аватары больше не с `randomuser.me`. URL вида:

```
https://admin.agunastroy.ru/uploads/demo/p-model.jpg
https://admin.agunastroy.ru/uploads/demo/p-photo.jpg
```

Тот же хост, что у `POST /site/upload`. `randomuser.me` в `next.config.mjs` можно убрать, когда удобно.

Мелочи из того же отчёта:

- `requirement_tags` без дублей: `["video", "video"]` больше нет (`["video"]`).
- Подписи в `GET /site/dictionaries` русские: `Фэшн`, `Бьюти`, `Спорт`, `Видео`, `Свадьба`, `Каталог`. Слаг `value` тот же (`fashion`, `beauty`, …).

---

## Словарь и фильтры каталога

Значения берите **только** из `GET /site/dictionaries` и те же `value` кладите в query. В ответах каталога те же слаги, не «Fashion» / «Лофт». Подпись на UI = `label`.

| Ключ | Для кого | `value` |
|---|---|---|
| `work_directions` | модели, `?category=` | `fashion`, `commercial`, `catalog`, `advertising` |
| `categories` | проекты, `?category=` | `fashion`, `beauty`, `catalog`, `sport`, `video`, `wedding` |
| `project_types` | модели / общие, `?project_type=` | `photo`, `video`, `show` |
| `categories_photographer` | фотографы, `?category=` | `wedding`, `portrait`, `advertising`, `commercial`, `fashion` |
| `categories_videographer` | видеографы, `?category=` | `clips`, `advertising`, `cinema`, `interview`, `commercial`, `content` |
| `project_types_videographer` | видеографы, `?project_type=` | `video`, `music_clip`, `reportage`, `image` |
| `venue_types` | площадки, `?venue_type=` | `studio`, `loft`, `interior`, `cyclorama`, `terrace`, `grunge`, `penthouse`, `industrial`, `daylight`, `roof` |
| `suitable_for` | площадки, `?project_type=` | `photo`, `video`, `content`, `event` |

```
модели:        GET /site/performers?specialty=model&category=<work_directions.value>
фотографы:     GET /site/performers?specialty=photographer&category=<categories_photographer.value>
видеографы:    GET /site/performers?specialty=videographer&category=<categories_videographer.value>
```

В `items[]` приходят слаги:

```json
{
  "work_directions": ["fashion", "catalog"],
  "project_types": ["photo", "video"],
  "category": "fashion",
  "project_type": "photo",
  "venue_type": "loft",
  "suitable_for": ["photo", "video"]
}
```

Свою таблицу перевода «Лофт → loft» можно убрать.

Доп. query каталога:

- исполнители: `weight_min` / `weight_max`, `gender`, `experience_min`, `category`, `project_type`, `can_travel`
- площадки: `venue_type`, `capacity_max`, `project_type`
- проекты: `category`, `looking_for`, `performers_count`, `price_min` / `price_max`, `date_from` / `date_to` (`YYYY-MM-DD`)
- агентства: `sort=new|popular|name-asc|performers-desc`

`sort` можно с `_` или `-` (`age_asc` / `age-asc`). Неизвестное = `new`.

`{id}` в карточках — UUID **или** slug: `/site/performers/mariya-volkova-0b8cc430`. То же для agencies / venues / projects.

В списке исполнителей: `work_directions`, `price_from` (число), `rating_avg`, `slug`, `is_favorite`. `related[]` той же формы, что список.

---

## Приглашения

В каждом элементе `status`: `pending` | `accepted` | `rejected`.

```
GET /performer/invites
GET /performer/invites?status=pending
GET /performer/invites?status=accepted
GET /performer/invites?status=rejected
GET /agency/invites?status=pending
```

`?status=all` или пусто — все. `new` = `pending`. Форма: `{ items, meta }`.

```
POST /performer/invites/{id}/accept
POST /performer/invites/{id}/reject
```

Повторно → `409`.

---

## Кабинеты и формы

**Бронь площадки** — `{id}` или slug:

```
POST /site/venues/{id}/book
{
  "shoot_date": "2026-09-01",
  "project_name": "Lookbook весна",
  "time_slot": "10:00–14:00",
  "comment": "4 человека"
}
```

Достаточно `shoot_date` + `time_slot`. Токен обязателен.

**Регистрация компании:** `company_name`, `representative_name`, `sphere_of_activity`. Если `first_name` пустой, сервер копирует из `representative_name`.

**Чаты** — `{ items, meta }` (не голый массив): `/site/chats`, `/customer/chats`, `/performer/chats`, `/agency/chats`. Сообщение только с картинкой: `{ "body": null, "attachment_url": "…" }`.

**Портфолио:** `GET /performer/portfolio` → `{ items, albums, meta }` (в т.ч. `?album=`).

**Отклики заказчика:** `GET /customer/applications?status=new|pending|accepted|rejected|all` (`new` = `pending`, `all` = без фильтра).

**Агентство:** `GET /agency/applications`, `GET /agency/invites`, `GET /agency/projects?status=`. `POST /agency/performers` не требует email/телефон.

**VALIDATION_ERROR:** `details` и картой полей, и массивом `errors`; `msg` на русском.

---

## Модерация

Публичный каталог — только `active` и не скрытое.

Публикации заказчика: `GET /customer/projects`, `GET /customer/venues`.  
`?status=draft|pending_review|active|rejected|archived`. Пусто / `all` = без фильтра.

Цепочка: создали → `draft` → «На проверку» → `pending_review` → админ одобрил → `active`.

```
GET  /admin/moderation
POST /admin/moderation/venue/{id}/approve
POST /admin/moderation/venue/{id}/reject   { "comment": "…" }
POST /admin/moderation/user/{id}/approve
```

Отзыв `POST /customer/reviews` сразу на сайт не попадает (`pending_review`). На карточке только `published`.

---

## Чеклист для Sobir

1. Карточки каталога — живые фото, не чёрные плитки. `g-customer.jpg` / `p-model.jpg` больше не 148 байт и не 128×128.
2. `GET /performer/invites` — в элементе `shoot_date` и `price_from`.
3. `GET /customer/applications` — `{ items, meta }`, не голый массив.
4. Настройки исполнителя/заказчика — 200, маски на месте.
5. Фильтры — только `value` из `/site/dictionaries`; в карточках слаги, подпись из `label`.
6. Приглашения — `status` + `?status=` + accept/reject.
7. Чаты — `data.items`, не `data` как массив.

Если что-то упадёт: method, полный URL с query, HTTP-код и 5–10 строк тела. Одного «500» мало.

# Performer — frontend

Base: `http://localhost:8000/api/v1/performer`

Токен: `/auth/login` с `role=performer`.

```
Authorization: Bearer <access_token>
```

## Кабинет

`GET /performer/cabinet`

- Пусто: `sections.parameters/prices/experience/portfolio === false` → кнопка «Заполнить профиль»
- `status === "pending_review"` → экран «на модерации», `wizard.step === 4`
- `status === "rejected"` → баннер + `moderation_comment`, кнопка «Исправить профиль» → снова мастер
- `status === "active"` → полная карточка, бейдж «Активен»
- Возраст: `age` (из `birth_date`)

## Мастер анкеты

1. `PUT /performer/profile` — вкладки модель / фотограф / видеограф (`performer_specialty`). «В черновик»: `?as_draft=true`
2. `PUT /performer/experience` `{ "items": [{ year, project_name, brand, role_title }] }`
3. Главное фото: `POST /performer/photo` `{ "url" }`
   Альбом: `POST /performer/portfolio` `{ "url", "album": "Фотосессии" }`
4. `POST /performer/submit` → экран успеха, «Перейти в личный кабинет»

Примеры тела — Swagger **Performer: Анкета** (модель / фотограф / видеограф).

## Портфолио / отзывы

`GET /performer/portfolio?album=Фотосессии&page=1&page_size=16`
`albums[]` — вкладки с `count`. «Показать ещё» — `page++`.

`GET /performer/reviews` — пусто: `items.length === 0`.

## Настройки

`GET /performer/settings` → email, phone, `password_changed_at`, `is_hidden`

| UI | Запрос |
|---|---|
| Пароль | `PATCH /performer/settings/password` |
| Почта | `PATCH /performer/settings/email` |
| Телефон | `PATCH /performer/settings/phone` |
| Скрыть профиль | `POST /performer/settings/hide?hidden=true` |
| Удаление | `DELETE /performer/settings` |

После смены пароля — новый логин.

`GET /performer/applications` — статус своих откликов на проекты.

Подробные example — http://localhost:8000/docs

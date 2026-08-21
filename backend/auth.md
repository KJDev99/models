# Auth — frontend

Backend nima qilganini va har bir UI oyna qaysi API ga ulanishini shu yerda yozilgan.

Base URL: `http://localhost:8000/api/v1`  
Swagger: `http://localhost:8000/docs`

Har bir muvaffaqiyatli javob:

```json
{ "success": true, "data": { } }
```

Xato:

```json
{ "success": false, "error": { "code": "...", "message": "...", "details": {} } }
```

`error.message` ni to‘g‘ridan-to‘g‘ri UI da ko‘rsatish mumkin (rus tilida). `error.code` bo‘yicha branching qiling, HTTP statusga emas.

---

## 1-oyna: rol tanlash («ВХОД»)

Tugmalar:

- Я ЗАКАЗЧИК → `role = "customer"`
- Я ИСПОЛНИТЕЛЬ → `role = "performer"`
- АГЕНТСТВО → `role = "agency"`

Bu qiymatni modal state da saqlang. Backendga hozircha so‘rov yo‘q.

- **Войти** → login oqimi, `intent = "login"`
- **Зарегистрироваться** → register oqimi, `intent = "register"`

---

## 2-oyna: telefon / email («Далее»)

Tab: Телефон | Почта

Foydalanuvchi **Далее** bosganda:

```http
POST /api/v1/auth/identify
Content-Type: application/json
```

Telefon:

```json
{
  "role": "customer",
  "intent": "login",
  "identifier_type": "phone",
  "phone": "+7 (900)-123-45-67"
}
```

Email:

```json
{
  "role": "customer",
  "intent": "login",
  "identifier_type": "email",
  "email": "ivan@mail.ru"
}
```

Register bo‘lsa `intent` ni `"register"` qiling. Qolgani bir xil.

### Nima qaytadi

```json
{
  "success": true,
  "data": {
    "challenge_token": "eyJhbGciOi...",
    "next_step": "password",
    "display_identifier": "+7 (900)-123-45-67",
    "role": "customer"
  }
}
```

Frontend **majburiy**:

1. `challenge_token` ni memory/state da saqlang (localStorage shart emas, 10 daqiqa yashaydi).
2. `display_identifier` ni keyingi oynada ko‘rsating:
   - login: «От профиля с номером +7 (900)-123-45-67»
   - yoki «От профиля с почтой ivan@mail.ru»
3. `next_step === "password"` → parol oynasi
4. `next_step === "register"` → «ЗНАКОМСТВО» forma

### Xatolar

| code | UI |
|---|---|
| `USER_NOT_FOUND` | Login: «Профиль не найден», Register tugmasiga yo‘naltirish mumkin |
| `USER_ALREADY_EXISTS` | Register: «Уже зарегистрирован», Login ga yo‘naltirish |
| `VALIDATION_ERROR` | Input tagida qizil xato |
| `ACCOUNT_BLOCKED` | Blok modal (pastda) |

Telefonni `+7 (000)-000-00-00` maskada yuborish mumkin. Backend o‘zi `+79001234567` ga aylantiradi. `8` bilan boshlansa ham ishlaydi.

---

## 3-oyna: parol («ВВЕДИТЕ ПАРОЛЬ»)

Back arrow → identify oynasiga (yangi `challenge_token` olish shart emas, eski hali yaroqli bo‘lsa).

```http
POST /api/v1/auth/login
```

```json
{
  "challenge_token": "<identify dan kelgan token>",
  "password": "user typed password"
}
```

Muvaffaqiyat: `data.tokens` va `data.user`.

Saqlash:

- `access_token` — memory yoki qisqa muddatli storage
- `refresh_token` — httpOnly cookie afzal; hozir backend JSON qaytaradi, frontend o‘zi saqlaydi
- `user` — app store (role, status, ism)

Keyingi API chaqiriqlar:

```
Authorization: Bearer <access_token>
```

| code | UI |
|---|---|
| `INVALID_CREDENTIALS` | Parol inputida xato |
| `CHALLENGE_EXPIRED` | Identify oynasiga qaytarish |
| `ACCOUNT_BLOCKED` | Blok modal |

---

## 4-oyna: registratsiya «ЗНАКОМСТВО»

Avval identify `intent=register` muvaffaqiyatli bo‘lishi kerak.

### Заказчик — tabs Частное лицо / Компания

```http
POST /api/v1/auth/register/customer
```

Частное лицо:

```json
{
  "challenge_token": "...",
  "customer_type": "individual",
  "first_name": "Иван",
  "last_name": "Иванов",
  "city": "Москва",
  "password": "********",
  "password_confirm": "********"
}
```

Компания: `customer_type: "company"`, `company_name` majburiy, ism/familiya ixtiyoriy.

### Исполнитель — tabs Модель / Фотограф / Видеограф

```http
POST /api/v1/auth/register/performer
```

```json
{
  "challenge_token": "...",
  "performer_specialty": "photographer",
  "first_name": "Анна",
  "last_name": "Петрова",
  "gender": "female",
  "city": "Казань",
  "password": "********",
  "password_confirm": "********"
}
```

`performer_specialty`: `model` | `photographer` | `videographer`  
`gender`: `male` | `female` | `not_specified`

Bu user `status: "pending_review"` bilan yaratiladi — headerdagi «На проверку» shu.

### Агентство

```http
POST /api/v1/auth/register/agency
```

```json
{
  "challenge_token": "...",
  "agency_name": "Star Agency",
  "representative_name": "Иван Петров",
  "city": "Москва",
  "password": "********",
  "password_confirm": "********"
}
```

Parollar mos kelmasa backend `422 VALIDATION_ERROR` qaytaradi. Frontend ham client-side tekshirsin.

Javob login bilan bir xil: tokenlar + user. Darhol login qilingan hisoblanadi.

---

## 5-oyna: OAuth («ВОЙТИ ЧЕРЕЗ» / ikonlar)

To‘g‘ridan-to‘g‘ri POST yo‘q. Browser ni backend URL ga yuboring:

```
GET {API}/auth/oauth/yandex/start?role=customer&intent=login
GET {API}/auth/oauth/vk/start?role=customer&intent=login
GET {API}/auth/oauth/odnoklassniki/start?role=customer&intent=login
```

Register oqimidan: `intent=register`.

Oqim:

1. Frontend `window.location = startUrl` (yoki popup).
2. User Yandex/VK/OK da ruxsat beradi.
3. Backend callback qiladi, token yaratadi.
4. Frontend `.env` dagi success URL ga qaytadi:

```
https://your-frontend/auth/oauth/success?access_token=...&refresh_token=...
```

Frontend shu sahifada tokenlarni olib, URL dan o‘chirib tashlashi kerak (`history.replaceState`), keyin `GET /auth/me`.

Xato:

```
https://your-frontend/auth/oauth/error?code=OAUTH_FAILED
```

Agar `is_profile_complete === false` (yangi OAuth user) — «Знакомство» formasini oching va token bilan shu endpointlardan birini chaqiring:

```
PATCH /api/v1/auth/profile/customer
PATCH /api/v1/auth/profile/performer
PATCH /api/v1/auth/profile/agency
Authorization: Bearer <access_token>
```

Body register formasiga o‘xshaydi, lekin `challenge_token` yo‘q. Parol ixtiyoriy (OAuth yetarli). Javob: yangilangan `user`.

Provider sozlanmagan bo‘lsa start `503 OAUTH_NOT_CONFIGURED` — tugmani disable qilish yoki yashirish mumkin.

---

## 6-oyna: akkaunt bloklangan

Login yoki `/auth/me` `403` va `error.code === "ACCOUNT_BLOCKED"` qaytarsa shu modal:

```json
{
  "error": {
    "code": "ACCOUNT_BLOCKED",
    "message": "Доступ к аккаунту ограничен за нарушение правил платформы",
    "details": {
      "title": "АККАУНТ ЗАБЛОКИРОВАН",
      "measure": "Заблокировать на 1 день",
      "reason": "Неоднократное нарушение правил общения и оскорбительное поведение в переписке",
      "blocked_until": "2026-08-16T03:47:00+00:00"
    }
  }
}
```

UI mapping:

- Sarlavha → `details.title`
- Matn → `error.message`
- Мера → `details.measure`
- Причина → `details.reason`
- «Связаться с поддержкой» → hozircha mailto / contacts (endpoint keyin)
- «Назад» → login boshiga, tokenlarni o‘chirish

---

## Tokenlarni yangilash

Access 15 daqiqa. 401 `UNAUTHORIZED` kelsa:

```http
POST /api/v1/auth/refresh
{ "refresh_token": "..." }
```

Javobdagi yangi juftlikni saqlang (eski refresh endi yaroqsiz — rotation).

Chiqish:

```http
POST /api/v1/auth/logout
{ "refresh_token": "..." }
```

Keyin local tokenlarni o‘chiring.

Joriy user:

```http
GET /api/v1/auth/me
Authorization: Bearer <access>
```

---

## Tavsiya etilgan frontend state

```
role: customer | performer | agency
intent: login | register
identifierType: phone | email
challengeToken: string | null
displayIdentifier: string
user: User | null
accessToken / refreshToken
```

Modal qadamlari:

```
role-select → identifier → password | intro-form
                 ↘ oauth
```

---

## User.status ni UI da qanday ko‘rsatish

| status | Kimda | UI |
|---|---|---|
| `active` | odatda customer | oddiy ish |
| `pending_review` | performer, agency | «На проверку» |
| `blocked` | hammasi | blok modal, API ishlamaydi |
| `rejected` | moderator rad etgan | keyingi qism |

---

## Tezkor checklist

1. Rolni state da saqlash
2. Identify → `challenge_token` ni keyingi stepga olib o‘tish
3. Login/register dan token + user ni saqlash
4. Har protected request da `Authorization: Bearer`
5. 401 da refresh, yana fail bo‘lsa login modal
6. `ACCOUNT_BLOCKED` ni alohida modal
7. OAuth success URL dan tokenni olib, query ni tozalash

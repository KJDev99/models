# База моделей

Модели, фотографы, видеографы, съёмочные площадки, проекты и агентства — с личными кабинетами для **5 ролей**.

Stack: **Next.js 16 (App Router) · React 19 · JavaScript (JSX) · Tailwind CSS v4 · zustand · axios**

Дизайн: [Figma — «База моделей»](https://www.figma.com/design/q9tapMQPdJjPlJbZN2F08P/База-моделей)

---

## Запуск

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm run lint
```

`.env.local`:

```
NEXT_PUBLIC_API_URL=/api/v1
NEXT_PUBLIC_API_ORIGIN=https://admin.modelworkrf.ru
API_ORIGIN=https://admin.modelworkrf.ru
NEXT_PUBLIC_WS_URL=wss://admin.modelworkrf.ru
NEXT_PUBLIC_SITE_URL=https://modelworkrf.ru
```

---

## Главное правило структуры

Для каждого маршрута в `app/` существуют **три** одноимённые папки:

```
app/<route>/          →  components/<route>/          →  public/img/<route>/
```

Примеры:

| app | components | public |
|---|---|---|
| `app/models/page.jsx` | `components/models/models-view.jsx` | `public/img/models/` |
| `app/models/[slug]/page.jsx` | `components/models/[slug]/model-detail.jsx` | `public/img/models/[slug]/` |
| `app/executor/questionnaire/page.jsx` | `components/executor/questionnaire/questionnaire-view.jsx` | `public/img/executor/questionnaire/` |
| `app/page.jsx` (главная) | `components/home/*` | `public/img/home/` |

Динамические сегменты переносятся дословно, вместе с квадратными скобками.

### Шаблон страницы

```jsx
// app/models/page.jsx  —  только подключение компонента
'use client'
import ModelsView from '@/components/models/models-view'
export default function ModelsPage() { return <ModelsView /> }
```

```jsx
// app/models/layout.jsx  —  server component, отдаёт metadata
import { pageMetadata } from '@/lib/seo'
export const metadata = pageMetadata('models')
export default function ModelsLayout({ children }) { return children }
```

Вся вёрстка и логика — в `components/<route>/`.
Для динамических страниц вместо `metadata` используется `generateMetadata` + `getData` с fallback'ом.

---

## Роли

| Роль | Префикс | Кабинет | Figma |
|---|---|---|---|
| Заказчик — частное лицо | `client` | `/client/dashboard` | Заказчик (345:18920) |
| Заказчик — компания | `company` | `/company/dashboard` | Профиль компании (208:4733) |
| Исполнитель (модель/фотограф/видеограф) | `executor` | `/executor/dashboard` | Анкета (260:11332) |
| Агентство | `agency` | `/agency/dashboard` | LUMEN AGENCY (270:20518) |
| Администратор | `admin` | `/admin/dashboard` | Дашборд (321:12629) |

Единый источник — `lib/roles.js`. Меню кабинетов — `lib/nav.js`.
Доступ закрывается в `app/<role>/layout.jsx` через `RoleGuard` + `CabinetLayout`.

---

## Карта маршрутов (129)

### Открытый сайт
```
/                       Главная
/models                 /models/[slug]
/photographers          /photographers/[slug]
/videographers          /videographers/[slug]
/venues                 /venues/[slug]
/projects               /projects/[slug]
/agencies               /agencies/[slug]
/companies/[slug]       Профиль компании
/persons/[slug]         Профиль частного лица
/contacts  /onboarding  /favorites  /notifications  /chat  /chat/[id]
```

### Авторизация
```
/auth/login  /auth/login/phone  /auth/login/email  /auth/login/password  /auth/login/service
/auth/register  /auth/register/role  /auth/register/agency
/auth/forgot-password  /auth/reset-password  /auth/blocked
```

### Кабинеты
Общий набор для `client` / `company` / `executor` / `agency`:
```
/<role>/dashboard      /<role>/favorites   /<role>/reviews   /<role>/invites
/<role>/chat           /<role>/chat/[id]   /<role>/notifications
/<role>/settings       /<role>/settings/password | email | phone | delete
```

Дополнительно:
```
client    /client/projects  /client/projects/new  /client/projects/[id]  /client/projects/[id]/edit
          /client/models  /client/models/[slug]

company   /company/projects  …/new  …/[id]  …/[id]/edit
          /company/venues    …/new  …/[id]  …/[id]/edit
          /company/executors  /company/executors/[slug]

executor  /executor/questionnaire   (4 шага: инфо → опыт → портфолио → модерация)
          /executor/portfolio  /executor/projects  /executor/settings/visibility

agency    /agency/executors  …/new  …/[id]  …/[id]/edit
          /agency/projects
```

### Админка
```
/admin/dashboard
/admin/executors  …/new  …/[id]  …/[id]/edit
/admin/clients    …/[id]
/admin/agencies   …/new  …/[id]
/admin/projects   …/new  …/[id]
/admin/venues     …/new  …/[id]
/admin/reviews  /admin/moderation  /admin/moderation/[id]
/admin/complaints  /admin/complaints/[id]
/admin/chats  /admin/chats/[id]  /admin/settings
```

---

## Каталог файлов

```
app/                    маршруты (page.jsx + server layout.jsx с metadata)
components/
  ui/                   дизайн-система: button, input, select, modal, table, stepper…
  layout/               navbar, footer, mobile-nav, providers
  guards/               auth-guard, role-guard
  cabinet/              cabinet-layout, cabinet-sidebar, resource-list, form-card, settings-nav
  shared/               карточки, детальные страницы, модалки, чат, фильтры, галерея
  <route>/              компоненты конкретной страницы
lib/
  roles.js              5 ролей, их кабинеты и типы исполнителей
  nav.js                публичное меню, футер, меню кабинетов
  auth.js               сессия в localStorage + событие `auth-changed`
  use-auth.js           реактивное чтение сессии
  axios.js              api / apiToken (Bearer, 401 → сброс сессии)
  getData.jsx           GET-обёртки с нормализацией {count,results}
  seo.jsx               PAGE_SEO + pageMetadata / cabinetMetadata / *Metadata
  statuses.js           статусы модерации и жалоб
  format.js             цена, дата, телефон, возраст
  favorites.js          избранное в localStorage
store/
  useAuthStore          вход, регистрация, выбор роли, смена пароля/почты/телефона
  useApiStore           универсальные запросы (в т.ч. FormData)
  useCatalogStore       каталоги + фильтры
  useFavoritesStore     избранное (localStorage + backend)
  useChatStore          чаты, сообщения, жалобы
  useNotificationStore  уведомления
public/img/<route>/     картинки страницы (зеркало маршрутов)
```

---

## Токены дизайна

Из Figma variables, объявлены в `app/globals.css` через Tailwind v4 `@theme`:

| Токен | Значение | Класс |
|---|---|---|
| black | `#222222` | `text-black` |
| grey | `#666666` | `text-grey` |
| white | `#ffffff` | `bg-white` |
| light white | `#f8f8f8` | `bg-light-white` |
| gold | `#c8a46b` | `bg-gold` |

Плюс статусные: `success #3ba55d`, `warning #d8a13a`, `danger #d92727`.

---

## Что дальше

1. Согласовать эндпоинты с бекендом — они собраны в `store/*` и в `lib/seo.jsx`.
2. Разложить экспорт из Figma по `public/img/<route>/` и подставить `<Image>`.
3. Довести вёрстку каждой страницы до пиксельного соответствия макету.

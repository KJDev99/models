<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# База моделей — loyiha qoidalari

## Stack
Next.js 16 (App Router) · React 19 · JavaScript (JSX, TypeScript yo'q) · Tailwind CSS v4 · zustand · axios · react-icons · react-hot-toast

## Papka qoidasi (majburiy)
Har bir `app/` route uchun **uchta** joyda bir xil nomli papka bo'ladi:

```
app/<route>/page.jsx          →  components/<route>/…jsx   →  public/img/<route>/
app/executor/portfolio/       →  components/executor/portfolio/  →  public/img/executor/portfolio/
app/models/[slug]/            →  components/models/[slug]/       →  public/img/models/[slug]/
```

Dinamik segmentlar kvadrat qavs bilan aynan ko'chiriladi (`[slug]`, `[id]`).

## Sahifa qolipi
- `app/<route>/page.jsx` — `'use client'`, faqat o'z komponentini chaqiradi.
- `app/<route>/layout.jsx` — **server** komponent, `metadata` shu yerdan beriladi
  (`pageMetadata('key')` ochiq sahifalar uchun, `cabinetMetadata('Title')` kabinet uchun).
  Dinamik sahifalarda `generateMetadata` + `getData` ishlatiladi, xato bo'lsa fallback.
- Butun mantiq va razmetka `components/<route>/` ichida.

## Rollar
`lib/roles.js` — yagona manba. 5 rol: `client`, `company`, `executor`, `agency`, `admin`.
- Kabinet ildizi: `app/<role>/layout.jsx` → `RoleGuard` + `CabinetLayout`.
- Menyular: `lib/nav.js` (`CABINET_NAV`, `settingsNav`).
- Rol qo'shilsa — `lib/roles.js` + `lib/nav.js` + yangi `app/<role>/` bo'limi.

## Shriftlar
Figma'da ikkita shrift:
- **Helvetica Neue** — sarlavhalar (`font-display`, uppercase, tracking 0.48–1.6px). Tizim shrifti, `--font-display` orqali.
- **Montserrat** — matn, tugmalar, menyu. `next/font/google` orqali (`--font-montserrat` → `--font-sans`), og'irliklar 400/500/600.

`h1/h2/h3` avtomatik `font-display` oladi; boshqa joyda kerak bo'lsa `className="font-display"`.

## Ikonkalar
Faqat **lucide-react** (Figma'dagi Untitled UI to'plamiga eng yaqin). Mapping:
`arrow-narrow-up-right → ArrowUpRight`, `chevron-right/left → ChevronRight/ChevronLeft`,
`chevron-down → ChevronDown`, `heart-rounded → Heart`, `menu-01 → Menu`, `x → X`,
`file-06 → FileText`, `users-02 → Users`. Standart o'lcham `size={24} strokeWidth={2}`.

## Radius va o'lchamlar
Figma bo'ylab `rounded-[6px]`. Tugmalar: mobil `px-16 py-12 / 14px`, desktop `px-24 py-16 / 18px`.
Bo'limlar orasi: mobil 40px, desktop 100px. Konteyner — `components/ui/container.jsx`.

## Ranglar (Figma variables)
`black #222222` · `grey #666666` · `white #ffffff` · `light-white #f8f8f8` · `gold #c8a46b`
Tailwind v4 `@theme` orqali `app/globals.css`da e'lon qilingan: `bg-gold`, `text-grey`, `border-black/8`.
Yangi rang qo'shishdan oldin Figma variables'ni tekshiring.

## API
- `lib/axios.js` — `api` (tokensiz) va `apiToken` (Bearer + 401 da sessiyani tozalash).
- `store/useApiStore.js` — universal `getData/postData/...Token` metodlari.
- Endpoint nomlari faqat store fayllarida turadi, komponentlarda emas.

## Uslub
- Fayl nomlari kebab-case, komponentlar default export.
- Klass nomlari Tailwind, inline hex faqat Figma tokenlari bo'lmasa.
- Izohlar — o'zbekcha, matnlar (UI) — ruscha (Figma bo'yicha).
- Har bir komponent tepasida u qaysi Figma frame'idan olinganini ko'rsating: `// Figma: Модели (81:2586)`.

## Figma
Fayl: https://www.figma.com/design/q9tapMQPdJjPlJbZN2F08P/База-моделей (bitta sahifa — `Page 1`, `0:1`).

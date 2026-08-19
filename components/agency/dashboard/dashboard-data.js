// ─────────────────────────────────────────────────────────────────────────────
// «Агентство» kabinetining ma'lumotlari — Figma bandi 270:19921.
//
// To'ldirilgan profil ochiq saytdagi agentlik sahifasi bilan bir xil kontentni
// ko'rsatadi, shuning uchun `AGENCY` va `EXECUTORS` shu yerdan qayta
// ishlatiladi. Backend ulanganda `/agencies/me/` javobi bilan almashtiriladi.
// ─────────────────────────────────────────────────────────────────────────────

import {
    AGENCY,
    EXECUTORS,
    EXECUTOR_TABS,
    EXECUTORS_STEP,
} from '@/components/agencies/[slug]/agency-detail-data'

export { AGENCY, EXECUTOR_TABS, EXECUTORS_STEP }

// Kabinetda har bir anketaga holat va hisoblagichlar qo'shiladi
// (Figma 270:20599 — «Активен», 💬 45, 👁 45).
export const AGENCY_EXECUTORS = EXECUTORS.map((item, i) => ({
    ...item,
    // Kabinetdagi havola o'z bo'limiga olib boradi, ochiq katalogga emas.
    href: `/agency/executors/e-${item.id}`,
    editHref: `/agency/executors/e-${item.id}/edit`,
    status: i % 17 === 5 ? 'moderation' : i % 23 === 7 ? 'paused' : 'active',
    comments: 45,
    views: 45,
}))

// To'ldirilmagan profil (Figma 270:19929).
export const EMPTY_AGENCY = {
    name: AGENCY.name,
    city: AGENCY.city,
    about: 'Информация о агентстве пока не заполнена',
    contacts: 'Контакты не добавлены',
    stats: [
        { value: '0', label: 'Исполнителей' },
        { value: '0', label: 'Моделей' },
        { value: '0', label: 'Фотографов' },
        { value: '0', label: 'Видеографов' },
    ],
    emptyTitle: 'Пока нет исполнителей',
    emptyText:
        'Добавьте моделей, фотографов и видеографов в агентство, чтобы они отображались на этой странице.',
}

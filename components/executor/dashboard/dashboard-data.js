// ─────────────────────────────────────────────────────────────────────────────
// «Исполнитель» kabinetidagi anketa ma'lumotlari — Figma bandi 260:10428.
//
// To'ldirilgan anketa ochiq saytdagi model sahifasi bilan bir xil ma'lumotni
// ko'rsatadi, shuning uchun `MODEL` shu yerdan qayta ishlatiladi. Backend
// ulanganda `/executors/me/` javobi bilan almashtiriladi.
// ─────────────────────────────────────────────────────────────────────────────

import { MODEL } from '@/components/models/[slug]/model-detail-data'

export { MODEL as EXECUTOR }

// Anketa holatlari — Figma «Анкета активна» 260:11332 · «На модерации»
// 265:15457 · «Анкета отклонена» 265:14663 · to'ldirilmagan 260:11717.
export const PROFILE_STATES = ['empty', 'active', 'moderation', 'rejected']

// Rad etilgan anketa uchun moderator izohi (Figma 265:14667).
export const REJECT_REASON = {
    title: 'Анкета отклонена',
    text: 'Добавлены фотографии низкого качества.',
}

// To'ldirilmagan anketaning bo'sh bo'limlari (Figma 260:12076…320:12209).
export const EMPTY_PROFILE = {
    name: MODEL.name,
    city: MODEL.city,
    title: 'Создайте профиль исполнителя',
    text: 'Расскажите о себе и добавьте портфолио. После модерации ваш профиль появится в каталоге и станет доступен заказчикам.',
    image: '/img/executor/dashboard/empty-profile.png',
    blocks: {
        params: {
            title: 'Параметры не заполнены',
            text: 'Добавьте основные параметры, чтобы заказчики могли быстрее подобрать вас для проекта.',
        },
        prices: {
            title: 'Стоимость не указана',
            text: 'Добавьте стоимость ваших услуг, чтобы заказчики могли заранее оценить условия сотрудничества.',
        },
        projects: {
            title: 'Опыт ещё не добавлен',
            text: 'Добавьте проекты, в которых вы принимали участие, чтобы показать свой профессиональный опыт.',
        },
        portfolio: {
            title: 'Портфолио пока пусто',
            text: 'Добавьте фотографии и примеры работ, чтобы показать свой опыт и привлечь больше заказчиков.',
        },
        reviews: { title: 'Отзывов пока нет' },
    },
}

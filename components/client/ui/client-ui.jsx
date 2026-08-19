'use client'

// ─────────────────────────────────────────────────────────────────────────────
// «Заказчик» kabinetining elementlari. Ular «Исполнитель» kabineti bilan aynan
// bir xil bo'lgani uchun haqiqiy kod `components/shared/cabinet/cabinet-ui.jsx`
// da turadi — bu yerda faqat kabinetdagi eski nomlar saqlanadi.
// ─────────────────────────────────────────────────────────────────────────────

export {
    CabinetBreadcrumb as ClientBreadcrumb,
    CabinetPage as ClientPage,
    CabinetTitle as ClientTitle,
    CabinetResult as ClientResult,
    CabinetCard as ClientCard,
} from '@/components/shared/cabinet/cabinet-ui'

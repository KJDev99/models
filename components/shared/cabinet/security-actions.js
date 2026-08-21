import * as customerApi from '@/lib/api/customer'
import * as performerApi from '@/lib/api/performer'
import * as agencyApi from '@/lib/api/agency'
import { ROLES } from '@/lib/roles'

// ─────────────────────────────────────────────────────────────────────────────
// «Безопасность» oynalari uch rolda bir xil ko'rinadi, lekin endpointlari
// boshqacha (backend/customer.md · performer.md · agency.md):
//
//   parol    customer: PATCH /customer/settings/password
//            performer: PATCH /performer/settings/password
//            agency:    PATCH /agency/profile/security
//
//   pochta   customer: POST  /customer/settings/email  → tasdiqlash xati
//            performer: PATCH /performer/settings/email (bir qadamda)
//            agency:    yo'q
//
//   telefon  customer: PATCH /customer/settings/phone → SMS kodi
//            performer: PATCH /performer/settings/phone (bir qadamda)
//            agency:    yo'q
//
// Shu fayl rolga qarab kerakli funksiyani beradi; oyna esa `null` kelsa
// tegishli qatorni ko'rsatmaydi.
// ─────────────────────────────────────────────────────────────────────────────

function isCustomer(role) {
    return role === ROLES.CLIENT || role === ROLES.COMPANY
}

export function securityApi(role) {
    if (isCustomer(role)) {
        return {
            changePassword: customerApi.changePassword,
            // Pochta ikki qadamda: so'rov → xat → havola bo'yicha tasdiq.
            changeEmail: customerApi.changeEmail,
            resendEmail: customerApi.resendEmail,
            confirmEmail: customerApi.confirmEmail,
            // Telefon ikki qadamda: so'rov → SMS kodi.
            changePhone: customerApi.changePhone,
            confirmPhone: customerApi.confirmPhone,
            deleteAccount: customerApi.deleteAccount,
            settings: customerApi.settings,
        }
    }

    if (role === ROLES.EXECUTOR) {
        return {
            changePassword: performerApi.changePassword,
            changeEmail: performerApi.changeEmail,
            resendEmail: null,
            confirmEmail: null,
            changePhone: performerApi.changePhone,
            confirmPhone: null,
            deleteAccount: performerApi.deleteAccount,
            settings: performerApi.settings,
        }
    }

    if (role === ROLES.AGENCY) {
        return {
            changePassword: agencyApi.updateSecurity,
            changeEmail: null,
            resendEmail: null,
            confirmEmail: null,
            changePhone: null,
            confirmPhone: null,
            deleteAccount: agencyApi.deleteAccount,
            settings: null,
        }
    }

    return {}
}

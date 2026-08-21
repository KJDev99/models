import * as adminApi from '@/lib/api/admin'
import { num, yesNo } from '@/components/executor/questionnaire/questionnaire-api'

// ─────────────────────────────────────────────────────────────────────────────
// Adminkadagi «Создать / Редактировать исполнителя» formasini backend
// maydonlariga o'giradi. Endpointlar: POST/PUT /admin/performers (+ agentlik
// ichida POST /admin/agencies/{id}/performers) — backend/admin.md.
// ─────────────────────────────────────────────────────────────────────────────

function text(value) {
    const v = String(value ?? '').trim()
    return v || undefined
}

// «Опыт работы» hisoblagichlari ixtisoslikka qarab boshqa nomga tushadi.
function counters(type, form) {
    if (type === 'videographer') {
        return {
            years_experience: num(form.years),
            cases_count: num(form.shoots),
            brands_count: num(form.brands),
            videos_count: num(form.projects),
        }
    }
    return {
        years_experience: num(form.years),
        shoots_count: num(form.shoots),
        brands_count: num(form.brands),
        projects_count: num(form.projects),
    }
}

// Formadagi ro'yxat qiymatlari (`s`, `dark`, …) → Figma yorliqlari.
function labelOf(options = [], value) {
    return options.find((o) => o.value === value)?.label
}

export function executorBody(form, paramFields = []) {
    const p = form.params || {}
    const pick = (key) => labelOf(paramFields.find((f) => f.key === key)?.options, p[key])

    const body = {
        performer_specialty: form.type,
        first_name: text(form.firstName),
        last_name: text(form.lastName),
        city: text(form.city),
        about: text(form.about),
        work_directions: form.tags?.length ? form.tags : undefined,
        email: text(form.email),
        phone: text(form.phone),
        password: text(form.password),
        ...counters(form.type, form),
        has_foreign_passport: yesNo(p.passport),
        can_travel: yesNo(p.travel),
        prices: (form.prices || [])
            .filter((x) => x.type?.trim() && x.value?.trim())
            .map((x) => ({ service_type: x.type.trim(), price_label: x.value.trim() })),
        experience: (form.works || [])
            .filter((w) => w.project?.trim())
            .map((w) => ({
                year: num(w.year),
                project_name: w.project.trim(),
                brand: text(w.brand),
                role_title: text(w.role),
            })),
    }

    if (form.type === 'model') {
        Object.assign(body, {
            height_cm: num(p.height),
            weight_kg: num(p.weight),
            chest_cm: num(p.chest),
            waist_cm: num(p.waist),
            hips_cm: num(p.hips),
            clothing_size: pick('clothing'),
            shoe_size: p.shoes ? String(p.shoes) : undefined,
            hair_color: pick('hair'),
            eye_color: pick('eyes'),
        })
    }

    // Bo'sh maydonlar yuborilmasin — backend `null` va `''` ni farqlaydi.
    for (const key of Object.keys(body)) {
        if (body[key] === undefined) delete body[key]
    }
    return body
}

// GET /admin/performers/{id} javobini forma qiymatlariga qaytaradi.
export function toFormValues(data) {
    if (!data) return null
    const user = data.user || data
    const profile = data.profile || {}
    const type = user.performer_specialty || 'model'

    const c =
        type === 'videographer'
            ? [profile.years_experience, profile.cases_count, profile.brands_count, profile.videos_count]
            : [
                  profile.years_experience,
                  profile.shoots_count,
                  profile.brands_count,
                  profile.projects_count,
              ]

    return {
        type,
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        city: user.city || '',
        about: data.about || profile.about || '',
        tags: profile.work_directions || [],
        email: user.email || '',
        phone: user.phone || '',
        password: '',
        years: c[0] ?? '',
        shoots: c[1] ?? '',
        brands: c[2] ?? '',
        projects: c[3] ?? '',
        params: {
            height: profile.height_cm ?? '',
            weight: profile.weight_kg ?? '',
            chest: profile.chest_cm ?? '',
            waist: profile.waist_cm ?? '',
            hips: profile.hips_cm ?? '',
            shoes: profile.shoe_size ?? '',
            passport: bool(profile.has_foreign_passport),
            travel: bool(profile.can_travel),
        },
        prices: (data.prices || []).map((x) => ({
            type: x.service_type || '',
            value: x.price_label || '',
        })) || [{ type: '', value: '' }],
        works: (data.experience || []).map((e) => ({
            year: e.year ?? '',
            project: e.project_name || '',
            brand: e.brand || '',
            role: e.role_title || '',
        })),
        photos: (data.media || []).filter((m) => m.url).map((m) => m.url),
    }
}

function bool(value) {
    if (value === true) return 'yes'
    if (value === false) return 'no'
    return ''
}

// Adminka va agentlik ichidagi ikki oqim uchun endpoint to'plami.
export function executorActions({ mode, id, agencyId }) {
    return {
        save: async (body) => {
            if (mode === 'edit') return adminApi.updatePerformer(id, body)
            if (agencyId) return adminApi.addAgencyPerformer(agencyId, body)
            return adminApi.createPerformer(body)
        },
        addPhoto: (performerId, url) => adminApi.addPerformerPhoto(performerId, { url }),
    }
}

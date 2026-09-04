import { SITE, PAGE_SEO } from '@/lib/seo'
import * as site from '@/lib/api/site'

export const revalidate = 3600

// Bitta so'rovda nechta yozuv va ko'pi bilan nechta sahifa olinadi.
// Backend page_size uchun eng katta qiymat — 100 (kattasida VALIDATION_ERROR).
// 50 × 100 = har bo'lim uchun 5000 tagacha havola (sitemap limiti 50 000).
const PAGE_SIZE = 100
const MAX_PAGES = 50

// Xatoga chidamli sahifalash: API javob bermasa sitemap statik sahifalar
// bilan baribir yasaladi (Google/Yandex bo'sh javob olmasin).
async function collect(fetcher) {
    const items = []
    for (let page = 1; page <= MAX_PAGES; page += 1) {
        let data
        try {
            data = await fetcher({ page, page_size: PAGE_SIZE })
        } catch {
            break
        }
        const chunk = data?.items || []
        items.push(...chunk)
        const pages = data?.meta?.pages || 1
        if (chunk.length < PAGE_SIZE || page >= pages) break
    }
    return items
}

// Havolalar katalog kartochkalaridagi kabi `slug` bo'yicha quriladi
// (adapters.js: `slug: item.slug || item.id`).
function entries(list, prefix, priority, now) {
    return list
        .filter((i) => i?.slug || i?.id)
        .map((i) => ({
            url: `${SITE.url}${prefix}/${i.slug || i.id}`,
            lastModified: i.updated_at ? new Date(i.updated_at) : now,
            changeFrequency: 'weekly',
            priority,
        }))
}

export default async function sitemap() {
    const now = new Date()
    const base = SITE.url

    // PAGE_SEO'da ro'yxat va detal sahifalari bir xil `path` ni baham ko'radi
    // (masalan `models` va `modelDetail` — ikkalasi ham `/models`), shuning
    // uchun manzillar bo'yicha takrorlar olib tashlanadi.
    const staticPaths = [
        ...new Set(
            Object.values(PAGE_SEO)
                .filter((p) => !p.noindex && p.path)
                .map((p) => p.path),
        ),
    ]

    const staticEntries = staticPaths.map((path) => ({
        url: `${base}${path}`,
        lastModified: now,
        changeFrequency: path === '/' ? 'daily' : 'weekly',
        priority: path === '/' ? 1 : 0.7,
    }))

    const [models, photographers, videographers, venues, projects, agencies] =
        await Promise.all([
            collect((p) => site.performers({ ...p, specialty: 'model' })),
            collect((p) => site.performers({ ...p, specialty: 'photographer' })),
            collect((p) => site.performers({ ...p, specialty: 'videographer' })),
            collect((p) => site.venues(p)),
            collect((p) => site.projects(p)),
            collect((p) => site.agencies(p)),
        ])

    return [
        ...staticEntries,
        ...entries(models, '/models', 0.8, now),
        ...entries(photographers, '/photographers', 0.8, now),
        ...entries(videographers, '/videographers', 0.8, now),
        ...entries(venues, '/venues', 0.8, now),
        ...entries(projects, '/projects', 0.7, now),
        ...entries(agencies, '/agencies', 0.6, now),
    ]
}

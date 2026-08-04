import { SITE, PAGE_SEO } from '@/lib/seo'
import { getData } from '@/lib/getData'

export const revalidate = 3600

// Xatoga chidamli: API javob bermasa ham sitemap statik sahifalar bilan yasaladi.
async function safeList(endpoint, params) {
    try {
        const { data } = await getData(endpoint, params)
        return Array.isArray(data) ? data : []
    } catch {
        return []
    }
}

export default async function sitemap() {
    const now = new Date()
    const base = SITE.url

    const staticEntries = Object.values(PAGE_SEO)
        .filter((p) => !p.noindex && p.path)
        .map((p) => ({
            url: `${base}${p.path}`,
            lastModified: now,
            changeFrequency: p.path === '/' ? 'daily' : 'weekly',
            priority: p.path === '/' ? 1 : 0.7,
        }))

    const [models, photographers, videographers, venues, projects, agencies] =
        await Promise.all([
            safeList('/executors/', { type: 'model', limit: 500 }),
            safeList('/executors/', { type: 'photographer', limit: 500 }),
            safeList('/executors/', { type: 'videographer', limit: 500 }),
            safeList('/venues/', { limit: 500 }),
            safeList('/projects/', { limit: 500 }),
            safeList('/agencies/', { limit: 500 }),
        ])

    function entries(list, prefix, priority) {
        return list
            .filter((i) => i?.slug)
            .map((i) => ({
                url: `${base}${prefix}/${i.slug}`,
                lastModified: i.updatedAt ? new Date(i.updatedAt) : now,
                changeFrequency: 'weekly',
                priority,
            }))
    }

    return [
        ...staticEntries,
        ...entries(models, '/models', 0.8),
        ...entries(photographers, '/photographers', 0.8),
        ...entries(videographers, '/videographers', 0.8),
        ...entries(venues, '/venues', 0.8),
        ...entries(projects, '/projects', 0.7),
        ...entries(agencies, '/agencies', 0.6),
    ]
}

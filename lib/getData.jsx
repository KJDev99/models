import { api, apiToken } from '@/lib/axios'

// DRF uslubidagi {count, next, previous, results} javobini bir xil shaklga keltiradi.
function normalize(raw) {
    if (raw && typeof raw === 'object' && 'results' in raw) {
        return {
            data: raw.results,
            pagination: {
                count: raw.count ?? null,
                next: raw.next ?? null,
                previous: raw.previous ?? null,
            },
        }
    }
    return { data: raw, pagination: null }
}

// Ochiq (tokensiz) GET — katalog, sahifalar, profil ko'rinishlari.
export async function getData(endpoint, params = {}) {
    const res = await api.get(endpoint, { params })
    return normalize(res.data)
}

// Token bilan GET — kabinet va admin ma'lumotlari.
export async function getDataToken(endpoint, params = {}) {
    const res = await apiToken.get(endpoint, { params })
    return normalize(res.data)
}

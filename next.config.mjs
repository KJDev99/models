/** @type {import('next').NextConfig} */

// Backendning haqiqiy manzili. Brauzer so'rovlari `/api/v1/...` ga ketadi va
// Next server ularni shu manzilga uzatadi — shunda CORS umuman kerak emas
// (backend hozir `localhost` origin'ini rad etadi, qarang backend-report.md).
const API_ORIGIN = process.env.API_ORIGIN || 'https://admin.modelworkrf.ru'

const nextConfig = {
    images: {
        // Next 16 da `quality` faqat shu ro'yxatdagi qiymatlardan bo'lishi
        // mumkin (standart — faqat `[75]`).
        //   75 — oddiy kartochkalar (rasm CSS o'lchamiga teng eksport qilingan);
        //   90 — bosh sahifadagi plitkalar va banner;
        //   95 — butun ekranni egallaydigan qahramon slayderi.
        // Sabab: 1920×1080 fon q75 da 22 KB WebP ga siqilar edi — qorong'i
        // joylarda kvadratlar chiqib, keng monitorda «sovunlangan» ko'rinardi
        // (mijoz izohi 30.08). q95 da o'sha rasm 78 KB.
        qualities: [75, 90, 95],
        // Backend media va test ma'lumotlaridagi tashqi rasmlar.
        remotePatterns: [
            { protocol: 'https', hostname: 'admin.agunastroy.ru' },
            { protocol: 'https', hostname: 'admin.basemodels.ru' },
            { protocol: 'https', hostname: 'picsum.photos' },
            { protocol: 'https', hostname: 'fastly.picsum.photos' },
            { protocol: 'https', hostname: 'images.unsplash.com' },
        ],
    },

    async rewrites() {
        return [
            { source: '/api/v1/:path*', destination: `${API_ORIGIN}/api/v1/:path*` },
        ]
    },
}

export default nextConfig

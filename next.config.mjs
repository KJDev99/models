/** @type {import('next').NextConfig} */

// Backendning haqiqiy manzili. Brauzer so'rovlari `/api/v1/...` ga ketadi va
// Next server ularni shu manzilga uzatadi — shunda CORS umuman kerak emas
// (backend hozir `localhost` origin'ini rad etadi, qarang backend-report.md).
const API_ORIGIN = process.env.API_ORIGIN || 'https://admin.modelworkrf.ru'

const nextConfig = {
    images: {
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

import { SITE } from '@/lib/seo'

export default function robots() {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            // Shaxsiy bo'limlar qidiruvga tushmasin.
            disallow: [
                '/auth',
                '/client',
                '/company',
                '/executor',
                '/agency',
                '/admin',
                '/favorites',
                '/notifications',
                '/chat',
            ],
        },
        sitemap: `${SITE.url}/sitemap.xml`,
        host: SITE.url,
    }
}

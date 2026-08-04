import { Montserrat } from 'next/font/google'
import './globals.css'
import { SITE } from '@/lib/seo'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import Providers from '@/components/layout/providers'

// Figma: matn shrifti — Montserrat (Regular / Medium / SemiBold).
// Sarlavhalar Helvetica Neue — tizim shrifti, globals.css'da --font-display.
const montserrat = Montserrat({
    variable: '--font-montserrat',
    subsets: ['latin', 'cyrillic'],
    weight: ['400', '500', '600'],
    display: 'swap',
})

export const metadata = {
    metadataBase: new URL(SITE.url),
    title: {
        default: 'База моделей — модели, фотографы, видеографы и площадки для съёмок',
        template: '%s',
    },
    description:
        'Каталог моделей, фотографов, видеографов, съёмочных площадок и проектов. Найдите исполнителя или получите заказ.',
    icons: {
        icon: '/favicon.svg',
        shortcut: '/favicon.svg',
        apple: '/favicon.svg',
    },
}

export default function RootLayout({ children }) {
    return (
        <html lang="ru" className={`${montserrat.variable} h-full antialiased`}>
            <body className="flex min-h-full flex-col overflow-x-clip bg-light-white">
                <Providers>
                    <Navbar />
                    <main className="flex-1">{children}</main>
                    <Footer />
                </Providers>
            </body>
        </html>
    )
}

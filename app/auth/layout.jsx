import Link from 'next/link'

// Auth ekranlari alohida markazlashtirilgan karkasda ochiladi —
// navbar va footer bu bo'limda ko'rinmaydi (Figma: ВХОД 75:171).
export const metadata = {
    title: 'Вход и регистрация | База моделей',
    robots: { index: false, follow: false },
}

export default function AuthLayout({ children }) {
    return (
        <div className="flex min-h-[calc(100vh-64px)] flex-col bg-light-white lg:min-h-screen">
            <header className="flex items-center justify-between px-4 py-6 lg:px-10">
                <Link href="/" className="text-xl font-medium text-black lg:text-2xl">
                    База&nbsp;моделей
                </Link>
                <Link href="/" className="text-base text-grey transition-colors hover:text-black">
                    На главную
                </Link>
            </header>

            <div className="flex flex-1 items-center justify-center px-4 py-8 lg:py-14">
                {children}
            </div>
        </div>
    )
}

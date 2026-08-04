import Link from 'next/link'
import Container from '@/components/ui/container'

export const metadata = {
    title: 'Страница не найдена | База моделей',
    robots: { index: false, follow: false },
}

export default function NotFound() {
    return (
        <Container className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
            <p className="text-[80px] leading-none font-medium text-gold lg:text-[120px]">404</p>
            <h1 className="mt-4 text-[28px] font-medium text-black lg:text-[36px]">
                Такой страницы нет
            </h1>
            <p className="mt-3 max-w-[460px] text-base text-grey">
                Возможно, анкета была снята с публикации или ссылка устарела.
            </p>
            <Link
                href="/"
                className="mt-8 inline-flex h-12 items-center rounded-[12px] bg-gold px-8 text-base text-white transition-opacity hover:opacity-90"
            >
                На главную
            </Link>
        </Container>
    )
}

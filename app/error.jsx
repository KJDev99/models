'use client'

import Container from '@/components/ui/container'
import Button from '@/components/ui/button'

export default function GlobalError({ error, reset }) {
    return (
        <Container className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
            <h1 className="text-[28px] font-medium text-black lg:text-[36px]">Что-то пошло не так</h1>
            <p className="mt-3 max-w-[460px] text-base text-grey">
                Попробуйте обновить страницу. Если ошибка повторяется — напишите нам.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button onClick={() => reset()}>Обновить</Button>
                <Button href="/contacts" variant="whiteStroke">
                    Написать в поддержку
                </Button>
            </div>
        </Container>
    )
}

'use client'

import React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuthModalStore } from '@/store/useAuthModalStore'
import { ERROR_CODES } from '@/lib/api-error'

// Backend xato bo'lsa `/auth/oauth/error?code=OAUTH_FAILED` ga qaytaradi.
const MESSAGES = {
    [ERROR_CODES.OAUTH_FAILED]: 'Не удалось войти через соцсеть. Попробуйте ещё раз.',
    [ERROR_CODES.OAUTH_NOT_CONFIGURED]: 'Этот способ входа временно недоступен.',
}

export default function OauthError() {
    const router = useRouter()
    const params = useSearchParams()
    const openAuth = useAuthModalStore((s) => s.openAuth)

    const code = params.get('code') || ERROR_CODES.OAUTH_FAILED
    const message = MESSAGES[code] || MESSAGES[ERROR_CODES.OAUTH_FAILED]

    return (
        <div className="flex w-full max-w-[550px] flex-col gap-[16px] rounded-[6px] bg-white p-[12px] text-center lg:gap-[24px] lg:p-[24px]">
            <h1 className="font-display text-[24px] leading-[28px] text-black uppercase lg:text-[36px] lg:leading-[44px]">
                Ошибка входа
            </h1>

            <p className="text-[14px] text-grey lg:text-[16px]">{message}</p>

            <div className="flex flex-col gap-[12px] lg:gap-[16px]">
                <button
                    type="button"
                    onClick={() => {
                        router.replace('/')
                        openAuth('role')
                    }}
                    className="ui-shine relative flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-[6px] bg-gold px-[24px] py-[12px] text-[14px] font-medium text-white transition-colors hover:bg-[#c19754] lg:py-[16px] lg:text-[18px]"
                >
                    <span className="relative">Попробовать снова</span>
                </button>

                <button
                    type="button"
                    onClick={() => router.replace('/')}
                    className="flex w-full cursor-pointer items-center justify-center rounded-[6px] bg-gold/15 px-[24px] py-[12px] text-[14px] font-medium text-gold transition-colors hover:bg-gold/25 lg:py-[16px] lg:text-[18px]"
                >
                    На главную
                </button>
            </div>
        </div>
    )
}

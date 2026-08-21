'use client'

import React from 'react'
import Container from '@/components/ui/container'
import Breadcrumb from '@/components/ui/breadcrumb'

// ─────────────────────────────────────────────────────────────────────────────
// Kartochka sahifalarining yuklanish va xato holati.
// Sahifa karkasi (fon, non ushlagich, chetlar) o'zgarmaydi — faqat kontent
// o'rnida kulrang joy egallovchi yoki xato matni turadi.
// ─────────────────────────────────────────────────────────────────────────────
export default function DetailState({ loading, error, onRetry, breadcrumb = [] }) {
    return (
        <div className="flex flex-col gap-[24px] bg-light-white pt-[16px] pb-[40px] lg:gap-[50px] lg:pt-[24px] lg:pb-[100px]">
            <Container className="flex flex-col gap-[16px] lg:gap-[24px]">
                <Breadcrumb items={breadcrumb} />

                {loading ? (
                    <div className="flex flex-col gap-[16px] lg:flex-row lg:gap-[16px]">
                        <div className="h-[400px] w-full animate-pulse rounded-[6px] bg-black/5 lg:h-[600px] lg:w-[554px] lg:shrink-0" />
                        <div className="h-[400px] min-w-0 flex-1 animate-pulse rounded-[6px] bg-black/5 lg:h-[600px]" />
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-[12px] rounded-[6px] bg-white p-[40px] text-center">
                        <p className="text-[16px] font-medium text-black lg:text-[18px]">
                            {error?.status === 404 ? 'Страница не найдена' : 'Не удалось загрузить'}
                        </p>
                        <p className="text-[14px] text-grey lg:text-[16px]">
                            {error?.message || 'Попробуйте обновить страницу.'}
                        </p>
                        {onRetry && (
                            <button
                                type="button"
                                onClick={onRetry}
                                className="mt-[4px] cursor-pointer rounded-[6px] bg-gold/15 px-[24px] py-[12px] text-[14px] font-medium text-gold transition-colors hover:bg-gold/25 lg:text-[16px]"
                            >
                                Повторить
                            </button>
                        )}
                    </div>
                )}
            </Container>
        </div>
    )
}

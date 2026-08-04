'use client'

import React, { useEffect } from 'react'
import { FiX } from 'react-icons/fi'

// Figma'dagi barcha modallar uchun asos: Требуется вход, Пригласить в проект,
// Забронировать, Откликнуться, Пожаловаться, Удалить аккаунт va h.k.
export default function Modal({
    open,
    onClose,
    title,
    description,
    children,
    footer,
    width = 'max-w-[560px]',
}) {
    useEffect(() => {
        if (!open) return
        document.body.style.overflow = 'hidden'
        function onKey(e) {
            if (e.key === 'Escape') onClose?.()
        }
        document.addEventListener('keydown', onKey)
        return () => {
            document.body.style.overflow = ''
            document.removeEventListener('keydown', onKey)
        }
    }, [open, onClose])

    if (!open) return null

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px]"
            onClick={onClose}
        >
            <div
                className={`custom-scrollbar max-h-[90vh] w-full ${width} overflow-y-auto rounded-[16px] bg-white p-6 lg:p-8`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="mb-4 flex items-start justify-between gap-4">
                    <div>
                        {title && (
                            <h2 className="text-2xl font-medium text-black lg:text-[28px]">
                                {title}
                            </h2>
                        )}
                        {description && (
                            <p className="mt-2 text-base text-grey">{description}</p>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="-mr-2 -mt-2 shrink-0 p-2 text-grey transition-colors hover:text-black"
                        aria-label="Закрыть"
                    >
                        <FiX size={24} />
                    </button>
                </div>

                {children}

                {footer && <div className="mt-6 flex flex-wrap gap-3">{footer}</div>}
            </div>
        </div>
    )
}

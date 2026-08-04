'use client'

import React from 'react'
import { FaGoogle, FaTelegram, FaVk, FaYandex } from 'react-icons/fa6'

// Figma: "Выберите сервис для входа" (85:2756).
const SERVICES = [
    { key: 'yandex', label: 'Яндекс', Icon: FaYandex },
    { key: 'vk', label: 'VK', Icon: FaVk },
    { key: 'google', label: 'Google', Icon: FaGoogle },
    { key: 'telegram', label: 'Telegram', Icon: FaTelegram },
]

export default function SocialButtons({ onSelect }) {
    return (
        <div className="grid gap-3 sm:grid-cols-2">
            {SERVICES.map(({ key, label, Icon }) => (
                <button
                    key={key}
                    type="button"
                    onClick={() => onSelect?.(key)}
                    className="flex h-12 items-center justify-center gap-3 rounded-[12px] border border-black/15 text-base text-black transition-colors hover:border-gold hover:text-gold"
                >
                    <Icon size={18} />
                    {label}
                </button>
            ))}
        </div>
    )
}

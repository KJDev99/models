'use client'

import React from 'react'
import { FiHeart } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { useFavoritesStore } from '@/store/useFavoritesStore'

// Kartochkalar va profil sahifalaridagi yurakcha (Figma: Избранное 173:4067).
export default function FavoriteButton({ item, className = '', size = 20 }) {
    const toggle = useFavoritesStore((s) => s.toggle)
    const items = useFavoritesStore((s) => s.items)
    const active = items.some((i) => i.type === item.type && i.id === item.id)

    async function onClick(e) {
        e.preventDefault()
        e.stopPropagation()
        const added = await toggle(item)
        toast(added ? 'Добавлено в избранное' : 'Удалено из избранного')
    }

    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={active ? 'Убрать из избранного' : 'В избранное'}
            className={`flex h-10 w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur transition-colors hover:bg-white ${className}`}
        >
            <FiHeart
                size={size}
                className={active ? 'fill-gold text-gold' : 'text-black/60'}
            />
        </button>
    )
}

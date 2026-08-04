'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi'

// Portfolio / площадка fotolari uchun lightbox'li galereya.
export default function Gallery({ photos = [], className = '' }) {
    const [index, setIndex] = useState(null)

    if (!photos.length) {
        return (
            <div className="rounded-[16px] border border-dashed border-black/15 bg-light-white px-6 py-12 text-center text-base text-grey">
                Фотографий пока нет
            </div>
        )
    }

    const close = () => setIndex(null)
    const prev = () => setIndex((i) => (i > 0 ? i - 1 : photos.length - 1))
    const next = () => setIndex((i) => (i < photos.length - 1 ? i + 1 : 0))

    return (
        <>
            <div className={`grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4 ${className}`}>
                {photos.map((photo, i) => (
                    <button
                        key={photo.id || photo.url}
                        type="button"
                        onClick={() => setIndex(i)}
                        className="relative aspect-[3/4] overflow-hidden rounded-[12px] bg-light-white"
                    >
                        <Image
                            src={photo.url}
                            alt={photo.alt || ''}
                            fill
                            sizes="(max-width: 1024px) 50vw, 25vw"
                            className="object-cover transition-transform duration-300 hover:scale-[1.04]"
                        />
                    </button>
                ))}
            </div>

            {index != null && (
                <div
                    className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 p-4"
                    onClick={close}
                >
                    <button
                        type="button"
                        onClick={close}
                        className="absolute right-5 top-5 p-2 text-white/80 hover:text-white"
                        aria-label="Закрыть"
                    >
                        <FiX size={28} />
                    </button>

                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation()
                            prev()
                        }}
                        className="absolute left-4 p-3 text-white/80 hover:text-white"
                        aria-label="Предыдущее фото"
                    >
                        <FiChevronLeft size={32} />
                    </button>

                    <div
                        className="relative h-[80vh] w-full max-w-[900px]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Image
                            src={photos[index].url}
                            alt=""
                            fill
                            sizes="900px"
                            className="object-contain"
                        />
                    </div>

                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation()
                            next()
                        }}
                        className="absolute right-4 p-3 text-white/80 hover:text-white"
                        aria-label="Следующее фото"
                    >
                        <FiChevronRight size={32} />
                    </button>
                </div>
            )}
        </>
    )
}

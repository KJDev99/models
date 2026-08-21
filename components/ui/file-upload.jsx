'use client'

import React, { useRef } from 'react'
import Image from 'next/image'
import { FiPlus, FiX } from 'react-icons/fi'

// Portfolio va "Фотографии площадки" (229:6503) uchun rasm yuklash to'ri.
// files: [{ id, url }] — yuklangan rasmlar; onAdd(FileList), onRemove(id).
export default function FileUpload({
    files = [],
    onAdd,
    onRemove,
    max = 20,
    accept = 'image/*',
    label = 'Загрузите фотографии',
    hint = 'JPG или PNG, до 10 МБ. Минимум 3 фото.',
}) {
    const inputRef = useRef(null)
    const canAdd = files.length < max

    return (
        <div className="flex flex-col gap-3">
            {label && (
                <div className="flex items-center justify-between">
                    <span className="text-sm text-grey">{label}</span>
                    <span className="text-sm text-grey/70">
                        {files.length}/{max}
                    </span>
                </div>
            )}

            <div className="grid grid-cols-3 gap-3 lg:grid-cols-5">
                {files.map((file) => (
                    <div
                        key={file.id || file.url}
                        className="relative aspect-[3/4] overflow-hidden rounded-[12px] bg-light-white"
                    >
                        <Image
                            src={file.url}
                            alt=""
                            fill
                            sizes="(max-width: 1024px) 33vw, 20vw"
                            className="object-cover"
                        />
                        <button
                            type="button"
                            onClick={() => onRemove?.(file.id || file.url)}
                            className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-danger"
                            aria-label="Удалить фото"
                        >
                            <FiX size={14} />
                        </button>
                    </div>
                ))}

                {canAdd && (
                    <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        className="flex aspect-[3/4] flex-col items-center justify-center gap-2 rounded-[12px] border border-dashed border-black/20 bg-light-white text-grey transition-colors hover:border-gold hover:text-gold"
                    >
                        <FiPlus size={24} />
                        <span className="text-sm">Добавить</span>
                    </button>
                )}
            </div>

            {hint && <p className="text-sm text-grey/80">{hint}</p>}

            <input
                ref={inputRef}
                type="file"
                accept={accept}
                multiple
                hidden
                onChange={(e) => {
                    // `input.value` ni tozalash `files` ni ham bo'shatadi —
                    // shuning uchun avval massivga ko'chiramiz.
                    const files = Array.from(e.target.files || [])
                    e.target.value = ''
                    if (files.length) onAdd?.(files)
                }}
            />
        </div>
    )
}

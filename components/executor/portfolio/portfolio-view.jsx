'use client'

import React, { useCallback, useState } from 'react'
import toast from 'react-hot-toast'
import Card from '@/components/ui/card'
import FileUpload from '@/components/ui/file-upload'
import Spinner from '@/components/ui/spinner'
import { useApi, useAction } from '@/lib/use-api'
import * as performerApi from '@/lib/api/performer'
import * as site from '@/lib/api/site'

// ─────────────────────────────────────────────────────────────────────────────
// «Портфолио» — Figma 265:13865.
//
// Rasm ikki qadamda qo'shiladi (backend/performer.md):
//   1) POST /site/upload            → { url }
//   2) POST /performer/portfolio    → { url, album }
// O'chirish: DELETE /performer/portfolio/{media_id}.
//
// Ro'yxat `GET /performer/cabinet` → `media` dan olinadi:
// `GET /performer/portfolio` hozir 500 qaytaradi (backend hisoboti, 20-band).
// Backend tuzatilgach `performerApi.portfolio()` ga qaytarish kifoya.
// ─────────────────────────────────────────────────────────────────────────────
export default function ExecutorPortfolio() {
    const fetcher = useCallback(() => performerApi.cabinet(), [])
    const { data, loading, error, reload } = useApi(fetcher)

    const upload = useAction(site.upload)
    const addPortfolio = useAction(performerApi.addPortfolio)
    const removeMedia = useAction(performerApi.deletePortfolio)

    const [busy, setBusy] = useState(false)

    // Kabinet javobida `media` — barcha portfolio kadrlari.
    const photos = (data?.media || [])
        .filter((m) => m?.url)
        .map((m) => ({ id: m.id, url: m.url }))

    async function addPhotos(fileList) {
        const files = Array.from(fileList || [])
        if (!files.length) return

        setBusy(true)
        let ok = 0
        for (const file of files) {
            const uploaded = await upload.run(file)
            if (!uploaded.success) {
                toast.error(uploaded.error.message)
                continue
            }
            const url = uploaded.data?.url
            if (!url) continue
            const saved = await addPortfolio.run({ url })
            if (!saved.success) {
                toast.error(saved.error.message)
                continue
            }
            ok += 1
        }
        setBusy(false)

        if (ok) {
            toast.success(ok === 1 ? 'Фото загружено' : `Загружено фото: ${ok}`)
            reload()
        }
    }

    async function removePhoto(id) {
        const res = await removeMedia.run(id)
        if (!res.success) {
            toast.error(res.error.message)
            return
        }
        toast.success('Фото удалено')
        reload()
    }

    if (loading) {
        return (
            <div className="flex min-h-[40vh] items-center justify-center">
                <Spinner size={32} />
            </div>
        )
    }

    return (
        <Card title="Портфолио">
            {error ? (
                <p className="text-base text-grey">{error.message}</p>
            ) : (
                <FileUpload
                    files={photos}
                    onAdd={addPhotos}
                    onRemove={removePhoto}
                    max={30}
                    hint={
                        busy
                            ? 'Загружаем…'
                            : 'JPG или PNG, до 10 МБ. Первая фотография — обложка анкеты.'
                    }
                />
            )}
        </Card>
    )
}

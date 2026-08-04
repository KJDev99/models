'use client'

import React, { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Card from '@/components/ui/card'
import FileUpload from '@/components/ui/file-upload'
import Spinner from '@/components/ui/spinner'
import { useApiStore } from '@/store/useApiStore'

// Figma: Портфолио (265:13865).
export default function ExecutorPortfolio() {
    const getDataToken = useApiStore((s) => s.getDataToken)
    const postFormDataToken = useApiStore((s) => s.postFormDataToken)
    const deleteDataToken = useApiStore((s) => s.deleteDataToken)

    const [photos, setPhotos] = useState([])
    const [loading, setLoading] = useState(true)

    // setState `.then()` ichida chaqiriladi — effekt tanasida sinxron
    // holat o'zgartirish React Compiler qoidalarini buzadi.
    const load = useCallback(() => {
        getDataToken('/executors/mine/photos/').then((res) => {
            const raw = res.data
            setPhotos(raw?.results || raw?.data || raw || [])
            setLoading(false)
        })
    }, [getDataToken])

    useEffect(() => {
        load()
    }, [load])

    async function addPhotos(fileList) {
        const files = Array.from(fileList || [])
        const fd = new FormData()
        files.forEach((f) => fd.append('photos', f))
        const res = await postFormDataToken('/executors/mine/photos/', fd)
        if (res.success) {
            toast.success('Фото загружены')
            load()
        } else {
            toast.error('Не удалось загрузить фото')
        }
    }

    async function removePhoto(id) {
        const res = await deleteDataToken(`/executors/mine/photos/${id}/`)
        if (res.success) {
            setPhotos((p) => p.filter((f) => f.id !== id))
        } else {
            toast.error('Не удалось удалить фото')
        }
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
            <FileUpload
                files={photos}
                onAdd={addPhotos}
                onRemove={removePhoto}
                max={30}
                hint="JPG или PNG, до 10 МБ. Первая фотография — обложка анкеты."
            />
        </Card>
    )
}

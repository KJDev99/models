'use client'

import { useEffect, useState } from 'react'
import { getDictionaries, loadDictionaries, subscribe } from '@/lib/dictionaries'

export { withDictionary, dictLabel, dictLabels } from '@/lib/dictionaries'

// Lug'at kesh modul darajasida (`lib/dictionaries.js`), shuning uchun hook
// faqat unga obuna bo'ladi: nechta katalog ochilsa ham so'rov bitta.
export function useDictionaries() {
    const [data, setData] = useState(getDictionaries)

    useEffect(() => {
        const unsubscribe = subscribe(setData)
        loadDictionaries()
        return unsubscribe
    }, [])

    return data
}

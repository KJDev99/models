import React from 'react'
import { statusMeta } from '@/lib/statuses'
import Badge from '@/components/ui/badge'

// Anketa / proyekt / maydoncha holati — lib/statuses.js jadvalidan.
export default function StatusBadge({ status }) {
    const meta = statusMeta(status)
    return <Badge className={meta.className}>{meta.label}</Badge>
}

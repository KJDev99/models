'use client'

import React from 'react'

// Figma: "Возраст" filtri (360:21739) — dan / gacha juftligi.
export default function RangeInput({ label, from, to, onChange, suffix, min, max }) {
    return (
        <div className="flex flex-col gap-2">
            {label && <span className="text-sm text-grey">{label}</span>}
            <div className="flex items-center gap-3">
                <input
                    type="number"
                    value={from ?? ''}
                    min={min}
                    max={max}
                    placeholder="от"
                    onChange={(e) =>
                        onChange?.({ from: e.target.value === '' ? null : Number(e.target.value), to })
                    }
                    className="h-12 w-full rounded-[12px] border border-black/15 bg-white px-4 text-base outline-none focus:border-gold"
                />
                <span className="text-grey">—</span>
                <input
                    type="number"
                    value={to ?? ''}
                    min={min}
                    max={max}
                    placeholder="до"
                    onChange={(e) =>
                        onChange?.({ from, to: e.target.value === '' ? null : Number(e.target.value) })
                    }
                    className="h-12 w-full rounded-[12px] border border-black/15 bg-white px-4 text-base outline-none focus:border-gold"
                />
                {suffix && <span className="shrink-0 text-sm text-grey">{suffix}</span>}
            </div>
        </div>
    )
}

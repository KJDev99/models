import React from 'react'

// Admin dashboard (Figma: Дашборд 321:12629) raqamli kartochkalari.
export default function StatTile({ label, value, hint, icon }) {
    return (
        <div className="rounded-[16px] border border-black/8 bg-white p-5 lg:p-6">
            <div className="flex items-start justify-between gap-3">
                <span className="text-sm text-grey">{label}</span>
                {icon && <span className="text-gold">{icon}</span>}
            </div>
            <p className="mt-3 text-[32px] leading-none font-medium text-black">{value}</p>
            {hint && <p className="mt-2 text-sm text-grey">{hint}</p>}
        </div>
    )
}

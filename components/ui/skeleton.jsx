import React from 'react'

export function Skeleton({ className = '' }) {
    return <div className={`animate-pulse rounded-[12px] bg-light-white ${className}`} />
}

// Katalog kartochkalari uchun tayyor to'r.
export function SkeletonGrid({ count = 8, className = '' }) {
    return (
        <div
            className={`grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-6 ${className}`}
        >
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="overflow-hidden rounded-[16px] border border-black/8 bg-white">
                    <Skeleton className="aspect-[3/4] rounded-none" />
                    <div className="space-y-2 p-4">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                </div>
            ))}
        </div>
    )
}

// Kabinet jadvallari uchun.
export function SkeletonRows({ count = 6 }) {
    return (
        <div className="space-y-3">
            {Array.from({ length: count }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
            ))}
        </div>
    )
}

export default Skeleton

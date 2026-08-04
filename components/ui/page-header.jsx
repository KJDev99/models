import React from 'react'
import Breadcrumb from '@/components/ui/breadcrumb'

// Ichki sahifalarning yuqori qismi: breadcrumb + h1 + o'ng tomondagi amal.
export default function PageHeader({ breadcrumb, title, count, description, action }) {
    return (
        <header className="mb-6 lg:mb-8">
            {breadcrumb?.length > 0 && (
                <div className="mb-4">
                    <Breadcrumb items={breadcrumb} />
                </div>
            )}
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <h1 className="text-[32px] leading-tight font-medium text-black lg:text-[48px]">
                        {title}
                        {count != null && (
                            <span className="ml-3 align-middle text-xl text-grey lg:text-2xl">
                                {count}
                            </span>
                        )}
                    </h1>
                    {description && (
                        <p className="mt-3 max-w-[720px] text-base text-grey">{description}</p>
                    )}
                </div>
                {action}
            </div>
        </header>
    )
}

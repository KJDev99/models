'use client'

import React from 'react'
import Container from '@/components/ui/container'
import Breadcrumb from '@/components/ui/breadcrumb'
import CabinetSidebar from '@/components/cabinet/cabinet-sidebar'

// Barcha rollarning kabineti bir xil karkasda: chapda menyu, o'ngda kontent
// (genius loyihasidagi ProfileLayout / SupplierLayout bilan bir xil g'oya).
export default function CabinetLayout({ role, title, breadcrumb, action, children }) {
    return (
        <Container className="my-8 lg:my-12">
            {breadcrumb?.length > 0 && (
                <div className="mb-6">
                    <Breadcrumb items={breadcrumb} />
                </div>
            )}

            <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
                <aside className="shrink-0 lg:w-[300px]">
                    <CabinetSidebar role={role} />
                </aside>

                <div className="min-w-0 flex-1">
                    {(title || action) && (
                        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                            {title && (
                                <h1 className="text-[28px] leading-tight font-medium text-black lg:text-[36px]">
                                    {title}
                                </h1>
                            )}
                            {action}
                        </div>
                    )}
                    {children}
                </div>
            </div>
        </Container>
    )
}

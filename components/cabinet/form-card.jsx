'use client'

import React from 'react'
import Card from '@/components/ui/card'
import Button from '@/components/ui/button'

// Kabinet formalari uchun umumiy o'ram: sarlavha, maydonlar, saqlash tugmasi.
export default function FormCard({
    title,
    description,
    children,
    onSubmit,
    submitText = 'Сохранить',
    submitVariant = 'gold',
    loading,
    secondary,
    className = '',
}) {
    function handleSubmit(e) {
        e.preventDefault()
        onSubmit?.(e)
    }

    return (
        <Card title={title} className={className}>
            {description && <p className="-mt-2 mb-6 text-base text-grey">{description}</p>}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {children}

                <div className="mt-2 flex flex-wrap gap-3">
                    <Button type="submit" variant={submitVariant} loading={loading}>
                        {submitText}
                    </Button>
                    {secondary}
                </div>
            </form>
        </Card>
    )
}

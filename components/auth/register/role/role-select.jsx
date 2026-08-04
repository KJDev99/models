'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import AuthCard from '@/components/auth/auth-card'
import Button from '@/components/ui/button'
import { ROLES, ROLE_META, SELECTABLE_ROLES, homeForRole } from '@/lib/roles'
import { useAuthStore } from '@/store/useAuthStore'

// Figma: "Знакомство" (390:21023) + rol kartochkalari
// Заказчик (345:18920) / Исполнитель (345:18940) / Агентство (345:19007).
export default function RoleSelect() {
    const router = useRouter()
    const chooseRole = useAuthStore((s) => s.chooseRole)
    const loading = useAuthStore((s) => s.loading)
    const [role, setRole] = useState(null)

    async function submit() {
        if (!role) {
            toast.error('Выберите роль')
            return
        }
        const res = await chooseRole(role)
        if (!res.success) {
            toast.error('Не удалось сохранить роль')
            return
        }
        // Агентство uchun qo'shimcha ma'lumot so'raladi.
        if (role === ROLES.AGENCY) {
            router.push('/auth/register/agency')
            return
        }
        router.push(homeForRole(role))
    }

    return (
        <AuthCard
            title="Знакомство"
            description="Кем вы будете на платформе? Роль можно изменить позже в настройках."
        >
            <div className="flex flex-col gap-3">
                {SELECTABLE_ROLES.map((key) => {
                    const meta = ROLE_META[key]
                    const active = role === key
                    return (
                        <button
                            key={key}
                            type="button"
                            onClick={() => setRole(key)}
                            className={`rounded-[16px] border p-5 text-left transition-colors duration-150 ${
                                active ? 'border-gold bg-gold/5' : 'border-black/12 hover:border-gold/60'
                            }`}
                        >
                            <p className="text-lg text-black">{meta.label}</p>
                            <p className="mt-1 text-sm text-grey">{meta.sublabel}</p>
                            <p className="mt-2 text-base text-grey">{meta.description}</p>
                        </button>
                    )
                })}
            </div>

            <Button onClick={submit} loading={loading} className="mt-6" full>
                Продолжить
            </Button>
        </AuthCard>
    )
}

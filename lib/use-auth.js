'use client'

import { useEffect, useState } from 'react'
import { getUser, isAuthenticated } from '@/lib/auth'

// Joriy sessiyani reaktiv o'qish. `auth-changed` (shu tab) va `storage`
// (boshqa tab) hodisalarida qayta o'qiydi.
//
// `ready` — SSR/gidratatsiya tugaganini bildiradi. Guard'lar `ready` bo'lmaguncha
// redirect qilmasligi kerak, aks holda sahifa bir zumda login'ga sakraydi.
export function useAuth() {
    const [state, setState] = useState({ user: null, authed: false, ready: false })

    useEffect(() => {
        function read() {
            setState({ user: getUser(), authed: isAuthenticated(), ready: true })
        }
        read()
        window.addEventListener('auth-changed', read)
        window.addEventListener('storage', read)
        return () => {
            window.removeEventListener('auth-changed', read)
            window.removeEventListener('storage', read)
        }
    }, [])

    return { ...state, role: state.user?.role || null }
}

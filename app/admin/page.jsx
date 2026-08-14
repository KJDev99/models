import { redirect } from 'next/navigation'

// `/admin` — bo'limning ildizi. Adminka boshqaruv panelidan boshlanadi.
export default function AdminRootPage() {
    redirect('/admin/dashboard')
}

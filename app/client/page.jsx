import { redirect } from 'next/navigation'

// `/client` — bo'limning ildizi. Kabinet boshqaruv sahifasidan boshlanadi
// (`ROLE_META.client.home`, lib/roles.js).
export default function ClientRootPage() {
    redirect('/client/dashboard')
}

import { redirect } from 'next/navigation'

// `/agency` — bo'limning ildizi. Kabinet boshqaruv sahifasidan boshlanadi
// (`ROLE_META.agency.home`, lib/roles.js).
export default function AgencyRootPage() {
    redirect('/agency/dashboard')
}

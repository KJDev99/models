import { redirect } from 'next/navigation'

// `/company` — bo'limning ildizi. Kabinet boshqaruv sahifasidan boshlanadi
// (`ROLE_META.company.home`, lib/roles.js).
export default function CompanyRootPage() {
    redirect('/company/dashboard')
}

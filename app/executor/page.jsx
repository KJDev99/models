import { redirect } from 'next/navigation'

// `/executor` — bo'limning ildizi. Kabinet boshqaruv sahifasidan boshlanadi
// (`ROLE_META.executor.home`, lib/roles.js).
export default function ExecutorRootPage() {
    redirect('/executor/dashboard')
}

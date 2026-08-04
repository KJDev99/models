import { pageMetadata } from '@/lib/seo'

// page.jsx 'use client' — metadata shu server layout'dan beriladi.
// (Bu layout /agencies va /agencies/[slug] ostidagi barchasini o'raydi.)
export const metadata = pageMetadata('agencies')

export default function AgenciesViewLayout({ children }) {
    return children
}

import { pageMetadata } from '@/lib/seo'

// page.jsx 'use client' — metadata shu server layout'dan beriladi.
// (Bu layout /photographers va /photographers/[slug] ostidagi barchasini o'raydi.)
export const metadata = pageMetadata('photographers')

export default function PhotographersViewLayout({ children }) {
    return children
}

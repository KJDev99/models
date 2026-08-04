import { pageMetadata } from '@/lib/seo'

// page.jsx 'use client' — metadata shu server layout'dan beriladi.
// (Bu layout /venues va /venues/[slug] ostidagi barchasini o'raydi.)
export const metadata = pageMetadata('venues')

export default function VenuesViewLayout({ children }) {
    return children
}

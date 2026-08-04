import { pageMetadata } from '@/lib/seo'

// page.jsx 'use client' — metadata shu server layout'dan beriladi.
// (Bu layout /videographers va /videographers/[slug] ostidagi barchasini o'raydi.)
export const metadata = pageMetadata('videographers')

export default function VideographersViewLayout({ children }) {
    return children
}

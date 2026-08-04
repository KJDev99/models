import { pageMetadata } from '@/lib/seo'

// page.jsx 'use client' — metadata shu server layout'dan beriladi.
// (Bu layout /models va /models/[slug] ostidagi barchasini o'raydi.)
export const metadata = pageMetadata('models')

export default function ModelsViewLayout({ children }) {
    return children
}

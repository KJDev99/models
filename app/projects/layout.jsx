import { pageMetadata } from '@/lib/seo'

// page.jsx 'use client' — metadata shu server layout'dan beriladi.
// (Bu layout /projects va /projects/[slug] ostidagi barchasini o'raydi.)
export const metadata = pageMetadata('projects')

export default function ProjectsViewLayout({ children }) {
    return children
}

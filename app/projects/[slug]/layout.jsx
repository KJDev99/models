import { projectMetadata } from '@/lib/seo'
import { getData } from '@/lib/getData'

export async function generateMetadata({ params }) {
    const { slug } = await params
    try {
        const { data } = await getData(`/projects/${slug}/`)
        return projectMetadata(data, slug)
    } catch {
        return projectMetadata(null, slug)
    }
}

export default function ProjectLayout({ children }) {
    return children
}

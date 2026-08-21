import { projectMetadata } from '@/lib/seo'
import * as site from '@/lib/api/site'
import { projectDetail } from '@/lib/adapters'

// Metadata backenddagi loyihadan yig'iladi (GET /site/projects/{id}).
export async function generateMetadata({ params }) {
    const { slug } = await params
    try {
        return projectMetadata(projectDetail(await site.project(slug)), slug)
    } catch {
        return projectMetadata(null, slug)
    }
}

export default function ProjectDetailLayout({ children }) {
    return children
}

import { agencyMetadata } from '@/lib/seo'
import * as site from '@/lib/api/site'
import { agencyDetail } from '@/lib/adapters'

// Metadata backenddagi agentlik profilidan yig'iladi (GET /site/agencies/{id}).
export async function generateMetadata({ params }) {
    const { slug } = await params
    try {
        return agencyMetadata(agencyDetail(await site.agency(slug)), slug)
    } catch {
        return agencyMetadata(null, slug)
    }
}

export default function AgencyDetailLayout({ children }) {
    return children
}

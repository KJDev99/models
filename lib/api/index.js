// Barcha endpointlar shu yerdan chiqadi. Komponentda:
//   import { site, customer } from '@/lib/api'
//   const data = await site.performers({ specialty: 'model' })
//
// Endpoint manzillari faqat shu papkadagi fayllarda turadi (AGENTS.md qoidasi).
export * as auth from '@/lib/api/auth'
export * as site from '@/lib/api/site'
export * as customer from '@/lib/api/customer'
export * as performer from '@/lib/api/performer'
export * as agency from '@/lib/api/agency'
export * as admin from '@/lib/api/admin'

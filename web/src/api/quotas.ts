import { useQuery } from '@tanstack/react-query'
import { fetchJSON } from './client'

// useNamespaceQuotas fetches a namespace's ResourceQuota objects via
// /api/resources/resourcequotas?namespace=<ns> (a bare array). Backs the
// NamespaceRenderer quota-usage section — quota saturation is otherwise
// surfaced nowhere in the UI, yet it's exactly why a namespace stops
// admitting new pods.
export function useNamespaceQuotas(namespace: string, enabled = true) {
  return useQuery<any[]>({
    queryKey: ['resourcequotas', namespace],
    queryFn: () => fetchJSON<any[]>(`/resources/resourcequotas?namespace=${encodeURIComponent(namespace)}`),
    enabled: enabled && !!namespace,
    staleTime: 15000,
  })
}

// useNamespaceLimitRanges fetches a namespace's LimitRange objects via
// /api/resources/limitranges?namespace=<ns> (a bare array). Backs the
// NamespaceRenderer rules section and the contextual link on Pod/workload
// details — the defaults and constraints applied at admission are otherwise
// only visible by reading the object.
export function useNamespaceLimitRanges(namespace: string, enabled = true) {
  return useQuery<any[]>({
    queryKey: ['limitranges', namespace],
    queryFn: () => fetchJSON<any[]>(`/resources/limitranges?namespace=${encodeURIComponent(namespace)}`),
    enabled: enabled && !!namespace,
    staleTime: 15000,
  })
}

/** Names of the LimitRanges a namespace lookup returned, for the contextual
 *  link. Empty while the read is pending or failed, so no link is shown. */
export function limitRangeNames(limitRanges: any[] | undefined): string[] {
  return (limitRanges ?? []).map((lr: any) => lr?.metadata?.name).filter(Boolean)
}

type AnalyticsPayload = {
  metrics: Array<{ department: string; label: string; count: number }>
  registeredStudents: Array<{ department: string; students: number }>
  violationPerDepartment: Array<{ department: string; violations: number; noViolations: number }>
  violationBreakdown: Array<{ name: string; value: number; fill: string }>
  topViolators: Array<{ studentId: string; name: string; department: string; count: number }>
  generatedAt: string
}

type CacheEntry = {
  expiresAt: number
  payload: AnalyticsPayload
}

const CACHE_TTL_MS = 30 * 1000 // 30 seconds keeps data fresh but avoids repeated heavy aggregation

const globalForAnalytics = globalThis as typeof globalThis & {
  __analyticsCache?: CacheEntry | null
}

export function getCachedAnalytics(): AnalyticsPayload | null {
  const cache = globalForAnalytics.__analyticsCache
  if (!cache) {
    return null
  }

  if (Date.now() > cache.expiresAt) {
    globalForAnalytics.__analyticsCache = null
    return null
  }

  return cache.payload
}

export function setAnalyticsCache(payload: AnalyticsPayload) {
  globalForAnalytics.__analyticsCache = {
    expiresAt: Date.now() + CACHE_TTL_MS,
    payload,
  }
}

export function invalidateAnalyticsCache() {
  globalForAnalytics.__analyticsCache = null
}

export type { AnalyticsPayload }


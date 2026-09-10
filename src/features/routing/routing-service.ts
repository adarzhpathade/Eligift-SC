import { db } from '@/db'
import { channelPartners, partnerHealthMetrics } from '@/db/schema'
import { eq, sql, and } from 'drizzle-orm'

export interface FindPartnersParams {
  lat: number
  lng: number
  radiusKm?: number
  limit?: number
}

export interface RoutedPartner {
  ifsc: string
  bank: string
  branch: string
  nodalOfficer: string | null
  contact: string | null
  address: string | null
  distanceKm: number
  viabilityScore: number
  health: {
    npaRatio: number
    remainingQuota: number
  }
}

export async function findSolventBranches({
  lat,
  lng,
  radiusKm = 25,
  limit = 3
}: FindPartnersParams): Promise<RoutedPartner[]> {
  const radiusMeters = radiusKm * 1000

  // We use PostGIS ST_Distance to compute distance
  // ST_MakePoint takes (longitude, latitude)
  const targetPoint = sql`ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)`
  
  const distanceSql = sql<number>`ST_Distance(${channelPartners.geography}, ${targetPoint})`
  const distanceKmSql = sql<number>`${distanceSql} / 1000.0`

  // Base query with geospatial filter (ST_DWithin)
  const results = await db
    .select({
      ifsc: channelPartners.ifsc,
      bank: channelPartners.bank,
      branch: channelPartners.branch,
      nodalOfficer: channelPartners.nodalOfficer,
      contact: channelPartners.contact,
      address: channelPartners.address,
      distanceKm: distanceKmSql,
      npaRatio: partnerHealthMetrics.npaRatio,
      allocatedQuota: partnerHealthMetrics.allocatedQuota,
      disbursedQuota: partnerHealthMetrics.disbursedQuota
    })
    .from(channelPartners)
    .innerJoin(
      partnerHealthMetrics,
      eq(channelPartners.ifsc, partnerHealthMetrics.ifsc)
    )
    .where(
      and(
        sql`ST_DWithin(${channelPartners.geography}, ${targetPoint}, ${radiusMeters})`,
        eq(channelPartners.isActive, true),
        eq(partnerHealthMetrics.isFrozen, false),
        sql`${partnerHealthMetrics.npaRatio} <= 0.1500`,
        sql`${partnerHealthMetrics.allocatedQuota} - ${partnerHealthMetrics.disbursedQuota} > 0`
      )
    )

  // Calculate Viability Score for each valid branch and sort
  // V_b = 0.35 × (1 / (1 + d)) + 0.40 × (1 - NPA_ratio) + 0.25 × min(1, Q_rem / Q_alloc)
  
  const scoredBranches: RoutedPartner[] = results.map(row => {
    const d = Number(row.distanceKm)
    const npa = Number(row.npaRatio)
    const allocated = Number(row.allocatedQuota)
    const disbursed = Number(row.disbursedQuota)
    const qRem = allocated - disbursed
    const quotaRatio = allocated > 0 ? qRem / allocated : 0
    
    const v_distance = 0.35 * (1 / (1 + d))
    const v_npa = 0.40 * (1 - npa)
    const v_quota = 0.25 * Math.min(1, quotaRatio)
    
    const viabilityScore = v_distance + v_npa + v_quota

    return {
      ifsc: row.ifsc,
      bank: row.bank,
      branch: row.branch,
      nodalOfficer: row.nodalOfficer,
      contact: row.contact,
      address: row.address,
      distanceKm: d,
      viabilityScore: Number(viabilityScore.toFixed(4)),
      health: {
        npaRatio: npa,
        remainingQuota: qRem
      }
    }
  })

  // Sort by highest viability score
  scoredBranches.sort((a, b) => b.viabilityScore - a.viabilityScore)

  return scoredBranches.slice(0, limit)
}

export async function findBestBranchForProfile(state: string, district?: string): Promise<RoutedPartner | null> {
  const results = await db
    .select({
      ifsc: channelPartners.ifsc,
      bank: channelPartners.bank,
      branch: channelPartners.branch,
      nodalOfficer: channelPartners.nodalOfficer,
      contact: channelPartners.contact,
      address: channelPartners.address,
      district: channelPartners.district,
      state: channelPartners.state,
      npaRatio: partnerHealthMetrics.npaRatio,
      allocatedQuota: partnerHealthMetrics.allocatedQuota,
      disbursedQuota: partnerHealthMetrics.disbursedQuota
    })
    .from(channelPartners)
    .innerJoin(
      partnerHealthMetrics,
      eq(channelPartners.ifsc, partnerHealthMetrics.ifsc)
    )
    .where(
      and(
        eq(sql`LOWER(${channelPartners.state})`, state.toLowerCase()),
        eq(channelPartners.isActive, true),
        eq(partnerHealthMetrics.isFrozen, false),
        sql`${partnerHealthMetrics.npaRatio} <= 0.1500`,
        sql`${partnerHealthMetrics.allocatedQuota} - ${partnerHealthMetrics.disbursedQuota} > 0`
      )
    )

  if (results.length === 0) return null

  const scoredBranches = results.map(row => {
    const npa = Number(row.npaRatio)
    const allocated = Number(row.allocatedQuota)
    const disbursed = Number(row.disbursedQuota)
    const qRem = allocated - disbursed
    const quotaRatio = allocated > 0 ? qRem / allocated : 0
    
    // Instead of distance, use a district match bonus
    const isSameDistrict = district && row.district && row.district.toLowerCase() === district.toLowerCase()
    const v_distance = isSameDistrict ? 0.35 : 0.0 // Full distance score if same district
    const v_npa = 0.40 * (1 - npa)
    const v_quota = 0.25 * Math.min(1, quotaRatio)
    
    const viabilityScore = v_distance + v_npa + v_quota

    return {
      ifsc: row.ifsc,
      bank: row.bank,
      branch: row.branch,
      nodalOfficer: row.nodalOfficer,
      contact: row.contact,
      address: row.address,
      distanceKm: isSameDistrict ? 5 : 50, // Approximation
      viabilityScore: Number(viabilityScore.toFixed(4)),
      health: {
        npaRatio: npa,
        remainingQuota: qRem
      }
    }
  })

  scoredBranches.sort((a, b) => b.viabilityScore - a.viabilityScore)

  return scoredBranches[0]
}

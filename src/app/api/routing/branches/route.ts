import { NextRequest, NextResponse } from 'next/server'
import { findSolventBranches, FindPartnersParams } from '@/features/routing/routing-service'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { lat, lng, radiusKm, limit } = body as Partial<FindPartnersParams>

    if (typeof lat !== 'number' || typeof lng !== 'number') {
      return NextResponse.json(
        { error: 'Valid lat and lng are required' },
        { status: 400 }
      )
    }

    const branches = await findSolventBranches({
      lat,
      lng,
      radiusKm: radiusKm || 25,
      limit: limit || 3
    })

    return NextResponse.json({ data: branches })
  } catch (error) {
    console.error('Routing Gatekeeper Error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve viable branches' },
      { status: 500 }
    )
  }
}

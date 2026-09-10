import { config } from 'dotenv'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { sql } from 'drizzle-orm'
import { channelPartners, partnerHealthMetrics } from './schema'

config({ path: '.env.local' })

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set')
}

const connectionString = process.env.DATABASE_URL
const client = postgres(connectionString)
const db = drizzle(client)

const PARTNERS = [
  {
    ifsc: 'SBIN0001234',
    bank: 'State Bank of India',
    branch: 'Bhopal Main Branch',
    partnerType: 'PSB',
    nodalOfficer: 'Rajesh Kumar',
    contact: '9876543210',
    address: 'TT Nagar, Bhopal',
    district: 'Bhopal',
    state: 'madhya_pradesh',
    lat: 23.2599,
    lng: 77.4126,
    isActive: true,
    health: {
      fiscalCycle: '2025-2026',
      allocatedQuota: '50000000',
      disbursedQuota: '25000000',
      npaRatio: '0.04',
      isFrozen: false
    }
  },
  {
    ifsc: 'PUNB0005678',
    bank: 'Punjab National Bank',
    branch: 'Indore MG Road',
    partnerType: 'PSB',
    nodalOfficer: 'Sneha Sharma',
    contact: '9876543211',
    address: 'MG Road, Indore',
    district: 'Indore',
    state: 'madhya_pradesh',
    lat: 22.7196,
    lng: 75.8577,
    isActive: true,
    health: {
      fiscalCycle: '2025-2026',
      allocatedQuota: '30000000',
      disbursedQuota: '10000000',
      npaRatio: '0.08',
      isFrozen: false
    }
  },
  {
    ifsc: 'BOI0009101',
    bank: 'Bank of India',
    branch: 'Ujjain Freeganj',
    partnerType: 'PSB',
    nodalOfficer: 'Amit Singh',
    contact: '9876543212',
    address: 'Freeganj, Ujjain',
    district: 'Ujjain',
    state: 'madhya_pradesh',
    lat: 23.1793,
    lng: 75.7849,
    isActive: true,
    health: {
      fiscalCycle: '2025-2026',
      allocatedQuota: '10000000',
      disbursedQuota: '9900000',
      npaRatio: '0.12',
      isFrozen: false
    }
  },
  {
    ifsc: 'CBIN0002345',
    bank: 'Central Bank of India',
    branch: 'Jabalpur Cantt',
    partnerType: 'PSB',
    nodalOfficer: 'Vikram Patel',
    contact: '9876543213',
    address: 'Cantt Area, Jabalpur',
    district: 'Jabalpur',
    state: 'madhya_pradesh',
    lat: 23.1815,
    lng: 79.9864,
    isActive: true,
    health: {
      fiscalCycle: '2025-2026',
      allocatedQuota: '20000000',
      disbursedQuota: '20000000', // Exhausted quota
      npaRatio: '0.05',
      isFrozen: false
    }
  },
  {
    ifsc: 'UBIN0006789',
    bank: 'Union Bank of India',
    branch: 'Gwalior Lashkar',
    partnerType: 'PSB',
    nodalOfficer: 'Priya Mishra',
    contact: '9876543214',
    address: 'Lashkar, Gwalior',
    district: 'Gwalior',
    state: 'madhya_pradesh',
    lat: 26.2183,
    lng: 78.1828,
    isActive: true,
    health: {
      fiscalCycle: '2025-2026',
      allocatedQuota: '15000000',
      disbursedQuota: '5000000',
      npaRatio: '0.18', // NPA > 15%, should be excluded
      isFrozen: false
    }
  },
  {
    ifsc: 'HDFC0001234',
    bank: 'HDFC Bank',
    branch: 'Pune Hinjewadi',
    partnerType: 'PSB',
    nodalOfficer: 'Rohan Deshmukh',
    contact: '9876543215',
    address: 'Hinjewadi, Pune',
    district: 'Pune',
    state: 'maharashtra',
    lat: 18.5913,
    lng: 73.7389,
    isActive: true,
    health: {
      fiscalCycle: '2025-2026',
      allocatedQuota: '80000000',
      disbursedQuota: '30000000',
      npaRatio: '0.02',
      isFrozen: false
    }
  },
  {
    ifsc: 'ICIC0005678',
    bank: 'ICICI Bank',
    branch: 'Mumbai Bandra',
    partnerType: 'PSB',
    nodalOfficer: 'Neha Kulkarni',
    contact: '9876543216',
    address: 'Bandra West, Mumbai',
    district: 'Mumbai',
    state: 'maharashtra',
    lat: 19.0596,
    lng: 72.8295,
    isActive: true,
    health: {
      fiscalCycle: '2025-2026',
      allocatedQuota: '100000000',
      disbursedQuota: '50000000',
      npaRatio: '0.03',
      isFrozen: true // Frozen, should be excluded
    }
  },
  {
    ifsc: 'IDIB0009101',
    bank: 'Indian Bank',
    branch: 'Nagpur Civil Lines',
    partnerType: 'PSB',
    nodalOfficer: 'Vivek Joshi',
    contact: '9876543217',
    address: 'Civil Lines, Nagpur',
    district: 'Nagpur',
    state: 'maharashtra',
    lat: 21.1458,
    lng: 79.0882,
    isActive: false, // Inactive, should be excluded
    health: {
      fiscalCycle: '2025-2026',
      allocatedQuota: '20000000',
      disbursedQuota: '10000000',
      npaRatio: '0.05',
      isFrozen: false
    }
  },
  {
    ifsc: 'BARB0002345',
    bank: 'Bank of Baroda',
    branch: 'Lucknow Hazratganj',
    partnerType: 'PSB',
    nodalOfficer: 'Sanjay Tiwari',
    contact: '9876543218',
    address: 'Hazratganj, Lucknow',
    district: 'Lucknow',
    state: 'uttar_pradesh',
    lat: 26.8467,
    lng: 80.9462,
    isActive: true,
    health: {
      fiscalCycle: '2025-2026',
      allocatedQuota: '60000000',
      disbursedQuota: '20000000',
      npaRatio: '0.06',
      isFrozen: false
    }
  },
  {
    ifsc: 'BKID0006789',
    bank: 'Bank of India',
    branch: 'Kanpur Mall Road',
    partnerType: 'PSB',
    nodalOfficer: 'Pooja Singh',
    contact: '9876543219',
    address: 'Mall Road, Kanpur',
    district: 'Kanpur',
    state: 'uttar_pradesh',
    lat: 26.4499,
    lng: 80.3319,
    isActive: true,
    health: {
      fiscalCycle: '2025-2026',
      allocatedQuota: '40000000',
      disbursedQuota: '15000000',
      npaRatio: '0.09',
      isFrozen: false
    }
  }
]

async function seed() {
  console.log('Seeding Channel Partners...')

  for (const partner of PARTNERS) {
    console.log(`Processing ${partner.bank} - ${partner.branch}`)

    // Clean up existing
    await db.delete(partnerHealthMetrics).where(sql`${partnerHealthMetrics.ifsc} = ${partner.ifsc}`)
    await db.delete(channelPartners).where(sql`${channelPartners.ifsc} = ${partner.ifsc}`)

    // Insert Partner
    await db.insert(channelPartners).values({
      ifsc: partner.ifsc,
      bank: partner.bank,
      branch: partner.branch,
      partnerType: partner.partnerType,
      nodalOfficer: partner.nodalOfficer,
      contact: partner.contact,
      address: partner.address,
      district: partner.district,
      state: partner.state,
      isActive: partner.isActive,
      geography: sql`ST_SetSRID(ST_MakePoint(${partner.lng}, ${partner.lat}), 4326)` as any
    })

    // Insert Health Metrics
    await db.insert(partnerHealthMetrics).values({
      ifsc: partner.ifsc,
      fiscalCycle: partner.health.fiscalCycle,
      allocatedQuota: partner.health.allocatedQuota,
      disbursedQuota: partner.health.disbursedQuota,
      npaRatio: partner.health.npaRatio,
      isFrozen: partner.health.isFrozen
    })
  }

  console.log('Channel Partners Seeded Successfully!')
}

seed()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await client.end()
    process.exit(0)
  })

import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { channelPartners, partnerHealthMetrics } from './src/db/schema/index.js';

config({ path: '.env.local' });

const connectionString = process.env.DATABASE_URL || process.env.DIRECT_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL or DIRECT_URL must be set');
}

const client = postgres(connectionString);
const db = drizzle(client);

const partners = [
  {
    ifsc: 'SBIN0000691',
    bank: 'State Bank of India',
    branch: 'New Delhi Main Branch',
    partnerType: 'PSU Bank',
    nodalOfficer: 'Rajesh Kumar',
    contact: '011-23374567',
    address: '11 Parliament Street, New Delhi',
    district: 'New Delhi',
    state: 'Delhi',
    geography: { x: 77.2090, y: 28.6139 },
    isActive: true,
  },
  {
    ifsc: 'PUNB0011200',
    bank: 'Punjab National Bank',
    branch: 'Connaught Place',
    partnerType: 'PSU Bank',
    nodalOfficer: 'Priya Sharma',
    contact: '011-23314568',
    address: 'ECE House, Connaught Place, New Delhi',
    district: 'New Delhi',
    state: 'Delhi',
    geography: { x: 77.2197, y: 28.6315 },
    isActive: true,
  },
  {
    ifsc: 'SBIN0000300',
    bank: 'State Bank of India',
    branch: 'Mumbai Main Branch',
    partnerType: 'PSU Bank',
    nodalOfficer: 'Amit Desai',
    contact: '022-22661234',
    address: 'Horniman Circle, Fort, Mumbai',
    district: 'Mumbai',
    state: 'Maharashtra',
    geography: { x: 72.8347, y: 18.9322 },
    isActive: true,
  }
];

const healthMetrics = [
  {
    ifsc: 'SBIN0000691',
    fiscalCycle: '2025-2026',
    allocatedQuota: '100000000', // 10 Cr
    disbursedQuota: '20000000',  // 2 Cr
    npaRatio: '0.045',          // 4.5%
    isFrozen: false,
  },
  {
    ifsc: 'PUNB0011200',
    fiscalCycle: '2025-2026',
    allocatedQuota: '50000000',  // 5 Cr
    disbursedQuota: '45000000',  // 4.5 Cr
    npaRatio: '0.082',          // 8.2%
    isFrozen: false,
  },
  {
    ifsc: 'SBIN0000300',
    fiscalCycle: '2025-2026',
    allocatedQuota: '200000000', // 20 Cr
    disbursedQuota: '150000000', // 15 Cr
    npaRatio: '0.16',           // 16% (> 15% means it will be rejected by routing gatekeeper)
    isFrozen: false,
  }
];

async function seed() {
  console.log(`Starting to seed ${partners.length} Channel Partners...`);
  try {
    for (const partner of partners) {
      // @ts-ignore
      await db.insert(channelPartners)
        .values(partner)
        .onConflictDoUpdate({
          target: channelPartners.ifsc,
          set: partner,
        });
      console.log(`Upserted partner: ${partner.ifsc}`);
    }

    for (const health of healthMetrics) {
      await db.insert(partnerHealthMetrics)
        .values(health)
        .onConflictDoUpdate({
          target: [partnerHealthMetrics.ifsc, partnerHealthMetrics.fiscalCycle],
          set: health,
        });
      console.log(`Upserted health metric for: ${health.ifsc}`);
    }

    console.log('Seeding Channel Partners complete!');
  } catch (error) {
    console.error('Error seeding channel partners:', error);
  } finally {
    await client.end();
  }
}

seed();

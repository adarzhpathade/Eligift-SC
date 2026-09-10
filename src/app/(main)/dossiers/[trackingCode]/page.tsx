import React from 'react';
import { notFound } from 'next/navigation';
import { db } from '@/db';
import { loanDossiers, schemes, channelPartners } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { formatCurrency } from '@/lib/utils';
import { RoutingSlipClient } from './RoutingSlipClient';

export default async function RoutingSlipPage(
  props: { params: Promise<{ trackingCode: string }> }
) {
  const params = await props.params;
  const { trackingCode } = params;

  const result = await db
    .select({
      dossier: loanDossiers,
      scheme: schemes,
      partner: channelPartners,
    })
    .from(loanDossiers)
    .innerJoin(schemes, eq(loanDossiers.eligibleSchemeId, schemes.id))
    .innerJoin(channelPartners, eq(loanDossiers.allocatedPartnerIfsc, channelPartners.ifsc))
    .where(eq(loanDossiers.trackingCode, trackingCode))
    .limit(1);

  const data = result[0];

  if (!data) {
    notFound();
  }

  const { dossier, scheme, partner } = data;

  const slipData = {
    trackingCode: dossier.trackingCode,
    applicantName: dossier.applicantName,
    annualIncome: formatCurrency(Number(dossier.annualIncome)),
    projectCost: formatCurrency(Number(dossier.projectCost)),
    calculatedEmi: formatCurrency(Number(dossier.calculatedEmi)),
    moratorium: dossier.selectedMoratorium ?? 0,
    status: dossier.status,
    createdAt: new Date(dossier.createdAt).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
    schemeTitle: scheme.title,
    schemeMinistry: scheme.ministry,
    interestRate: scheme.interestRateMale ? `${scheme.interestRateMale}%` : '—',
    govtFunding: scheme.govtFundingPct ? `${scheme.govtFundingPct}%` : '—',
    partnerBank: partner.bank,
    partnerBranch: partner.branch,
    partnerIfsc: partner.ifsc,
    partnerAddress: partner.address ?? '',
    partnerNodalOfficer: partner.nodalOfficer ?? null,
    partnerContact: partner.contact ?? null,
    directionsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(partner.bank + ' ' + partner.branch + ' ' + (partner.address || ''))}`,
  };

  return <RoutingSlipClient data={slipData} />;
}

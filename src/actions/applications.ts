"use server";

import { db } from "@/db";
import { loanDossiers, schemes, channelPartners } from "@/db/schema";
import { getAuthUser, getProfile } from "@/lib/auth-cache";
import { eq, desc } from "drizzle-orm";

export type ApplicationSummary = {
  trackingCode: string;
  status: string;
  createdAt: string;
  // Scheme
  schemeTitle: string;
  schemeTitleHi: string | null;
  schemeMinistry: string;
  schemeMinistryHi: string | null;
  schemeCategory: string;
  // Financial
  projectCost: number;
  calculatedEmi: number;
  annualIncome: number;
  selectedMoratorium: number;
  interestRate: number | null;
  govtFundingPct: number;
  maxTenureMonths: number;
  // Partner
  partnerBank: string;
  partnerBranch: string;
  partnerIfsc: string;
  partnerAddress: string | null;
  // Computed
  financedAmount: number;
  totalRepayable: number;
  monthsElapsed: number;
  estimatedPaid: number;
  estimatedRemaining: number;
  progressPercent: number;
};

/**
 * Fetches all loan dossiers for the current user, enriched with
 * scheme, partner, and computed repayment progress data.
 */
export async function getMyApplications(): Promise<{
  success: boolean;
  data?: ApplicationSummary[];
  error?: string;
}> {
  try {
    const user = await getAuthUser();
    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const profile = await getProfile();
    if (!profile) {
      return { success: false, error: "Profile not found" };
    }

    const results = await db
      .select({
        trackingCode: loanDossiers.trackingCode,
        status: loanDossiers.status,
        createdAt: loanDossiers.createdAt,
        projectCost: loanDossiers.projectCost,
        calculatedEmi: loanDossiers.calculatedEmi,
        annualIncome: loanDossiers.annualIncome,
        selectedMoratorium: loanDossiers.selectedMoratorium,
        // Scheme fields
        schemeTitle: schemes.title,
        schemeTitleHi: schemes.titleHi,
        schemeMinistry: schemes.ministry,
        schemeMinistryHi: schemes.ministryHi,
        schemeCategory: schemes.category,
        interestRateMale: schemes.interestRateMale,
        interestRateFemale: schemes.interestRateFemale,
        govtFundingPct: schemes.govtFundingPct,
        maxTenureMonths: schemes.maxTenureMonths,
        // Partner fields
        partnerBank: channelPartners.bank,
        partnerBranch: channelPartners.branch,
        partnerIfsc: channelPartners.ifsc,
        partnerAddress: channelPartners.address,
      })
      .from(loanDossiers)
      .innerJoin(schemes, eq(loanDossiers.eligibleSchemeId, schemes.id))
      .innerJoin(
        channelPartners,
        eq(loanDossiers.allocatedPartnerIfsc, channelPartners.ifsc)
      )
      .where(eq(loanDossiers.userId, profile.userId))
      .orderBy(desc(loanDossiers.createdAt));

    const gender = profile.gender?.toLowerCase();

    const applications: ApplicationSummary[] = results.map((r) => {
      const projectCost = Number(r.projectCost);
      const emi = Number(r.calculatedEmi);
      const moratorium = r.selectedMoratorium ?? 0;
      const maxTenure = r.maxTenureMonths ?? 42;
      const govtPct = Number(r.govtFundingPct) || 90;
      const financedAmount = (projectCost * govtPct) / 100;

      // Pick gender-appropriate rate
      const isFemale = gender === "female";
      const annualRate =
        isFemale && r.interestRateFemale
          ? Number(r.interestRateFemale)
          : r.interestRateMale
            ? Number(r.interestRateMale)
            : null;
      const monthlyRate = annualRate ? annualRate / 12 / 100 : 0;

      // Total repayable estimate
      const moratoriumInterest = financedAmount * monthlyRate * moratorium;
      const amortizationMonths = Math.max(0, maxTenure - moratorium);
      const amortizationTotal = emi * amortizationMonths;
      const totalRepayable = moratoriumInterest + amortizationTotal;

      // Progress based on months elapsed
      const now = new Date();
      const created = new Date(r.createdAt);
      const msElapsed = now.getTime() - created.getTime();
      const monthsElapsed = Math.max(
        0,
        Math.floor(msElapsed / (30.44 * 24 * 60 * 60 * 1000))
      );

      // Estimate paid so far
      let estimatedPaid = 0;
      if (monthsElapsed <= moratorium) {
        estimatedPaid = financedAmount * monthlyRate * monthsElapsed;
      } else {
        estimatedPaid = moratoriumInterest;
        const amortMonthsDone = Math.min(
          monthsElapsed - moratorium,
          amortizationMonths
        );
        estimatedPaid += emi * amortMonthsDone;
      }

      const estimatedRemaining = Math.max(0, totalRepayable - estimatedPaid);
      const progressPercent =
        totalRepayable > 0
          ? Math.min(100, Math.round((estimatedPaid / totalRepayable) * 100))
          : 0;

      return {
        trackingCode: r.trackingCode,
        status: r.status,
        createdAt: r.createdAt.toISOString(),
        schemeTitle: r.schemeTitle,
        schemeTitleHi: r.schemeTitleHi,
        schemeMinistry: r.schemeMinistry,
        schemeMinistryHi: r.schemeMinistryHi,
        schemeCategory: r.schemeCategory,
        projectCost,
        calculatedEmi: emi,
        annualIncome: Number(r.annualIncome),
        selectedMoratorium: moratorium,
        interestRate: annualRate,
        govtFundingPct: govtPct,
        maxTenureMonths: maxTenure,
        partnerBank: r.partnerBank,
        partnerBranch: r.partnerBranch,
        partnerIfsc: r.partnerIfsc,
        partnerAddress: r.partnerAddress,
        financedAmount,
        totalRepayable,
        monthsElapsed,
        estimatedPaid,
        estimatedRemaining,
        progressPercent,
      };
    });

    return { success: true, data: applications };
  } catch (error) {
    console.error("Failed to fetch applications:", error);
    return {
      success: false,
      error: "An unexpected error occurred while fetching applications.",
    };
  }
}

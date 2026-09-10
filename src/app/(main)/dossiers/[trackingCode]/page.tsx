import React from 'react';
import { notFound } from 'next/navigation';
import { db } from '@/db';
import { loanDossiers, schemes, channelPartners } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { formatCurrency } from '@/lib/utils';
import QRCode from 'react-qr-code';

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

  return (
    <div className="bg-background min-h-screen pb-32">
      <div className="max-w-3xl mx-auto pt-12 px-4 md:px-0">
        
        {/* Action Bar (Not Printed) */}
        <div className="flex justify-between items-center mb-8 print:hidden">
          <a href="/dashboard" className="text-muted-foreground hover:text-foreground flex items-center gap-2 font-medium">
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Back to Dashboard
          </a>
          <button 
            type="button"
            className="h-10 px-6 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 flex items-center gap-2 print-btn"
          >
            <span className="material-symbols-outlined text-[18px]">print</span>
            Print Slip
          </button>
        </div>

        {/* Printable Slip */}
        <div className="bg-white text-black p-8 md:p-12 rounded-[20px] shadow-lg border border-border/10">
          
          <div className="flex justify-between items-start border-b border-gray-200 pb-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="material-symbols-outlined text-primary text-[32px]">assured_workload</span>
                <h1 className="text-[28px] font-bold text-gray-900 tracking-tight">Eligify</h1>
              </div>
              <p className="text-[14px] text-gray-500 font-medium tracking-wide uppercase">Official Routing Slip</p>
            </div>
            <div className="text-right">
              <div className="bg-gray-100 p-3 rounded-lg inline-block">
                <QRCode value={dossier.trackingCode} size={80} />
              </div>
              <p className="text-[12px] text-gray-500 mt-2 font-mono">{dossier.trackingCode}</p>
            </div>
          </div>

          <div className="space-y-8">
            
            {/* Applicant Information */}
            <section>
              <h2 className="text-[12px] font-bold text-gray-400 uppercase tracking-wider mb-4">Applicant Information</h2>
              <div className="grid grid-cols-2 gap-y-4">
                <div>
                  <p className="text-[12px] text-gray-500 mb-1">Full Name</p>
                  <p className="text-[16px] font-bold text-gray-900">{dossier.applicantName}</p>
                </div>
                <div>
                  <p className="text-[12px] text-gray-500 mb-1">Annual Income</p>
                  <p className="text-[16px] font-bold text-gray-900">{formatCurrency(Number(dossier.annualIncome))}</p>
                </div>
                <div>
                  <p className="text-[12px] text-gray-500 mb-1">Date Generated</p>
                  <p className="text-[16px] font-bold text-gray-900">
                    {new Date(dossier.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-[12px] text-gray-500 mb-1">Status</p>
                  <p className="text-[16px] font-bold text-gray-900">{dossier.status}</p>
                </div>
              </div>
            </section>

            {/* Approved Scheme */}
            <section className="bg-blue-50/50 p-6 rounded-xl border border-blue-100">
              <h2 className="text-[12px] font-bold text-blue-600 uppercase tracking-wider mb-4">Matched Scheme</h2>
              <div className="mb-4">
                <p className="text-[20px] font-bold text-gray-900 mb-1">{scheme.title}</p>
                <p className="text-[14px] text-gray-600">{scheme.ministry}</p>
              </div>
              <div className="grid grid-cols-3 gap-4 border-t border-blue-200/50 pt-4 mt-2">
                <div>
                  <p className="text-[12px] text-gray-500 mb-1">Project Cost</p>
                  <p className="text-[16px] font-bold text-gray-900">{formatCurrency(Number(dossier.projectCost))}</p>
                </div>
                <div>
                  <p className="text-[12px] text-gray-500 mb-1">Est. Monthly EMI</p>
                  <p className="text-[16px] font-bold text-blue-700">{formatCurrency(Number(dossier.calculatedEmi))}</p>
                </div>
                <div>
                  <p className="text-[12px] text-gray-500 mb-1">Moratorium</p>
                  <p className="text-[16px] font-bold text-gray-900">{dossier.selectedMoratorium} Months</p>
                </div>
              </div>
            </section>

            {/* Allocated Partner */}
            <section>
              <h2 className="text-[12px] font-bold text-gray-400 uppercase tracking-wider mb-4">Assigned Branch</h2>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-gray-600 text-[24px]">account_balance</span>
                </div>
                <div>
                  <p className="text-[18px] font-bold text-gray-900">{partner.bank}</p>
                  <p className="text-[14px] text-gray-600 font-medium mb-1">{partner.branch}</p>
                  <p className="text-[14px] text-gray-500 mb-2">{partner.address}</p>
                  <div className="flex gap-4">
                    <p className="text-[12px] text-gray-500">
                      <span className="font-semibold text-gray-700">IFSC:</span> {partner.ifsc}
                    </p>
                    {partner.nodalOfficer && (
                      <p className="text-[12px] text-gray-500">
                        <span className="font-semibold text-gray-700">Nodal Officer:</span> {partner.nodalOfficer}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </section>

          </div>

          {/* Footer Notes */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-[12px] text-gray-400 text-center max-w-xl mx-auto">
              This slip indicates preliminary eligibility and acts as a routing reference. Final approval is subject to document verification by the branch manager as per official government policy.
            </p>
          </div>

        </div>
      </div>
      
      {/* Inline script for print button since this is a server component */}
      <script dangerouslySetInnerHTML={{ __html: `
        document.querySelectorAll('button[onClick="window.print()"]').forEach(btn => {
          btn.onclick = (e) => { e.preventDefault(); window.print(); }
        });
      `}} />
    </div>
  );
}

"use client";

import React from 'react';
import Link from 'next/link';
import QRCode from 'react-qr-code';

type SlipData = {
  trackingCode: string;
  applicantName: string;
  annualIncome: string;
  projectCost: string;
  calculatedEmi: string;
  moratorium: number;
  status: string;
  createdAt: string;
  schemeTitle: string;
  schemeMinistry: string;
  interestRate: string;
  govtFunding: string;
  partnerBank: string;
  partnerBranch: string;
  partnerIfsc: string;
  partnerAddress: string;
  partnerNodalOfficer: string | null;
  partnerContact: string | null;
  directionsUrl: string;
};

function InfoRow({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-[15px] font-bold leading-tight ${accent ? 'text-[#1a56db]' : 'text-gray-900'}`}>{value}</p>
    </div>
  );
}

export function RoutingSlipClient({ data }: { data: SlipData }) {
  const handlePrint = () => window.print();

  return (
    <div className="bg-background min-h-screen pb-32">
      <div className="max-w-5xl mx-auto pt-10 px-4 md:px-6">

        {/* ─── Action Bar (hidden in print) ─── */}
        <div className="flex flex-wrap justify-between items-center gap-3 mb-6 print:hidden">
          <Link href="/my-applications" className="text-muted-foreground hover:text-foreground flex items-center gap-2 font-medium text-[14px] transition-colors">
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            My Applications
          </Link>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handlePrint}
              className="h-10 px-5 bg-primary text-primary-foreground font-semibold rounded-xl flex items-center gap-2 text-[13px] hover:bg-primary/90 transition-all duration-200"
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
              Download Slip
            </button>
          </div>
        </div>

        {/* ─── Printable Slip Card ─── */}
        <div className="bg-white text-black rounded-[24px] shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden print:shadow-none print:border-none print:rounded-none">

          {/* Header Band */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white px-8 md:px-10 py-6 flex justify-between items-center">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="material-symbols-outlined text-[28px] opacity-80">assured_workload</span>
                <h1 className="text-[24px] font-bold tracking-tight">Eligify</h1>
              </div>
              <p className="text-[12px] font-medium tracking-[0.15em] uppercase text-gray-300">Official Routing Slip</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="bg-white p-2.5 rounded-lg">
                <QRCode value={data.trackingCode} size={72} />
              </div>
              <p className="text-[11px] font-mono text-gray-400">{data.trackingCode}</p>
            </div>
          </div>

          <div className="px-8 md:px-10 py-8 space-y-7">

            {/* ─── Status Badge ─── */}
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {data.status === 'DOSSIER_GENERATED' ? 'Active' : data.status}
              </span>
              <span className="text-[12px] text-gray-400 font-medium">Generated on {data.createdAt}</span>
            </div>

            {/* ─── Applicant ─── */}
            <section>
              <h2 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <span className="w-5 h-px bg-gray-200" />
                Applicant
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                <InfoRow label="Full Name" value={data.applicantName} />
                <InfoRow label="Annual Income" value={data.annualIncome} />
                <InfoRow label="Date Generated" value={data.createdAt} />
              </div>
            </section>

            {/* ─── Matched Scheme ─── */}
            <section className="bg-blue-50/60 rounded-2xl p-6 border border-blue-100/80">
              <h2 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <span className="w-5 h-px bg-blue-200" />
                Matched Scheme
              </h2>
              <div className="mb-5">
                <p className="text-[18px] font-bold text-gray-900 leading-tight mb-1">{data.schemeTitle}</p>
                <p className="text-[13px] text-gray-500 font-medium">{data.schemeMinistry}</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-blue-200/40">
                <InfoRow label="Project Cost" value={data.projectCost} />
                <InfoRow label="Monthly EMI" value={data.calculatedEmi} accent />
                <InfoRow label="Moratorium" value={`${data.moratorium} Months`} />
                <InfoRow label="Interest Rate" value={data.interestRate} />
              </div>
            </section>

            {/* ─── Assigned Branch ─── */}
            <section>
              <h2 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <span className="w-5 h-px bg-gray-200" />
                Assigned Branch
              </h2>
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-gray-500 text-[20px]">account_balance</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[16px] font-bold text-gray-900 mb-0.5">{data.partnerBank}</p>
                  <p className="text-[13px] text-gray-600 font-medium">{data.partnerBranch}</p>
                  {data.partnerAddress && (
                    <p className="text-[12px] text-gray-400 mt-1 leading-relaxed">{data.partnerAddress}</p>
                  )}
                  <div className="flex flex-wrap gap-x-5 gap-y-1 mt-3">
                    <p className="text-[11px] text-gray-400">
                      <span className="font-bold text-gray-500">IFSC:</span> {data.partnerIfsc}
                    </p>
                    {data.partnerNodalOfficer && (
                      <p className="text-[11px] text-gray-400">
                        <span className="font-bold text-gray-500">Nodal Officer:</span> {data.partnerNodalOfficer}
                      </p>
                    )}
                    {data.partnerContact && (
                      <p className="text-[11px] text-gray-400">
                        <span className="font-bold text-gray-500">Contact:</span> {data.partnerContact}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Get Directions inside slip (print-friendly) */}
              <div className="mt-5 print:hidden">
                <a
                  href={data.directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 h-10 px-5 bg-gray-900 text-white text-[13px] font-semibold rounded-xl hover:bg-gray-800 transition-all duration-200"
                >
                  <span className="material-symbols-outlined text-[16px]">directions</span>
                  Get Directions to Branch
                </a>
              </div>
            </section>

          </div>

          {/* ─── Footer ─── */}
          <div className="px-8 md:px-10 py-6 bg-gray-50 border-t border-gray-100">
            <p className="text-[11px] text-gray-400 text-center max-w-lg mx-auto leading-relaxed">
              This slip indicates preliminary eligibility and acts as a routing reference. Final approval is subject to document verification by the branch manager as per official government policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

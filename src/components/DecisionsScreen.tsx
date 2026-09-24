import React from 'react';
import { ApplicantData, FinanceData, UnderwritingResult } from '../types';
import { formatINR } from '../utils/underwriting';

interface DecisionsScreenProps {
  applicant: ApplicantData;
  finance: FinanceData;
  result: UnderwritingResult;
  onEditInputs: () => void;
  onDownloadReport: () => void;
}

export const DecisionsScreen: React.FC<DecisionsScreenProps> = ({
  applicant,
  finance,
  result,
  onEditInputs,
  onDownloadReport,
}) => {
  // Calculate maximum loan capacity based on 50% FOIR
  const maxAllowedOutflow = finance.monthlyIncome * 0.5;
  const maxAvailableEmi = Math.max(0, maxAllowedOutflow - finance.existingEmi);
  // Estimate max loan principal:
  const r = (11.5 / 12) / 100;
  const n = finance.tenureMonths;
  const maxEligibleLoan = Math.round(
    maxAvailableEmi * (Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n))
  );

  const bankOffers = [
    {
      bank: 'HDFC Bank',
      type: 'Tier 1 Private',
      logoText: 'HDFC',
      rate: '10.35% - 11.25%',
      maxTenure: '60 mos',
      sanctionChance: result.score >= 750 ? 'Very High (92%)' : result.score >= 720 ? 'Moderate (68%)' : 'Low (<25%)',
      badge: result.score >= 750 ? 'Pre-Approved' : 'Standard',
      badgeColor: result.score >= 750 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700',
      minScore: 750,
      fee: '1.0% + GST',
    },
    {
      bank: 'Kotak Mahindra Bank',
      type: 'Tier 2 Private',
      logoText: 'KOTAK',
      rate: '11.25% - 12.50%',
      maxTenure: '60 mos',
      sanctionChance: result.score >= 700 ? 'Very High (88%)' : result.score >= 650 ? 'High (75%)' : 'Low (30%)',
      badge: result.score >= 700 ? 'Prime Match' : 'Conditional',
      badgeColor: result.score >= 700 ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800',
      minScore: 680,
      fee: '1.5% + GST',
    },
    {
      bank: 'Bajaj Finserv',
      type: 'Leading NBFC',
      logoText: 'BAJAJ',
      rate: '12.00% - 13.99%',
      maxTenure: '72 mos',
      sanctionChance: result.score >= 650 ? 'Instant Approval (94%)' : result.score >= 600 ? 'Moderate (65%)' : 'Subject to Covenants',
      badge: 'Fast Track Disbursal',
      badgeColor: 'bg-emerald-100 text-emerald-800',
      minScore: 650,
      fee: '2.0% + GST',
    },
    {
      bank: 'State Bank of India (SBI)',
      type: 'Public Sector Bank',
      logoText: 'SBI',
      rate: '10.15% - 11.00%',
      maxTenure: '72 mos',
      sanctionChance: result.score >= 750 ? 'High (82%)' : 'Borderline Cutoff',
      badge: 'Lowest Interest',
      badgeColor: 'bg-purple-100 text-purple-800',
      minScore: 750,
      fee: '0.75% + GST',
    },
    {
      bank: 'Tata Capital',
      type: 'Prime NBFC',
      logoText: 'TATA',
      rate: '11.50% - 13.25%',
      maxTenure: '60 mos',
      sanctionChance: result.score >= 680 ? 'High (85%)' : 'Review Required',
      badge: 'Flexi EMI',
      badgeColor: 'bg-indigo-100 text-indigo-800',
      minScore: 660,
      fee: '1.75% + GST',
    },
  ];

  const policyChecks = [
    {
      rule: 'Minimum Monthly Income',
      benchmark: '≥ ₹25,000 / mo',
      applicantValue: `₹${formatINR(finance.monthlyIncome)} / mo`,
      passed: finance.monthlyIncome >= 25000,
    },
    {
      rule: 'FOIR / DTI Leverage Cap',
      benchmark: '≤ 50.0% of net income',
      applicantValue: `${result.dtiRatio.toFixed(1)}%`,
      passed: result.dtiRatio <= 50.0,
    },
    {
      rule: 'Credit Bureau Overdue Status',
      benchmark: '0 DPD (No active defaults)',
      applicantValue: result.isOverdue ? 'Active Overdue Reported' : 'Clean (0 DPD)',
      passed: !result.isOverdue,
    },
    {
      rule: 'Age Eligibility Window',
      benchmark: '21 to 60 years old',
      applicantValue: `${applicant.age} years`,
      passed: applicant.age >= 21 && applicant.age <= 60,
    },
    {
      rule: 'Prime Bureau Score Cutoff',
      benchmark: 'Score ≥ 720 (CIBIL Scale)',
      applicantValue: `${result.score} pts`,
      passed: result.score >= 720,
    },
  ];

  return (
    <div className="flex flex-col w-full space-y-4 pb-2">
      {/* Header */}
      <div className="flex flex-col gap-1 pt-1">
        <div className="flex items-center justify-between">
          <span className="font-metric text-[11px] px-2 py-0.5 rounded-full bg-[#dce9ff] text-[#003bd6] font-bold uppercase tracking-wider">
            Underwriting Decisions
          </span>
          <span className="font-metric text-[11px] text-[#44474d]">
            CIBIL Proxy: <strong className="text-[#0b1c30]">{result.score}</strong>
          </span>
        </div>
        <h1 className="text-[24px] text-[#0b1c30] font-bold leading-tight">
          Lender Decisions & Bank Matrix
        </h1>
        <p className="text-[13px] text-[#44474d]">
          Institutional pre-sanction probabilities for {applicant.fullName || 'Applicant'} based on current risk profile.
        </p>
      </div>

      {/* Credit Capacity Summary */}
      <div className="bg-[#0d1c32] text-white rounded-xl p-4 shadow-md flex flex-col gap-3 relative overflow-hidden">
        <div className="flex items-center justify-between z-10">
          <span className="font-metric text-[11px] text-[#89f5e7] uppercase tracking-wider font-bold">
            Simulated Credit Sanction Limit
          </span>
          <span className="px-2 py-0.5 rounded-full bg-white/10 text-white font-metric text-[11px]">
            50% FOIR Benchmark
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 z-10 pt-1">
          <div className="flex flex-col">
            <span className="font-metric text-[11px] text-[#76849f]">Requested Loan</span>
            <span className="text-[20px] font-bold font-metric text-white">
              ₹{formatINR(finance.loanAmount)}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-metric text-[11px] text-[#76849f]">Max Estimated Capacity</span>
            <span className="text-[20px] font-bold font-metric text-[#89f5e7]">
              ₹{formatINR(Math.min(2500000, maxEligibleLoan))}
            </span>
          </div>
        </div>

        <div className="text-[11px] text-[#76849f] border-t border-white/10 pt-2 z-10 flex items-center justify-between">
          <span>Unutilized EMI headroom:</span>
          <span className="text-white font-metric font-semibold">
            ₹{formatINR(Math.max(0, maxAvailableEmi - result.newEmi))}/mo
          </span>
        </div>
      </div>

      {/* Policy Compliance Checks */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-[#e5eeff] flex flex-col gap-3">
        <div className="flex items-center justify-between pb-1 border-b border-[#e5eeff]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#003bd6] text-[18px]">policy</span>
            <h2 className="text-[16px] text-[#0b1c30] font-bold">Credit Policy Checklist</h2>
          </div>
          <span className="font-metric text-[11px] text-[#44474d]">
            {policyChecks.filter((c) => c.passed).length} of {policyChecks.length} Passed
          </span>
        </div>

        <div className="flex flex-col gap-2">
          {policyChecks.map((item, i) => (
            <div
              key={i}
              className="p-2.5 rounded-lg bg-[#eff4ff] flex items-center justify-between border border-[#dce9ff]/60"
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={`material-symbols-outlined text-[20px] ${
                    item.passed ? 'text-[#0c9488]' : 'text-[#ba1a1a]'
                  }`}
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {item.passed ? 'check_circle' : 'cancel'}
                </span>
                <div className="flex flex-col">
                  <span className="text-[13px] font-bold text-[#0b1c30]">{item.rule}</span>
                  <span className="font-metric text-[11px] text-[#44474d]">{item.benchmark}</span>
                </div>
              </div>
              <div className="text-right">
                <span
                  className={`font-metric text-[11px] font-bold px-2 py-0.5 rounded ${
                    item.passed ? 'bg-[#e5eeff] text-[#0c9488]' : 'bg-[#ffdad6] text-[#ba1a1a]'
                  }`}
                >
                  {item.applicantValue}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Bank Offers */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-[#e5eeff] flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h2 className="text-[16px] text-[#0b1c30] font-bold">Institutional Sanction Matrix</h2>
            <span className="text-[12px] text-[#44474d]">
              Simulated underwriter responses across prime lenders
            </span>
          </div>
          <span className="material-symbols-outlined text-[#75777e] text-[20px]">account_balance</span>
        </div>

        <div className="flex flex-col gap-2.5">
          {bankOffers.map((offer, idx) => {
            const isQualified = result.score >= offer.minScore && !result.isOverdue && result.dtiRatio <= 50;
            return (
              <div
                key={idx}
                className={`p-3 rounded-xl border flex flex-col gap-2 transition-all ${
                  isQualified
                    ? 'bg-white border-[#dce9ff] hover:border-[#003bd6]/40'
                    : 'bg-[#eff4ff]/60 border-transparent opacity-75'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#dde1ff] text-[#003bd6] font-metric text-[11px] font-bold flex items-center justify-center">
                      {offer.logoText.slice(0, 3)}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[14px] font-bold text-[#0b1c30]">{offer.bank}</span>
                      <span className="font-metric text-[10px] text-[#44474d]">{offer.type}</span>
                    </div>
                  </div>
                  <span className={`font-metric text-[10px] font-bold px-2 py-0.5 rounded-full ${offer.badgeColor}`}>
                    {offer.badge}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 bg-[#eff4ff] p-2 rounded-lg font-metric text-[11px]">
                  <div>
                    <span className="text-[#75777e] block text-[10px]">Indicative Rate</span>
                    <span className="font-bold text-[#0b1c30]">{offer.rate}</span>
                  </div>
                  <div>
                    <span className="text-[#75777e] block text-[10px]">Sanction Odds</span>
                    <span
                      className={`font-bold ${
                        isQualified ? 'text-[#0c9488]' : 'text-[#ba1a1a]'
                      }`}
                    >
                      {offer.sanctionChance}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#75777e] block text-[10px]">Proc. Fee</span>
                    <span className="font-medium text-[#44474d]">{offer.fee}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actionable recommendations card */}
      <div className="bg-[#eff4ff] rounded-xl p-4 border border-[#dce9ff] flex flex-col gap-2.5">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#003bd6] text-[18px]">lightbulb</span>
          <span className="text-[14px] font-bold text-[#0b1c30]">Underwriter Advice & Score Optimization</span>
        </div>
        <ul className="text-[12px] text-[#44474d] space-y-1.5 list-disc pl-4 leading-relaxed">
          {result.score < 750 && (
            <li>
              Increasing tenure from {finance.tenureMonths}m to 48m or 60m reduces monthly EMI, lowering your DTI to optimal &lt;35% and boosting approval rate.
            </li>
          )}
          {finance.activeLoansPoints < 0 && (
            <li>
              Pre-closing any small active consumer loan lines will eliminate the concurrent liability penalty (+10 pts).
            </li>
          )}
          {result.isOverdue && (
            <li className="text-red-700 font-semibold">
              Crucial: Settle any reported overdue balances immediately. A single 0 DPD bureau update can lift the score by up to 110 pts!
            </li>
          )}
          <li>
            Keeping credit card utilization below 30% of authorized limits maintains healthy revolving credit velocity.
          </li>
        </ul>
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-2 pt-1">
        <button
          onClick={onEditInputs}
          type="button"
          className="w-full h-12 rounded-xl bg-[#003bd6] text-white text-[15px] font-bold flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-transform cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">tune</span>
          Tweak Loan & Finances
        </button>

        <button
          onClick={onDownloadReport}
          type="button"
          className="w-full h-12 rounded-xl bg-white border border-[#dce9ff] text-[#0b1c30] text-[15px] font-bold flex items-center justify-center gap-2 shadow-xs hover:bg-[#eff4ff] transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px] text-[#003bd6]">picture_as_pdf</span>
          Download Full Underwriting Assessment
        </button>
      </div>
    </div>
  );
};

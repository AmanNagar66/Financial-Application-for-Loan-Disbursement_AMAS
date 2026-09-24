import React, { useState } from 'react';
import { UnderwritingResult, FinanceData } from '../types';
import { formatINR } from '../utils/underwriting';

interface Step3ResultsProps {
  result: UnderwritingResult;
  finance: FinanceData;
  onEditInputs: () => void;
  onViewDecisions: () => void;
  onDownloadReport: () => void;
}

export const Step3Results: React.FC<Step3ResultsProps> = ({
  result,
  finance,
  onEditInputs,
  onViewDecisions,
  onDownloadReport,
}) => {
  const [toastVisible, setToastVisible] = useState(false);

  const handleDownloadClick = () => {
    onDownloadReport();
    setToastVisible(true);
    setTimeout(() => {
      setToastVisible(false);
    }, 3500);
  };

  // Score angle for needle:
  // 300 -> 0 deg, 900 -> 180 deg
  const needleAngle = Math.min(180, Math.max(0, ((result.score - 300) / 600) * 180));

  return (
    <div className="flex flex-col w-full space-y-4 pb-2">
      {/* Stepper (All 3 steps visual state) */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-[#e5eeff]">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 bg-[#003bd6]/20 z-0"></div>

          {/* Step 1 */}
          <button
            onClick={onEditInputs}
            className="flex items-center gap-1.5 relative z-10 cursor-pointer focus:outline-none"
            type="button"
          >
            <div className="w-8 h-8 rounded-full bg-[#003bd6] text-white flex items-center justify-center font-metric text-[11px] shadow-xs">
              <span className="material-symbols-outlined text-[16px]">check</span>
            </div>
            <span className="font-metric text-[11px] font-semibold text-[#0b1c30]">Applicant</span>
          </button>

          {/* Step 2 */}
          <button
            onClick={onEditInputs}
            className="flex items-center gap-1.5 relative z-10 cursor-pointer focus:outline-none"
            type="button"
          >
            <div className="w-8 h-8 rounded-full bg-[#003bd6] text-white flex items-center justify-center font-metric text-[11px] shadow-xs">
              <span className="material-symbols-outlined text-[16px]">check</span>
            </div>
            <span className="font-metric text-[11px] font-semibold text-[#0b1c30]">Finances</span>
          </button>

          {/* Step 3 */}
          <div className="flex items-center gap-1.5 relative z-10">
            <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-metric text-[11px] ring-4 ring-[#d6e3ff]">
              <span className="material-symbols-outlined text-[16px]">verified</span>
            </div>
            <span className="font-metric text-[11px] font-bold text-[#0b1c30]">Verdict</span>
          </div>
        </div>
      </div>

      {/* Page Title & Micro Status */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="font-metric text-[11px] px-2 py-0.5 rounded-full bg-[#dce9ff] text-[#39475f] uppercase font-semibold">
            Step 3 Assessment
          </span>
          <span className="font-metric text-[11px] text-[#44474d] flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#0c9488] animate-pulse"></span> Bureau Simulation v1.4
          </span>
        </div>
        <h2 className="text-[24px] text-[#0b1c30] font-bold leading-tight">Pre-Screener Results</h2>
        <p className="text-[13px] text-[#44474d]">
          Deterministic underwriting engine output based on submitted cashflows and risk criteria.
        </p>
      </div>

      {/* Prominent Verdict Card */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-[#e5eeff] flex flex-col gap-3.5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-1">
            <span className="font-metric text-[11px] text-[#44474d] uppercase tracking-wider">
              Underwriting Verdict
            </span>
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[15px] font-bold ${
                result.verdict === 'LIKELY APPROVED'
                  ? 'bg-[#e5eeff] text-[#0c9488]'
                  : result.verdict === 'MANUAL REVIEW'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                {result.verdict === 'LIKELY APPROVED'
                  ? 'verified_user'
                  : result.verdict === 'MANUAL REVIEW'
                  ? 'pending_actions'
                  : 'dangerous'}
              </span>
              {result.verdict}
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="font-metric text-[11px] text-[#44474d]">Risk Tier</span>
            <span
              className={`font-metric text-[12px] font-bold ${
                result.verdict === 'LIKELY APPROVED'
                  ? 'text-[#003bd6]'
                  : result.verdict === 'MANUAL REVIEW'
                  ? 'text-amber-700'
                  : 'text-red-700'
              }`}
            >
              {result.riskTier}
            </span>
          </div>
        </div>

        <p className="text-[13.5px] text-[#0b1c30] leading-relaxed">
          {result.verdictDescription}
        </p>

        {/* Score Gauge Area */}
        <div className="bg-[#eff4ff] rounded-xl p-4 flex flex-col items-center justify-center relative overflow-hidden border border-[#dce9ff]/60">
          <div className="w-full max-w-[280px] flex flex-col items-center">
            {/* Semi-circle Gauge SVG */}
            <svg className="w-full h-auto overflow-visible" viewBox="0 0 240 135">
              <defs>
                <linearGradient id="scoreGradient" x1="0%" x2="100%" y1="0%" y2="0%">
                  <stop offset="0%" stopColor="#ba1a1a" />
                  <stop offset="45%" stopColor="#f59e0b" />
                  <stop offset="70%" stopColor="#0c9488" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
                <filter id="needleShadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.3" />
                </filter>
              </defs>
              {/* Background Track */}
              <path
                d="M 20 120 A 100 100 0 0 1 220 120"
                fill="none"
                stroke="#d3e4fe"
                strokeLinecap="round"
                strokeWidth="18"
              />
              {/* Active Color Track */}
              <path
                d="M 20 120 A 100 100 0 0 1 220 120"
                fill="none"
                stroke="url(#scoreGradient)"
                strokeLinecap="round"
                strokeWidth="18"
              />
              {/* Range Markers */}
              <text className="text-[9px] fill-[#75777e] font-metric" x="16" y="133">
                300
              </text>
              <text className="text-[9px] fill-[#75777e] font-metric" x="75" y="42">
                600
              </text>
              <text className="text-[9px] fill-[#75777e] font-metric" x="160" y="42">
                720
              </text>
              <text className="text-[9px] fill-[#75777e] font-metric" textAnchor="end" x="220" y="133">
                900
              </text>
              {/* Needle Pointer */}
              <g filter="url(#needleShadow)" transform={`rotate(${needleAngle} 120 120)`}>
                <polygon fill="#0b1c30" points="120,38 123,120 117,120" />
                <circle cx="120" cy="120" fill="#0b1c30" r="9" />
                <circle cx="120" cy="120" fill="#ffffff" r="4" />
              </g>
            </svg>

            {/* Metric Display Label */}
            <div className="flex flex-col items-center -mt-2">
              <span className="font-metric text-[28px] text-[#0b1c30] font-bold">
                {result.score}{' '}
                <span className="text-[14px] font-normal text-[#44474d] font-metric">/ 900</span>
              </span>
              <span
                className={`font-metric text-[11px] font-bold tracking-wide uppercase ${
                  result.score >= 720
                    ? 'text-[#0c9488]'
                    : result.score >= 650
                    ? 'text-[#003bd6]'
                    : result.score >= 600
                    ? 'text-amber-700'
                    : 'text-red-700'
                }`}
              >
                {result.riskTierDescription}
              </span>
            </div>
          </div>

          <div className="w-full mt-3 pt-2 border-t border-[#dce9ff] flex items-center justify-between text-[#44474d]">
            <span className="font-metric text-[11px]">Bureau Engine: CIBIL Proxy</span>
            <span
              className={`font-metric text-[11px] font-medium ${
                result.score >= 720 ? 'text-[#003bd6]' : 'text-[#75777e]'
              }`}
            >
              {result.score >= 720 ? 'Prime ≥ 720 Cutoff Passed' : `Cutoff Deficit: ${720 - result.score} pts`}
            </span>
          </div>
        </div>
      </div>

      {/* 3 Core PRD Summary Metrics */}
      <div className="flex flex-col gap-2">
        <span className="text-[16px] text-[#0b1c30] font-bold">Key Underwriting Indicators</span>
        <div className="grid grid-cols-1 gap-2.5">
          {/* Metric 1: FOIR / DTI */}
          <div className="bg-white rounded-xl p-3.5 shadow-sm border border-[#e5eeff] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#eff4ff] flex items-center justify-center text-[#003bd6]">
                <span className="material-symbols-outlined text-[20px]">percent</span>
              </div>
              <div className="flex flex-col">
                <span className="font-metric text-[11px] text-[#44474d]">Debt-to-Income (FOIR)</span>
                <span className="text-[16px] font-bold text-[#0b1c30]">
                  {result.dtiRatio.toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span
                className={`font-metric text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                  result.dtiRatio <= 40
                    ? 'bg-[#eff4ff] text-[#0c9488]'
                    : result.dtiRatio <= 50
                    ? 'bg-[#dde1ff] text-[#003bd6]'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {result.dtiRatio <= 50 ? 'Safe Threshold' : 'Excess Leverage'}
              </span>
              <span className="font-metric text-[11px] text-[#44474d]">Max Allowed: ≤ 50%</span>
            </div>
          </div>

          {/* Metric 2: Estimated Monthly EMI */}
          <div className="bg-white rounded-xl p-3.5 shadow-sm border border-[#e5eeff] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#eff4ff] flex items-center justify-center text-[#003bd6]">
                <span className="material-symbols-outlined text-[20px]">payments</span>
              </div>
              <div className="flex flex-col">
                <span className="font-metric text-[11px] text-[#44474d]">Estimated Total Outflow</span>
                <span className="text-[16px] font-bold text-[#0b1c30]">
                  ₹{formatINR(result.totalOutflow)}{' '}
                  <span className="text-[12px] text-[#44474d] font-normal font-metric">/ mo</span>
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="font-metric text-[11px] font-semibold text-[#0b1c30]">
                New: ₹{formatINR(result.newEmi)}
              </span>
              <span className="font-metric text-[11px] text-[#44474d]">
                Existing: ₹{formatINR(finance.existingEmi)}
              </span>
            </div>
          </div>

          {/* Metric 3: Overdue Status */}
          <div className="bg-white rounded-xl p-3.5 shadow-sm border border-[#e5eeff] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  result.isOverdue ? 'bg-red-100 text-red-600' : 'bg-[#eff4ff] text-[#0c9488]'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {result.isOverdue ? 'report' : 'check_circle'}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-metric text-[11px] text-[#44474d]">Delinquency Record</span>
                <span
                  className={`text-[16px] font-bold ${
                    result.isOverdue ? 'text-red-700' : 'text-[#0c9488]'
                  }`}
                >
                  {result.isOverdue
                    ? 'Default / Overdue Reported'
                    : finance.repaymentTrackDelay === -35
                    ? 'Minor Delays (1-30 DPD)'
                    : 'Clean (0 DPD)'}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="font-metric text-[11px] px-2 py-0.5 rounded-full bg-[#e5eeff] text-[#0b1c30] font-semibold">
                {result.isOverdue ? 'High Risk' : 'Zero Overdue'}
              </span>
              <span className="font-metric text-[11px] text-[#44474d]">Past 36 Months</span>
            </div>
          </div>
        </div>
      </div>

      {/* Score Drivers Breakdown */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-[#e5eeff] flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[16px] text-[#0b1c30] font-bold">Bureau Score Drivers</span>
            <span className="text-[12px] text-[#44474d]">Itemized adjustments applied to base score (620)</span>
          </div>
          <div className="w-7 h-7 rounded-full bg-[#eff4ff] flex items-center justify-center text-[#44474d]">
            <span className="material-symbols-outlined text-[16px]">tune</span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {result.drivers.map((driver, index) => {
            const isPos = driver.points > 0;
            return (
              <div
                key={index}
                className="p-2.5 rounded-lg bg-[#eff4ff] flex items-center justify-between border border-[#dce9ff]/50"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`font-metric text-[11px] font-bold px-2 py-0.5 rounded min-w-[54px] text-center ${
                      isPos ? 'bg-[#e5eeff] text-[#0c9488]' : 'bg-[#ffdad6] text-[#ba1a1a]'
                    }`}
                  >
                    {isPos ? `+${driver.points}` : driver.points} pts
                  </span>
                  <div className="flex flex-col">
                    <span className="text-[13px] font-semibold text-[#0b1c30]">{driver.title}</span>
                    <span className="font-metric text-[11px] text-[#44474d]">{driver.description}</span>
                  </div>
                </div>
                <span
                  className={`material-symbols-outlined text-[18px] flex-shrink-0 ${
                    isPos ? 'text-[#0c9488]' : 'text-[#ba1a1a]'
                  }`}
                >
                  {isPos ? 'trending_up' : 'trending_down'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lender Recommendation Tiers */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-[#e5eeff] flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#003bd6] text-[20px]">account_balance</span>
            <span className="text-[16px] text-[#0b1c30] font-bold">Where Approval May Be Easier</span>
          </div>
          <span className="text-[12px] text-[#44474d]">Matched lender tiers calibrated for Score {result.score}</span>
        </div>

        {result.lenderMatches.map((match, idx) => (
          <div
            key={idx}
            className={`rounded-xl p-3.5 flex flex-col gap-2 border ${
              match.isStrongest
                ? 'bg-[#dde1ff]/40 border-[#b9c3ff]'
                : 'bg-[#eff4ff] border-[#dce9ff]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`font-metric text-[11px] font-bold px-2.5 py-0.5 rounded-full ${match.badgeClass}`}>
                {match.tag}
              </span>
              <span className="font-metric text-[11px] font-semibold text-[#003bd6]">{match.band}</span>
            </div>

            <div className="flex flex-col">
              <span className="text-[15px] font-bold text-[#0b1c30]">{match.title}</span>
              <span className="text-[12px] text-[#44474d]">{match.lenders}</span>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-black/5">
              <div className="flex flex-col">
                <span className="font-metric text-[10px] text-[#44474d]">Indicative Interest Rate</span>
                <span className="font-metric text-[12px] font-bold text-[#0b1c30]">{match.indicativeRate}</span>
              </div>
              <div
                className={`flex items-center gap-1 font-metric text-[11px] font-bold ${
                  match.statusType === 'success'
                    ? 'text-[#0c9488]'
                    : match.statusType === 'warning'
                    ? 'text-amber-700'
                    : 'text-[#003bd6]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">
                  {match.statusType === 'success'
                    ? 'thumb_up'
                    : match.statusType === 'warning'
                    ? 'warning'
                    : 'info'}
                </span>
                {match.statusBadge}
              </div>
            </div>
          </div>
        ))}

        <p className="font-metric text-[11px] text-[#75777e] italic">
          *Indicative rate ranges based on rule matrix, not binding credit sanctions. Final rates subject to underwriter review and document verification.
        </p>

        <button
          onClick={onViewDecisions}
          className="text-left py-2 px-3 rounded-lg bg-[#eff4ff] hover:bg-[#dce9ff] text-[#003bd6] font-metric text-[12px] font-bold flex items-center justify-between transition-colors"
          type="button"
        >
          <span>View Deep Decision Analysis & Bank Matrix →</span>
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </button>
      </div>

      {/* Interactive Navigation Actions */}
      <div className="flex flex-col gap-2 pt-1">
        <button
          onClick={onEditInputs}
          type="button"
          className="w-full h-12 rounded-xl bg-black text-white text-[15px] font-bold flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-transform cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">edit_note</span>
          Edit Inputs & Re-simulate
        </button>

        <button
          onClick={handleDownloadClick}
          type="button"
          className="w-full h-12 rounded-xl bg-white border border-[#dce9ff] text-[#0b1c30] text-[15px] font-bold flex items-center justify-center gap-2 shadow-xs hover:bg-[#eff4ff] transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px] text-[#003bd6]">picture_as_pdf</span>
          Download Simulated Pre-Screener PDF
        </button>
      </div>

      {/* Toast Notification */}
      <div
        className={`fixed bottom-20 left-4 right-4 max-w-md mx-auto bg-[#0b1c30] text-white px-4 py-3 rounded-xl shadow-xl flex items-center justify-between transition-all duration-300 z-50 ${
          toastVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#89f5e7] text-[20px]">check_circle</span>
          <span className="text-[13px] font-medium">Pre-Screener Report downloaded successfully.</span>
        </div>
        <button
          onClick={() => setToastVisible(false)}
          className="text-white/80 hover:text-white"
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
      </div>

      {/* PRD Disclaimer & Trust Signifier */}
      <div className="p-3.5 rounded-xl bg-[#e5eeff] flex flex-col gap-1 text-center items-center">
        <div className="flex items-center gap-1.5 text-[#44474d]">
          <span className="material-symbols-outlined text-[16px] text-[#003bd6]">verified</span>
          <span className="font-metric text-[11px] font-semibold uppercase tracking-wider">Client-Side Evaluation</span>
        </div>
        <p className="text-[12px] text-[#44474d] max-w-sm">
          PRD v1 Client-Side Prototype: All scores and recommendations are deterministic approximations. No credit bureau inquiry registered.
        </p>
      </div>
    </div>
  );
};

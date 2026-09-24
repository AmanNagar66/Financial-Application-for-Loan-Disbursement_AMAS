import React from 'react';
import { ApplicantData, FinanceData, UnderwritingResult } from '../types';
import { formatINR } from '../utils/underwriting';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicant: ApplicantData;
  finance: FinanceData;
  result: UnderwritingResult;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  applicant,
  finance,
  result,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-[#dce9ff] my-4 flex flex-col max-h-[92vh]">
        {/* Modal Top Bar */}
        <div className="p-4 bg-[#0d1c32] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#89f5e7] text-[22px]">description</span>
            <div>
              <h3 className="text-[15px] font-bold">Simulated Pre-Screener Summary</h3>
              <p className="font-metric text-[10px] text-[#76849f]">
                Report Ref: CC-{Math.floor(100000 + Math.random() * 900000)} • Date: {currentDate}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Printable Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-[#0b1c30] print:p-0">
          {/* Header Banner */}
          <div className="flex items-center justify-between border-b pb-3 border-[#e5eeff]">
            <div className="flex items-center gap-2">
              <img
                alt="CrediCheck"
                className="h-7 w-auto"
                src="https://lh3.googleusercontent.com/aida/AEtjO1US4sxre82r0TZBgyIDRFUbXEDQBgQDsbYxSZU72c3jQgulwMuwDMrQhzHuqcVBGeKlPZJLYMaWUa7OleB1oqIx2kCm_K-6Im42HUFDm2gWB1FBofCaEeHpZ-MyyJFo18IJl-sGvT1bgC53lwd43d8l0bPgCgbXq7qaLKHeLtm8MovcE526C0L1GmUCsu3-RvRioa1OCmGRxZJoLfNJ-IKwIEKr990cWm1jD73JQRx5MTD1WKfrRyB2LA"
              />
              <span className="font-bold text-[16px] text-[#0b1c30]">CrediCheck Underwriting Engine</span>
            </div>
            <span className="font-metric text-[11px] font-bold text-[#0c9488] bg-[#eff4ff] px-2 py-0.5 rounded">
              CONFIDENTIAL DEMO
            </span>
          </div>

          {/* Applicant & Score Hero */}
          <div className="grid grid-cols-2 gap-3 bg-[#eff4ff] p-3.5 rounded-xl border border-[#dce9ff]">
            <div>
              <span className="font-metric text-[10px] text-[#44474d] uppercase block">Applicant Name</span>
              <span className="font-bold text-[14px] text-[#0b1c30]">{applicant.fullName}</span>
              <span className="text-[11px] text-[#44474d] block mt-0.5">
                Age: {applicant.age} • Gender: {applicant.gender}
              </span>
              <span className="font-metric text-[11px] text-[#44474d] block">
                PAN: {applicant.panNumber}
              </span>
            </div>
            <div className="text-right">
              <span className="font-metric text-[10px] text-[#44474d] uppercase block">CIBIL Proxy Score</span>
              <div className="text-[26px] font-bold font-metric text-[#003bd6] leading-none">
                {result.score} <span className="text-[12px] font-normal text-[#44474d]">/ 900</span>
              </div>
              <span
                className={`inline-block font-metric text-[10px] font-bold px-2 py-0.5 rounded mt-1 ${
                  result.verdict === 'LIKELY APPROVED'
                    ? 'bg-emerald-100 text-emerald-800'
                    : result.verdict === 'MANUAL REVIEW'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {result.verdict}
              </span>
            </div>
          </div>

          {/* Facility Parameters */}
          <div className="border border-[#e5eeff] rounded-xl p-3 space-y-2">
            <h4 className="font-metric text-[11px] font-bold text-[#44474d] uppercase tracking-wider">
              Evaluated Facility Parameters
            </h4>
            <div className="grid grid-cols-3 gap-2 font-metric text-[12px]">
              <div>
                <span className="text-[10px] text-[#75777e] block">Requested Loan</span>
                <span className="font-bold">₹{formatINR(finance.loanAmount)}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#75777e] block">Tenure</span>
                <span className="font-bold">{finance.tenureMonths} Months</span>
              </div>
              <div>
                <span className="text-[10px] text-[#75777e] block">Estimated New EMI</span>
                <span className="font-bold text-[#003bd6]">₹{formatINR(result.newEmi)}/mo</span>
              </div>
              <div>
                <span className="text-[10px] text-[#75777e] block">Monthly In-Hand</span>
                <span className="font-bold">₹{formatINR(finance.monthlyIncome)}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#75777e] block">Existing EMI Outflow</span>
                <span className="font-bold">₹{formatINR(finance.existingEmi)}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#75777e] block">Resulting FOIR</span>
                <span className="font-bold text-[#0c9488]">{result.dtiRatio.toFixed(1)}%</span>
              </div>
            </div>
          </div>

          {/* Bureau Drivers */}
          <div className="space-y-1.5">
            <h4 className="font-metric text-[11px] font-bold text-[#44474d] uppercase tracking-wider">
              Scoring Drivers Applied
            </h4>
            <div className="grid grid-cols-2 gap-1.5 font-metric text-[11px]">
              {result.drivers.map((d, i) => (
                <div key={i} className="p-2 bg-[#eff4ff] rounded border border-[#dce9ff]/40 flex justify-between">
                  <span className="text-[#0b1c30] truncate pr-1">{d.title}</span>
                  <span className={`font-bold ${d.points > 0 ? 'text-[#0c9488]' : 'text-[#ba1a1a]'}`}>
                    {d.points > 0 ? `+${d.points}` : d.points}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Underwriter Note */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-[#44474d] leading-relaxed">
            <strong className="text-[#0b1c30]">Underwriting Assessment:</strong> {result.verdictDescription}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-3 bg-[#f8f9ff] border-t border-[#e5eeff] flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-[13px] font-semibold text-[#44474d] hover:bg-[#dce9ff]"
            type="button"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="px-5 py-2 rounded-xl bg-[#003bd6] text-white text-[13px] font-bold flex items-center gap-1.5 shadow-sm hover:bg-[#0034c0]"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">print</span>
            Print / Save as PDF
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { FinanceData, UnderwritingResult } from '../types';
import { formatINR } from '../utils/underwriting';

interface Step2FinancesProps {
  data: FinanceData;
  result: UnderwritingResult;
  onChange: (data: Partial<FinanceData>) => void;
  onRunEngine: () => void;
  onBack: () => void;
}

export const Step2Finances: React.FC<Step2FinancesProps> = ({
  data,
  result,
  onChange,
  onRunEngine,
  onBack,
}) => {
  const [isRunning, setIsRunning] = useState(false);

  const tenureOptions = [12, 24, 36, 48, 60];

  const handleRunClick = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      onRunEngine();
    }, 600);
  };

  const getTenureText = (months: number) => {
    const years = months / 12;
    return `${months} Months (${years} ${years > 1 ? 'Years' : 'Year'})`;
  };

  const dtiPercentClamped = Math.min(Math.max(result.dtiRatio, 5), 100);

  return (
    <div className="flex flex-col w-full space-y-4 pb-2">
      {/* Stepper Progress Header */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-[#e5eeff]">
        <div className="flex items-center justify-between relative mb-3">
          {/* Connecting track */}
          <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-[#dce9ff] rounded-full z-0">
            <div className="w-1/2 h-full bg-[#003bd6] rounded-full"></div>
          </div>

          {/* Step 1: Completed */}
          <button
            onClick={onBack}
            className="relative z-10 flex flex-col items-center group cursor-pointer focus:outline-none"
            type="button"
          >
            <div className="w-8 h-8 rounded-full bg-[#0c9488] text-white flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                check
              </span>
            </div>
            <span className="font-metric text-[11px] text-[#44474d] mt-1 font-semibold group-hover:text-[#003bd6]">
              Applicant
            </span>
          </button>

          {/* Step 2: Active */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-[#003bd6] text-white flex items-center justify-center shadow-md ring-4 ring-[#dde1ff]">
              <span className="font-metric text-[11px] font-bold">2</span>
            </div>
            <span className="font-metric text-[11px] text-[#003bd6] mt-1 font-bold">Finances</span>
          </div>

          {/* Step 3: Pending */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-[#dce9ff] text-[#44474d] flex items-center justify-center">
              <span className="font-metric text-[11px] font-bold">3</span>
            </div>
            <span className="font-metric text-[11px] text-[#44474d] mt-1 font-medium">Results</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div>
            <span className="inline-flex items-center gap-1 font-metric text-[11px] text-[#003bd6] font-bold uppercase tracking-wider">
              Step 2 of 2
            </span>
            <p className="text-[18px] text-[#0b1c30] font-bold">Loan & Finances</p>
          </div>
          <span className="font-metric text-[11px] text-[#44474d] text-right max-w-[130px] leading-tight">
            Amount, income & obligations
          </span>
        </div>
      </div>

      {/* Main Multi-section Form */}
      <div className="flex flex-col gap-4">
        {/* Section 1: Loan Request Details */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-[#e5eeff] flex flex-col gap-4">
          <div className="flex items-center justify-between pb-1 border-b border-[#e5eeff]">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#eff4ff] text-[#003bd6] flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">payments</span>
              </div>
              <h2 className="text-[16px] text-[#0b1c30] font-bold">Loan Request Details</h2>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-[#eff4ff] text-[#44474d] font-metric text-[11px]">
              Step 2A
            </span>
          </div>

          {/* Loan Amount Input + Range Slider */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="font-metric text-[12px] text-[#44474d] font-medium" htmlFor="loanAmountInput">
                Loan Amount Required
              </label>
              <span className="font-metric text-[11px] text-[#44474d]">Min ₹50k • Max ₹25L</span>
            </div>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-[20px] text-[#003bd6] font-bold">₹</span>
              <input
                id="loanAmountInput"
                type="number"
                min={50000}
                max={2500000}
                step={10000}
                value={data.loanAmount}
                onChange={(e) => onChange({ loanAmount: Math.max(50000, Number(e.target.value) || 50000) })}
                className="w-full pl-9 pr-4 py-2 bg-[#eff4ff] rounded-lg text-[#0b1c30] font-metric text-[26px] font-bold focus:outline-none focus:bg-white border border-transparent focus:border-[#003bd6] transition-colors"
              />
            </div>
            <input
              id="loanAmountSlider"
              type="range"
              min={50000}
              max={2500000}
              step={25000}
              value={data.loanAmount}
              onChange={(e) => onChange({ loanAmount: Number(e.target.value) })}
              className="w-full accent-[#003bd6] cursor-pointer mt-1"
            />
            <div className="flex justify-between font-metric text-[11px] text-[#75777e] px-0.5">
              <span>₹50,000</span>
              <span>₹12,75,000</span>
              <span>₹25,00,000</span>
            </div>
          </div>

          {/* Loan Tenure Selection */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="font-metric text-[12px] text-[#44474d] font-medium">Loan Tenure</label>
              <span className="font-metric text-[11px] text-[#003bd6] font-bold">
                {getTenureText(data.tenureMonths)}
              </span>
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {tenureOptions.map((m) => {
                const isActive = data.tenureMonths === m;
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => onChange({ tenureMonths: m })}
                    className={`py-2 rounded-lg font-metric text-[12px] text-center font-bold transition-all ${
                      isActive
                        ? 'bg-[#003bd6] text-white shadow-sm'
                        : 'bg-[#eff4ff] text-[#44474d] hover:bg-[#dce9ff]'
                    }`}
                  >
                    {m}m
                  </button>
                );
              })}
            </div>
          </div>

          {/* Loan Purpose Dropdown */}
          <div className="flex flex-col gap-1.5">
            <label className="font-metric text-[12px] text-[#44474d] font-medium" htmlFor="loanPurpose">
              Loan Purpose
            </label>
            <div className="relative">
              <select
                id="loanPurpose"
                value={data.loanPurpose}
                onChange={(e) => onChange({ loanPurpose: e.target.value })}
                className="w-full appearance-none bg-[#eff4ff] text-[#0b1c30] py-2.5 px-3.5 pr-10 rounded-lg text-[14px] font-semibold focus:outline-none focus:bg-white border border-transparent focus:border-[#003bd6] cursor-pointer"
              >
                <option value="Personal">Personal Expenses / Lifestyle</option>
                <option value="Home">Home Renovation & Furnishing</option>
                <option value="Vehicle">Two / Four Wheeler Purchase</option>
                <option value="Education">Higher Education & Courses</option>
                <option value="Business">Small Business Working Capital</option>
                <option value="Medical">Medical Treatment & Care</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#75777e] text-[20px]">
                expand_more
              </span>
            </div>
          </div>

          {/* Real-time Estimated EMI Banner */}
          <div className="bg-[#dce9ff] rounded-xl p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#dde1ff] flex items-center justify-center text-[#003bd6]">
                <span className="material-symbols-outlined text-[20px]">calculate</span>
              </div>
              <div>
                <span className="font-metric text-[11px] text-[#44474d] font-medium block">
                  Estimated New EMI
                </span>
                <span className="font-metric text-[24px] text-[#003bd6] font-bold leading-none">
                  ~₹{formatINR(result.newEmi)}
                </span>
                <span className="font-metric text-[11px] text-[#44474d]"> /mo</span>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-block px-2 py-0.5 rounded bg-white font-metric text-[11px] text-[#0b1c30] font-semibold shadow-xs">
                @ 11.5% p.a.
              </span>
              <span className="block font-metric text-[11px] text-[#44474d] mt-0.5">Indicative rate</span>
            </div>
          </div>
        </div>

        {/* Section 2: Financial & Repayment Baseline */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-[#e5eeff] flex flex-col gap-4">
          <div className="flex items-center justify-between pb-1 border-b border-[#e5eeff]">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#eff4ff] text-[#003bd6] flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">account_balance</span>
              </div>
              <h2 className="text-[16px] text-[#0b1c30] font-bold">Financial Baseline</h2>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-[#eff4ff] text-[#44474d] font-metric text-[11px]">
              Step 2B
            </span>
          </div>

          {/* Monthly In-Hand Income */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="font-metric text-[12px] text-[#44474d] font-medium" htmlFor="monthlyIncome">
                Monthly In-Hand Income <span className="text-red-600 font-bold">*</span>
              </label>
              <span className="font-metric text-[11px] text-[#0c9488] font-semibold">Net Bank Credit</span>
            </div>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-[18px] text-[#0b1c30] font-bold">₹</span>
              <input
                id="monthlyIncome"
                type="number"
                min={5000}
                step={5000}
                value={data.monthlyIncome}
                onChange={(e) => onChange({ monthlyIncome: Math.max(1000, Number(e.target.value) || 1000) })}
                className="w-full pl-9 pr-4 py-2.5 bg-[#eff4ff] rounded-lg text-[#0b1c30] font-metric text-[18px] font-bold focus:outline-none focus:bg-white border border-transparent focus:border-[#003bd6] transition-colors"
              />
            </div>
          </div>

          {/* Employment Type Segmented Options */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="font-metric text-[12px] text-[#44474d] font-medium">Employment Type</label>
              <span className="font-metric text-[11px] text-[#0c9488] font-bold bg-[#e5eeff] px-2 py-0.5 rounded">
                {data.employmentType === 'salaried'
                  ? '+25 pts'
                  : data.employmentType === 'self'
                  ? '+5 pts'
                  : '-60 pts'}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => onChange({ employmentType: 'salaried' })}
                className={`py-2 px-1 rounded-lg font-metric text-[12px] font-bold text-center transition-all flex flex-col items-center ${
                  data.employmentType === 'salaried'
                    ? 'bg-[#003bd6] text-white shadow-sm'
                    : 'bg-[#eff4ff] text-[#44474d] hover:bg-[#dce9ff]'
                }`}
              >
                <span>Salaried</span>
                <span className="text-[10px] opacity-80">+25 pts</span>
              </button>
              <button
                type="button"
                onClick={() => onChange({ employmentType: 'self' })}
                className={`py-2 px-1 rounded-lg font-metric text-[12px] font-bold text-center transition-all flex flex-col items-center ${
                  data.employmentType === 'self'
                    ? 'bg-[#003bd6] text-white shadow-sm'
                    : 'bg-[#eff4ff] text-[#44474d] hover:bg-[#dce9ff]'
                }`}
              >
                <span>Self-emp</span>
                <span className="text-[10px] opacity-80">+5 pts</span>
              </button>
              <button
                type="button"
                onClick={() => onChange({ employmentType: 'unemployed' })}
                className={`py-2 px-1 rounded-lg font-metric text-[12px] font-bold text-center transition-all flex flex-col items-center ${
                  data.employmentType === 'unemployed'
                    ? 'bg-[#003bd6] text-white shadow-sm'
                    : 'bg-[#eff4ff] text-[#44474d] hover:bg-[#dce9ff]'
                }`}
              >
                <span>Student/None</span>
                <span className="text-[10px] opacity-80">-60 pts</span>
              </button>
            </div>
          </div>

          {/* Existing EMI Outflow */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="font-metric text-[12px] text-[#44474d] font-medium" htmlFor="existingEmi">
                Existing EMI Outflow (₹/month)
              </label>
              <span className="font-metric text-[11px] text-[#44474d]">Active loans & cards</span>
            </div>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-[18px] text-[#0b1c30] font-bold">₹</span>
              <input
                id="existingEmi"
                type="number"
                min={0}
                step={1000}
                value={data.existingEmi}
                onChange={(e) => onChange({ existingEmi: Math.max(0, Number(e.target.value) || 0) })}
                className="w-full pl-9 pr-4 py-2.5 bg-[#eff4ff] rounded-lg text-[#0b1c30] font-metric text-[18px] font-bold focus:outline-none focus:bg-white border border-transparent focus:border-[#003bd6] transition-colors"
              />
            </div>
          </div>

          {/* Pending / Overdue Payments */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="font-metric text-[12px] text-[#44474d] font-medium" htmlFor="delaySelect">
                Repayment Track Record
              </label>
              <span
                className={`font-metric text-[11px] font-bold px-2 py-0.5 rounded ${
                  data.repaymentTrackDelay === 25
                    ? 'text-[#0c9488] bg-[#e5eeff]'
                    : data.repaymentTrackDelay === -35
                    ? 'text-amber-700 bg-amber-100'
                    : 'text-red-700 bg-red-100'
                }`}
              >
                {data.repaymentTrackDelay > 0 ? `+${data.repaymentTrackDelay}` : data.repaymentTrackDelay} pts
              </span>
            </div>
            <div className="relative">
              <select
                id="delaySelect"
                value={data.repaymentTrackDelay}
                onChange={(e) => onChange({ repaymentTrackDelay: Number(e.target.value) })}
                className="w-full appearance-none bg-[#eff4ff] text-[#0b1c30] py-2.5 px-3.5 pr-10 rounded-lg text-[13px] font-semibold focus:outline-none focus:bg-white border border-transparent focus:border-[#003bd6] cursor-pointer"
              >
                <option value={25}>Clean record (No delays in 24m) [+25 pts]</option>
                <option value={-35}>Minor past delays (1-30 days past due) [-35 pts]</option>
                <option value={-110}>Currently overdue / Default reported [-110 pts]</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#75777e] text-[20px]">
                expand_more
              </span>
            </div>
            {data.repaymentTrackDelay <= -100 && (
              <p className="text-red-600 text-[12px] flex items-center gap-1 mt-1">
                <span className="material-symbols-outlined text-[16px]">warning</span>
                Active overdues trigger stringent risk rejection or heavy covenants.
              </p>
            )}
          </div>

          {/* Credit History & Active Loans Grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Years of Credit History */}
            <div className="flex flex-col gap-1.5">
              <label className="font-metric text-[12px] text-[#44474d] font-medium">Credit Age</label>
              <div className="flex flex-col gap-1">
                {[
                  { pts: 45, label: '5+ yrs' },
                  { pts: 15, label: '2-5 yrs' },
                  { pts: -30, label: '< 2 yrs' },
                ].map((item) => {
                  const isActive = data.creditAgePoints === item.pts;
                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => onChange({ creditAgePoints: item.pts })}
                      className={`py-1.5 px-2.5 rounded-lg font-metric text-[11px] font-bold text-left flex justify-between items-center transition-all ${
                        isActive
                          ? 'bg-[#003bd6] text-white'
                          : 'bg-[#eff4ff] text-[#44474d] hover:bg-[#dce9ff]'
                      }`}
                    >
                      <span>{item.label}</span>
                      <span className="text-[10px] opacity-80">{item.pts > 0 ? `+${item.pts}` : item.pts}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Existing Active Loans Counter */}
            <div className="flex flex-col gap-1.5">
              <label className="font-metric text-[12px] text-[#44474d] font-medium">Active Loans</label>
              <div className="flex flex-col gap-1">
                {[
                  { pts: 10, label: '0 loans' },
                  { pts: -5, label: '1-2 loans' },
                  { pts: -25, label: '3+ loans' },
                ].map((item) => {
                  const isActive = data.activeLoansPoints === item.pts;
                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => onChange({ activeLoansPoints: item.pts })}
                      className={`py-1.5 px-2.5 rounded-lg font-metric text-[11px] font-bold text-left flex justify-between items-center transition-all ${
                        isActive
                          ? 'bg-[#003bd6] text-white'
                          : 'bg-[#eff4ff] text-[#44474d] hover:bg-[#dce9ff]'
                      }`}
                    >
                      <span>{item.label}</span>
                      <span className="text-[10px] opacity-80">{item.pts > 0 ? `+${item.pts}` : item.pts}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Calculated Pre-check metric card */}
        <div className="bg-[#0d1c32] text-white rounded-xl p-4 shadow-md flex flex-col gap-3 relative overflow-hidden">
          {/* Ambient decorative glow */}
          <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-[#2354ff]/20 blur-2xl pointer-events-none"></div>

          <div className="flex items-center justify-between z-10">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#dde1ff] text-[20px]">analytics</span>
              <span className="font-metric text-[11px] text-[#76849f] uppercase font-bold tracking-wider">
                Live Underwriting Metric
              </span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-[#00201d] text-[#89f5e7] font-metric text-[11px] font-bold">
              Pre-Check
            </span>
          </div>

          {/* DTI / FOIR Ratio breakdown */}
          <div className="flex items-end justify-between z-10 pt-1">
            <div>
              <span className="text-[12px] text-[#76849f] block">Calculated DTI / FOIR Burden</span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="font-metric text-[26px] text-white font-bold leading-none">
                  {result.dtiRatio.toFixed(1)}%
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full font-metric text-[11px] font-semibold ${
                    result.dtiStatus === 'optimal'
                      ? 'bg-[#0c9488]/30 text-[#89f5e7]'
                      : result.dtiStatus === 'moderate'
                      ? 'bg-[#2354ff]/30 text-[#dde1ff]'
                      : 'bg-red-500/30 text-red-200'
                  }`}
                >
                  {result.dtiStatusLabel}
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="font-metric text-[11px] text-[#76849f] block">Total Outflow</span>
              <span className="font-metric text-[14px] text-white font-bold">
                ₹{formatINR(result.totalOutflow)}/mo
              </span>
            </div>
          </div>

          {/* Visual progress track for DTI */}
          <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden z-10">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                result.dtiStatus === 'optimal'
                  ? 'bg-[#6bd8cb]'
                  : result.dtiStatus === 'moderate'
                  ? 'bg-[#2354ff]'
                  : 'bg-red-500'
              }`}
              style={{ width: `${dtiPercentClamped}%` }}
            ></div>
          </div>

          {/* Engine Baseline Score Tag */}
          <div className="flex items-center justify-between pt-1 z-10 font-metric text-[11px] text-[#76849f]">
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px] text-[#89f5e7]">model_training</span>
              <span>
                Engine Baseline: <strong className="text-white font-bold">620 pts</strong>
              </span>
            </div>
            <span className="font-bold text-[#dde1ff]">Simulated: ~{result.score} pts</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 mt-1">
          <button
            onClick={handleRunClick}
            disabled={isRunning}
            type="button"
            className="w-full py-3.5 px-4 rounded-xl bg-[#003bd6] hover:bg-[#0034c0] active:scale-[0.99] text-white text-[15px] font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-80"
          >
            {isRunning ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[20px]">sync</span>
                <span>Evaluating Underwriting Rules...</span>
              </>
            ) : (
              <>
                <span>Run Risk Scoring & Decision Engine</span>
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </>
            )}
          </button>

          <button
            onClick={onBack}
            type="button"
            className="w-full py-2.5 px-4 rounded-xl bg-transparent text-[#44474d] font-metric text-[12px] font-semibold hover:bg-[#dce9ff] transition-colors flex items-center justify-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span>Back to Applicant Details</span>
          </button>
        </div>

        {/* Prototype sandbox note & Trust signifiers */}
        <div className="p-3 rounded-lg bg-[#eff4ff] flex flex-col items-center text-center gap-1 border border-[#dce9ff]/60">
          <div className="flex items-center gap-1.5 text-[#44474d] font-metric text-[11px]">
            <span className="material-symbols-outlined text-[16px] text-[#0c9488]">memory</span>
            <span className="font-semibold text-[#0b1c30]">Client-Side Simulation Engine</span>
          </div>
          <p className="text-[12px] text-[#44474d] max-w-xs">
            Rule-based scoring runs 100% in client-side memory. Zero bureau footprint. No hard inquiries recorded.
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#e5eeff] text-[#44474d] font-metric text-[11px]">
              <span className="material-symbols-outlined text-[13px]">shield</span> ISO 27001
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#e5eeff] text-[#44474d] font-metric text-[11px]">
              <span className="material-symbols-outlined text-[13px]">lock</span> 256-bit AES
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

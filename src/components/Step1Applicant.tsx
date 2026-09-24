import React from 'react';
import { ApplicantData } from '../types';

interface Step1ApplicantProps {
  data: ApplicantData;
  onChange: (data: Partial<ApplicantData>) => void;
  onContinue: () => void;
}

export const Step1Applicant: React.FC<Step1ApplicantProps> = ({
  data,
  onChange,
  onContinue,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onContinue();
  };

  const handlePanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toUpperCase().slice(0, 10);
    onChange({ panNumber: val });
  };

  return (
    <div className="flex flex-col w-full space-y-4 pb-2">
      {/* Stepper Header */}
      <section className="flex flex-col pt-1">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#e5eeff] text-[#003bd6] font-metric text-[11px] font-semibold">
            <span className="material-symbols-outlined text-[14px]">edit_note</span>
            PRD Workflow v1
          </span>
          <span className="font-metric text-[11px] text-[#003bd6] font-bold">Step 1 of 2</span>
        </div>

        <div className="mt-2.5">
          <h1 className="text-[24px] text-[#0b1c30] font-bold leading-tight">Applicant Details</h1>
          <p className="text-[13px] text-[#44474d] mt-0.5">
            Step 1 of 2: Personal identity information for credit scoring
          </p>
        </div>

        {/* Progress Stepper Indicator */}
        <div className="mt-3.5 p-3 rounded-xl bg-white shadow-xs border border-[#dce9ff]/60 flex flex-col">
          <div className="flex items-center justify-between text-center relative">
            {/* Step 1 */}
            <div className="flex flex-col items-center flex-1 z-10">
              <div className="w-7 h-7 rounded-full bg-[#003bd6] text-white font-metric text-[11px] font-bold flex items-center justify-center shadow-xs">
                1
              </div>
              <span className="font-metric text-[11px] font-bold text-[#003bd6] mt-1">1. Personal</span>
            </div>

            <div className="w-8 h-0.5 bg-[#d3e4fe] self-center -mt-3.5"></div>

            {/* Step 2 */}
            <div className="flex flex-col items-center flex-1 z-10">
              <div className="w-7 h-7 rounded-full bg-[#dce9ff] text-[#44474d] font-metric text-[11px] font-bold flex items-center justify-center">
                2
              </div>
              <span className="font-metric text-[11px] text-[#44474d] mt-1">2. Loan & Finances</span>
            </div>

            <div className="w-8 h-0.5 bg-[#d3e4fe] self-center -mt-3.5"></div>

            {/* Step 3 */}
            <div className="flex flex-col items-center flex-1 z-10">
              <div className="w-7 h-7 rounded-full bg-[#dce9ff] text-[#44474d] font-metric text-[11px] font-bold flex items-center justify-center">
                3
              </div>
              <span className="font-metric text-[11px] text-[#44474d] mt-1">Results</span>
            </div>
          </div>
        </div>
      </section>

      {/* Prominent Prototype Disclaimer Banner */}
      <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-900 flex items-start gap-2.5 shadow-xs">
        <span className="material-symbols-outlined text-amber-600 text-[20px] flex-shrink-0 mt-0.5">
          warning
        </span>
        <div className="flex flex-col space-y-0.5">
          <span className="font-metric text-[11px] font-bold uppercase tracking-wider text-amber-800">
            PROTOTYPE DEMO V1
          </span>
          <p className="text-[12px] leading-snug text-amber-900">
            Rule-based simulation only. No real bureau pull or UIDAI/NSDL check. Please do not enter real Aadhaar/PAN.
          </p>
        </div>
      </div>

      {/* Form Fields: Applicant Details */}
      <section className="p-4 rounded-xl bg-white shadow-sm border border-[#e5eeff] flex flex-col space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#e5eeff]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#eff4ff] flex items-center justify-center text-[#003bd6]">
              <span className="material-symbols-outlined text-[18px]">person</span>
            </div>
            <h2 className="text-[16px] text-[#0b1c30] font-semibold">Personal Information</h2>
          </div>
          <span className="font-metric text-[11px] text-[#44474d]">* Required fields</span>
        </div>

        <form className="flex flex-col space-y-3.5" onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="flex flex-col space-y-1">
            <label className="font-metric text-[11px] text-[#0b1c30] font-semibold flex items-center justify-between" htmlFor="fullName">
              <span>
                Full Name <span className="text-red-600">*</span>
              </span>
              <span className="font-metric text-[11px] text-[#44474d] font-normal">Text</span>
            </label>
            <div className="relative flex items-center">
              <input
                id="fullName"
                type="text"
                required
                value={data.fullName}
                onChange={(e) => onChange({ fullName: e.target.value })}
                placeholder="e.g. Aarav Mehta"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#eff4ff] border border-transparent focus:border-[#003bd6] focus:bg-white text-[14px] text-[#0b1c30] font-medium transition-all focus:outline-none pr-9"
              />
              <span className="absolute right-3 material-symbols-outlined text-[#75777e] text-[18px] pointer-events-none">
                badge
              </span>
            </div>
          </div>

          {/* Age & Gender Grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Age */}
            <div className="flex flex-col space-y-1">
              <label className="font-metric text-[11px] text-[#0b1c30] font-semibold flex items-center justify-between" htmlFor="applicantAge">
                <span>
                  Age <span className="text-red-600">*</span>
                </span>
                <span className="font-metric text-[11px] text-[#44474d] font-normal">Years</span>
              </label>
              <div className="relative flex items-center">
                <input
                  id="applicantAge"
                  type="number"
                  min="18"
                  max="100"
                  required
                  value={data.age}
                  onChange={(e) => onChange({ age: Math.max(18, Number(e.target.value) || 18) })}
                  placeholder="e.g. 29"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#eff4ff] border border-transparent focus:border-[#003bd6] focus:bg-white text-[14px] text-[#0b1c30] font-medium transition-all focus:outline-none pr-9"
                />
                <span className="absolute right-3 material-symbols-outlined text-[#75777e] text-[18px] pointer-events-none">
                  cake
                </span>
              </div>
            </div>

            {/* Gender Dropdown */}
            <div className="flex flex-col space-y-1">
              <label className="font-metric text-[11px] text-[#0b1c30] font-semibold" htmlFor="applicantGender">
                Gender <span className="text-red-600">*</span>
              </label>
              <div className="relative flex items-center">
                <select
                  id="applicantGender"
                  value={data.gender}
                  onChange={(e) => onChange({ gender: e.target.value })}
                  className="w-full appearance-none px-3.5 py-2.5 rounded-lg bg-[#eff4ff] border border-transparent focus:border-[#003bd6] focus:bg-white text-[14px] text-[#0b1c30] font-medium pr-8 transition-all focus:outline-none cursor-pointer"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
                <span className="pointer-events-none absolute right-2.5 material-symbols-outlined text-[#75777e] text-[18px]">
                  expand_more
                </span>
              </div>
            </div>
          </div>

          {/* Aadhaar number */}
          <div className="flex flex-col space-y-1">
            <div className="flex items-center justify-between">
              <label className="font-metric text-[11px] text-[#0b1c30] font-semibold" htmlFor="aadhaarNumber">
                Aadhaar Number
              </label>
              <span className="font-metric text-[11px] text-[#0c9488] font-semibold">Masked demo format</span>
            </div>
            <div className="relative flex items-center">
              <input
                id="aadhaarNumber"
                type="text"
                maxLength={14}
                value={data.aadhaarNumber}
                onChange={(e) => onChange({ aadhaarNumber: e.target.value })}
                placeholder="XXXX-XXXX-4819"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#eff4ff] border border-transparent focus:border-[#003bd6] focus:bg-white font-metric text-[13px] tracking-wider text-[#0b1c30] font-bold transition-all focus:outline-none pr-9"
              />
              <span className="absolute right-3 material-symbols-outlined text-[#75777e] text-[18px] pointer-events-none">
                fingerprint
              </span>
            </div>
            <span className="font-metric text-[11px] text-[#44474d]">Masked demo only, not verified with UIDAI</span>
          </div>

          {/* PAN number */}
          <div className="flex flex-col space-y-1">
            <div className="flex items-center justify-between">
              <label className="font-metric text-[11px] text-[#0b1c30] font-semibold" htmlFor="panNumber">
                PAN Number
              </label>
              <span className="font-metric text-[11px] text-[#003bd6] font-semibold">Demo format</span>
            </div>
            <div className="relative flex items-center">
              <input
                id="panNumber"
                type="text"
                maxLength={10}
                value={data.panNumber}
                onChange={handlePanChange}
                placeholder="ABCDE1234F"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#eff4ff] border border-transparent focus:border-[#003bd6] focus:bg-white font-metric text-[13px] tracking-wider uppercase text-[#0b1c30] font-bold transition-all focus:outline-none pr-9"
              />
              <span className="absolute right-3 material-symbols-outlined text-[#75777e] text-[18px] pointer-events-none">
                credit_card
              </span>
            </div>
            <span className="font-metric text-[11px] text-[#44474d]">10-character alphanumeric PAN identifier (uppercase)</span>
          </div>

          {/* City (Optional) */}
          <div className="flex flex-col space-y-1">
            <div className="flex items-center justify-between">
              <label className="font-metric text-[11px] text-[#0b1c30] font-semibold" htmlFor="applicantCity">
                City
              </label>
              <span className="font-metric text-[11px] text-[#44474d]">Optional</span>
            </div>
            <div className="relative flex items-center">
              <input
                id="applicantCity"
                type="text"
                value={data.city}
                onChange={(e) => onChange({ city: e.target.value })}
                placeholder="e.g. Bengaluru, Karnataka"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#eff4ff] border border-transparent focus:border-[#003bd6] focus:bg-white text-[14px] text-[#0b1c30] font-medium transition-all focus:outline-none pr-9"
              />
              <span className="absolute right-3 material-symbols-outlined text-[#75777e] text-[18px] pointer-events-none">
                location_city
              </span>
            </div>
          </div>
        </form>
      </section>

      {/* Micro Info Pill */}
      <div className="p-3 rounded-xl bg-[#eff4ff] flex items-center gap-3 border border-[#dce9ff]/60">
        <div className="w-8 h-8 rounded-lg bg-[#dce9ff] flex items-center justify-center text-[#003bd6] flex-shrink-0">
          <span className="material-symbols-outlined text-[18px]">info</span>
        </div>
        <p className="text-[12px] text-[#44474d] leading-relaxed">
          In Step 2, you'll specify your loan amount requirement, tenure, monthly in-hand salary, and existing debt obligations to simulate underwriting.
        </p>
      </div>

      {/* Security & Privacy Note */}
      <div className="p-3.5 rounded-xl bg-white border border-[#dce9ff] flex items-start gap-2.5 text-[#44474d] shadow-xs">
        <span className="material-symbols-outlined text-[20px] text-[#0c9488] flex-shrink-0 mt-0.5">
          verified_user
        </span>
        <p className="text-[12px] text-[#44474d] leading-relaxed">
          <strong className="text-[#0b1c30] font-semibold">Security & Privacy:</strong> No data is persisted. All evaluation runs client-side in your browser.
        </p>
      </div>

      {/* Primary Action Section (CTA) */}
      <div className="pt-1 pb-2 flex flex-col space-y-2">
        <button
          onClick={onContinue}
          type="button"
          className="w-full py-3.5 rounded-xl bg-[#003bd6] hover:bg-[#0034c0] active:scale-[0.99] text-white flex items-center justify-between px-5 shadow-md hover:shadow-lg transition-all"
        >
          <div className="flex flex-col text-left">
            <span className="text-[15px] font-bold text-white leading-tight">
              Continue to Loan & Financial Details →
            </span>
            <span className="font-metric text-[11px] text-[#e5e6ff] mt-0.5">
              Step 2: Enter loan request and income details
            </span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-white text-[20px]">arrow_forward</span>
          </div>
        </button>

        <div className="flex items-center justify-center gap-1.5 text-[#44474d] font-metric text-[11px] pt-1">
          <span className="material-symbols-outlined text-[13px] text-[#0c9488]">check_circle</span>
          <span>Simulated rule engine • Zero bureau impact • Fully sandboxed</span>
        </div>
      </div>
    </div>
  );
};

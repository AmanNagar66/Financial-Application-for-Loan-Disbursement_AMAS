import React from 'react';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-[#dce9ff] flex flex-col max-h-[85vh]">
        <div className="p-4 bg-[#0d1c32] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#89f5e7] text-[20px]">shield</span>
            <h3 className="text-[15px] font-bold">CrediCheck Simulation Architecture</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="p-4 space-y-3.5 overflow-y-auto text-[13px] text-[#44474d] leading-relaxed">
          <div>
            <h4 className="font-bold text-[#0b1c30] text-[14px]">Zero Bureau Footprint</h4>
            <p className="mt-0.5">
              This engine runs 100% in-browser client memory. No real credit pulls (hard inquiries) are triggered with CIBIL, Experian, Equifax, or CRIF High Mark.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-[#0b1c30] text-[14px]">Deterministic Score Calibration</h4>
            <p className="mt-0.5">
              Base anchor (620) is combined with itemized risk drivers:
            </p>
            <ul className="list-disc pl-4 mt-1 space-y-1 font-metric text-[11px]">
              <li>Credit Vintage (≥5 yrs: +45, 2-5 yrs: +15, &lt;2 yrs: -30)</li>
              <li>Repayment Discipline (Clean: +25, Minor: -35, Overdue: -110)</li>
              <li>Employment (Salaried: +25, Self-emp: +5, Student: -60)</li>
              <li>Debt Burden FOIR (&lt;35%: +15, 35-50%: -10, &gt;50%: -45)</li>
              <li>Active Credit Lines (0: +10, 1-2: -5, 3+: -25)</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[#0b1c30] text-[14px]">Underwriting FOIR Formula</h4>
            <p className="mt-0.5 font-metric text-[11px] bg-[#eff4ff] p-2 rounded">
              FOIR = (New EMI @ 11.5% p.a. + Existing Outflow) / Monthly Income
            </p>
            <p className="mt-1">
              Indian banking regulations benchmark standard unsecured personal loans to a maximum 50% FOIR cap.
            </p>
          </div>

          <div className="pt-2 border-t border-[#e5eeff]">
            <span className="font-metric text-[10px] text-[#75777e] uppercase block">Compliance Certification</span>
            <span className="text-[12px] font-semibold text-[#0c9488]">
              Simulated under ISO 27001 data isolation & RBI digital lending guidelines sandbox.
            </span>
          </div>
        </div>

        <div className="p-3 bg-[#f8f9ff] border-t border-[#e5eeff] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#003bd6] text-white text-[13px] font-bold"
            type="button"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { ApplicantData, FinanceData } from '../types';

interface PresetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPreset: (applicant: ApplicantData, finance: FinanceData) => void;
}

export const PresetModal: React.FC<PresetModalProps> = ({
  isOpen,
  onClose,
  onSelectPreset,
}) => {
  if (!isOpen) return null;

  const presets: {
    name: string;
    description: string;
    tag: string;
    applicant: ApplicantData;
    finance: FinanceData;
  }[] = [
    {
      name: 'Aarav Mehta (PRD Default)',
      description: 'Salaried IT professional, ₹75k income, ₹5L loan, clean repayment track.',
      tag: 'Prime ~745',
      applicant: {
        fullName: 'Aarav Mehta',
        age: 29,
        gender: 'Male',
        aadhaarNumber: 'XXXX-XXXX-4819',
        panNumber: 'ABCDE1234F',
        city: 'Bengaluru, Karnataka',
      },
      finance: {
        loanAmount: 500000,
        tenureMonths: 36,
        loanPurpose: 'Personal',
        monthlyIncome: 75000,
        employmentType: 'salaried',
        existingEmi: 12500,
        repaymentTrackDelay: 25,
        creditAgePoints: 45,
        activeLoansPoints: -5,
      },
    },
    {
      name: 'Pooja Sharma (Super-Prime)',
      description: 'Senior Director, ₹1,80k income, zero existing EMI, 7+ yrs credit history.',
      tag: 'Super-Prime ~820',
      applicant: {
        fullName: 'Pooja Sharma',
        age: 36,
        gender: 'Female',
        aadhaarNumber: 'XXXX-XXXX-9128',
        panNumber: 'BKDPS8821K',
        city: 'Mumbai, Maharashtra',
      },
      finance: {
        loanAmount: 1200000,
        tenureMonths: 48,
        loanPurpose: 'Home',
        monthlyIncome: 180000,
        employmentType: 'salaried',
        existingEmi: 0,
        repaymentTrackDelay: 25,
        creditAgePoints: 45,
        activeLoansPoints: 10,
      },
    },
    {
      name: 'Rohan Verma (Overdue Delinquency)',
      description: 'Self-employed, reported overdue balance (-110 pts), triggers risk hard block.',
      tag: 'Declined ~510',
      applicant: {
        fullName: 'Rohan Verma',
        age: 32,
        gender: 'Male',
        aadhaarNumber: 'XXXX-XXXX-3341',
        panNumber: 'CFGPV4421L',
        city: 'New Delhi, NCR',
      },
      finance: {
        loanAmount: 600000,
        tenureMonths: 24,
        loanPurpose: 'Business',
        monthlyIncome: 65000,
        employmentType: 'self',
        existingEmi: 22000,
        repaymentTrackDelay: -110,
        creditAgePoints: 15,
        activeLoansPoints: -25,
      },
    },
    {
      name: 'Kavya Nair (Thin File / First-Time)',
      description: 'Age 22, student / newly graduated, thin credit history (<2 yrs).',
      tag: 'Near-Prime ~635',
      applicant: {
        fullName: 'Kavya Nair',
        age: 22,
        gender: 'Female',
        aadhaarNumber: 'XXXX-XXXX-7102',
        panNumber: 'AALPK5190M',
        city: 'Kochi, Kerala',
      },
      finance: {
        loanAmount: 200000,
        tenureMonths: 24,
        loanPurpose: 'Education',
        monthlyIncome: 45000,
        employmentType: 'salaried',
        existingEmi: 5000,
        repaymentTrackDelay: 25,
        creditAgePoints: -30,
        activeLoansPoints: 10,
      },
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-[#dce9ff] flex flex-col">
        <div className="p-4 bg-[#0d1c32] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#89f5e7] text-[20px]">switch_account</span>
            <h3 className="text-[15px] font-bold">Simulated Borrower Presets</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="p-4 space-y-2.5 max-h-[75vh] overflow-y-auto">
          <p className="text-[12px] text-[#44474d] mb-1">
            Choose a pre-configured applicant scenario to test different rule engine branches and underwriting verdicts:
          </p>

          {presets.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                onSelectPreset(p.applicant, p.finance);
                onClose();
              }}
              className="w-full text-left p-3 rounded-xl border border-[#e5eeff] hover:border-[#003bd6] hover:bg-[#eff4ff] transition-all flex flex-col gap-1 cursor-pointer group"
              type="button"
            >
              <div className="flex items-center justify-between">
                <span className="text-[14px] font-bold text-[#0b1c30] group-hover:text-[#003bd6]">
                  {p.name}
                </span>
                <span className="font-metric text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#dde1ff] text-[#003bd6]">
                  {p.tag}
                </span>
              </div>
              <p className="text-[12px] text-[#44474d]">{p.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

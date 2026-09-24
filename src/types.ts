export interface ApplicantData {
  fullName: string;
  age: number;
  gender: string;
  aadhaarNumber: string;
  panNumber: string;
  city: string;
}

export type EmploymentType = 'salaried' | 'self' | 'unemployed';

export interface FinanceData {
  loanAmount: number;
  tenureMonths: number;
  loanPurpose: string;
  monthlyIncome: number;
  employmentType: EmploymentType;
  existingEmi: number;
  repaymentTrackDelay: number; // 25: clean, -35: minor, -110: overdue
  creditAgePoints: number; // 45: 5+ yrs, 15: 2-5 yrs, -30: < 2 yrs
  activeLoansPoints: number; // 10: 0 loans, -5: 1-2 loans, -25: 3+ loans
}

export interface ScoreDriver {
  title: string;
  description: string;
  points: number;
  isPositive: boolean;
  category: string;
}

export interface LenderMatch {
  tag: string;
  badgeClass: string;
  band: string;
  title: string;
  lenders: string;
  indicativeRate: string;
  statusBadge: string;
  statusType: 'success' | 'warning' | 'info';
  isStrongest?: boolean;
}

export interface UnderwritingResult {
  score: number;
  verdict: 'LIKELY APPROVED' | 'MANUAL REVIEW' | 'DECLINED / HIGH RISK';
  verdictDescription: string;
  riskTier: string;
  riskTierDescription: string;
  newEmi: number;
  totalOutflow: number;
  dtiRatio: number;
  dtiStatus: 'optimal' | 'moderate' | 'high';
  dtiStatusLabel: string;
  drivers: ScoreDriver[];
  lenderMatches: LenderMatch[];
  isOverdue: boolean;
}

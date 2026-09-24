import { ApplicantData, FinanceData, UnderwritingResult, ScoreDriver, LenderMatch } from '../types';

export const ANNUAL_INTEREST_RATE = 11.5;

export function formatINR(val: number): string {
  return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(Math.round(val));
}

export function calculateEMI(principal: number, tenureMonths: number, annualRate: number = ANNUAL_INTEREST_RATE): number {
  if (principal <= 0 || tenureMonths <= 0) return 0;
  const r = (annualRate / 12) / 100;
  const num = principal * r * Math.pow(1 + r, tenureMonths);
  const den = Math.pow(1 + r, tenureMonths) - 1;
  return Math.round(num / den);
}

export function calculateUnderwriting(applicant: ApplicantData, finance: FinanceData): UnderwritingResult {
  const principal = Math.max(10000, finance.loanAmount);
  const tenure = Math.max(6, finance.tenureMonths);
  const newEmi = calculateEMI(principal, tenure);
  const existingEmi = Math.max(0, finance.existingEmi);
  const totalOutflow = newEmi + existingEmi;
  const income = Math.max(1000, finance.monthlyIncome);
  const dtiRatio = (totalOutflow / income) * 100;

  // DTI Status
  let dtiStatus: 'optimal' | 'moderate' | 'high' = 'optimal';
  let dtiStatusLabel = 'Optimal (<40%)';
  let dtiPoints = 15;
  let dtiDriverText = 'Low leverage (<35% income utilized)';

  if (dtiRatio > 50) {
    dtiStatus = 'high';
    dtiStatusLabel = 'High DTI (>50%)';
    dtiPoints = -45;
    dtiDriverText = `Exceeds prudential threshold (>50%) at ${dtiRatio.toFixed(1)}%`;
  } else if (dtiRatio >= 35) {
    dtiStatus = 'moderate';
    dtiStatusLabel = 'Moderate (Safe <50%)';
    dtiPoints = -10;
    dtiDriverText = `Falls into moderate 35%–50% leverage band (${dtiRatio.toFixed(1)}%)`;
  } else {
    dtiStatus = 'optimal';
    dtiStatusLabel = 'Optimal (<40%)';
    dtiPoints = 15;
    dtiDriverText = `Conservative leverage under 35% (${dtiRatio.toFixed(1)}%)`;
  }

  // Age points
  let agePoints = 10;
  let ageDescription = `Age ${applicant.age} within optimal 23–55 standard band`;
  if (applicant.age < 23) {
    agePoints = -10;
    ageDescription = `Age ${applicant.age} under young borrower threshold (<23)`;
  } else if (applicant.age > 58) {
    agePoints = -15;
    ageDescription = `Age ${applicant.age} near or above retirement age window`;
  }

  // Employment points
  let empPoints = 25;
  let empDescription = 'Confirmed full-time salaried applicant';
  if (finance.employmentType === 'self') {
    empPoints = 5;
    empDescription = 'Self-employed applicant with regular bank credit';
  } else if (finance.employmentType === 'unemployed') {
    empPoints = -60;
    empDescription = 'Student / unverified non-salaried income flow';
  }

  // Repayment points
  let repaymentPoints = finance.repaymentTrackDelay;
  let repaymentDescription = 'Pristine record with zero default history';
  const isOverdue = finance.repaymentTrackDelay <= -100;

  if (repaymentPoints === -35) {
    repaymentDescription = 'Minor 1-30 DPD past delinquency recorded in 24m';
  } else if (isOverdue) {
    repaymentDescription = 'Active overdue delinquency / loan default on bureau';
  }

  // Credit Age points
  let creditAgePoints = finance.creditAgePoints;
  let creditAgeDescription = '≥ 5 years active repayment vintage';
  if (creditAgePoints === 15) {
    creditAgeDescription = '2–5 years established credit history';
  } else if (creditAgePoints < 0) {
    creditAgeDescription = '< 2 years thin credit file or newly banked';
  }

  // Active Loans points
  let activeLoansPoints = finance.activeLoansPoints;
  let activeLoansDescription = '1 existing open servicing loan line';
  if (activeLoansPoints === 10) {
    activeLoansDescription = '0 active loans, debt capacity fully open';
  } else if (activeLoansPoints === -25) {
    activeLoansDescription = '3+ active loan accounts running concurrently';
  }

  // Driver array
  const drivers: ScoreDriver[] = [
    {
      title: 'Credit History Length',
      description: creditAgeDescription,
      points: creditAgePoints,
      isPositive: creditAgePoints > 0,
      category: 'Vintage'
    },
    {
      title: 'Repayment Discipline',
      description: repaymentDescription,
      points: repaymentPoints,
      isPositive: repaymentPoints > 0,
      category: 'Track Record'
    },
    {
      title: 'Employment Stability',
      description: empDescription,
      points: empPoints,
      isPositive: empPoints > 0,
      category: 'Stability'
    },
    {
      title: 'Age Eligibility Band',
      description: ageDescription,
      points: agePoints,
      isPositive: agePoints > 0,
      category: 'Demographics'
    },
    {
      title: `Post-Loan DTI (${dtiRatio.toFixed(1)}%)`,
      description: dtiDriverText,
      points: dtiPoints,
      isPositive: dtiPoints > 0,
      category: 'Leverage'
    },
    {
      title: 'Active Credit Lines',
      description: activeLoansDescription,
      points: activeLoansPoints,
      isPositive: activeLoansPoints > 0,
      category: 'Commitments'
    }
  ];

  // Base score 620 + calibration anchor + sum of drivers
  // Default: 620 + 35 (baseline anchor) + 45 + 25 + 25 + 10 - 10 - 5 = 745
  const baselineAnchor = 35;
  const rawScore = 620 + baselineAnchor + creditAgePoints + repaymentPoints + empPoints + agePoints + dtiPoints + activeLoansPoints;
  const score = Math.min(900, Math.max(300, Math.round(rawScore)));

  // Underwriting Verdict
  let verdict: 'LIKELY APPROVED' | 'MANUAL REVIEW' | 'DECLINED / HIGH RISK' = 'LIKELY APPROVED';
  let verdictDescription = '';
  let riskTier = 'PRIME / TIER 1-2';
  let riskTierDescription = 'Excellent / Low Risk Tier';

  if (isOverdue || dtiRatio > 60 || score < 580) {
    verdict = 'DECLINED / HIGH RISK';
    riskTier = 'SUBPRIME / REJECT TIER';
    riskTierDescription = 'High Delinquency / Leverage Risk';
    verdictDescription = isOverdue
      ? 'Active overdue delinquencies detected. Bureau risk policies mandate a hard block until overdue balances are cleared and updated in the credit registry.'
      : `Calculated debt burden (${dtiRatio.toFixed(1)}%) or credit score (${score}) breaches safe underwriting risk parameters for uncollateralized lending.`;
  } else if (score < 680 || dtiRatio > 50) {
    verdict = 'MANUAL REVIEW';
    riskTier = 'NEAR-PRIME / TIER 3';
    riskTierDescription = 'Moderate Risk / Conditional Approvals';
    verdictDescription = dtiRatio > 50
      ? `Debt-to-Income ratio (${dtiRatio.toFixed(1)}%) is on the higher threshold (>50%). Approval likely requires a co-applicant, lower loan amount, or longer tenure.`
      : `Credit profile score (${score}) qualifies for near-prime lending. Approvals may involve additional income banking verification or higher processing fees.`;
  } else {
    verdict = 'LIKELY APPROVED';
    riskTier = score >= 750 ? 'SUPER PRIME / TIER 1' : 'PRIME / TIER 1-2';
    riskTierDescription = 'Excellent / Low Risk Tier';
    verdictDescription = `Profile fits standard eligibility criteria. Score meets prime cutoff (≥ 720) with no current overdue delinquencies and debt burden (FOIR) strictly within safe limits (≤ 50%).`;
  }

  // Lender Matches
  let lenderMatches: LenderMatch[] = [];

  if (score >= 750) {
    lenderMatches = [
      {
        tag: 'STRONGEST MATCH',
        badgeClass: 'bg-secondary text-on-secondary',
        band: 'Score Band 750+',
        title: 'Public Sector & Large Private Banks',
        lenders: 'HDFC Bank, State Bank of India (SBI), ICICI Bank',
        indicativeRate: '10.25% - 11.50% p.a.',
        statusBadge: 'High Probability',
        statusType: 'success',
        isStrongest: true
      },
      {
        tag: 'PRE-QUALIFIED',
        badgeClass: 'bg-surface-container-high text-on-surface-variant',
        band: 'Score Band 650–749',
        title: 'Mid-Tier Private Banks & Top NBFCs',
        lenders: 'Kotak Mahindra Bank, Axis Bank, Bajaj Finserv, Tata Capital',
        indicativeRate: '11.25% - 13.50% p.a.',
        statusBadge: 'Instant Sanction Likely',
        statusType: 'success'
      }
    ];
  } else if (score >= 650) {
    lenderMatches = [
      {
        tag: 'STRONGEST MATCH',
        badgeClass: 'bg-secondary text-on-secondary',
        band: 'Score Band 650–749',
        title: 'Mid-Tier Private Banks & Top NBFCs',
        lenders: 'Kotak Mahindra Bank, Axis Bank, Bajaj Finserv, Tata Capital',
        indicativeRate: '11.25% - 13.50% p.a.',
        statusBadge: 'High Probability',
        statusType: 'success',
        isStrongest: true
      },
      {
        tag: 'COMPETITIVE STRETCH',
        badgeClass: 'bg-surface-container-high text-on-surface-variant',
        band: 'Score Band 750+',
        title: 'Public Sector & Large Private Banks',
        lenders: 'HDFC Bank, State Bank of India (SBI), ICICI Bank',
        indicativeRate: '10.25% - 11.50% p.a.',
        statusBadge: `Borderline (${score} / 750)`,
        statusType: 'info'
      }
    ];
  } else {
    lenderMatches = [
      {
        tag: 'SUITABLE MATCH',
        badgeClass: 'bg-amber-600 text-white',
        band: 'Score Band 580–649',
        title: 'Specialized Digital NBFCs & Fintechs',
        lenders: 'KreditBee, MoneyTap, Navi Technologies, Piramal Finance',
        indicativeRate: '14.50% - 19.50% p.a.',
        statusBadge: 'Subject to Bank Statement',
        statusType: 'warning',
        isStrongest: true
      },
      {
        tag: 'ALTERNATIVE PATH',
        badgeClass: 'bg-surface-container-high text-on-surface-variant',
        band: 'Secured / Co-applicant',
        title: 'Gold Loan / Co-borrower Assisted Facilities',
        lenders: 'Muthoot Finance, Manappuram, Regional Credit Co-ops',
        indicativeRate: '11.00% - 14.00% p.a.',
        statusBadge: 'Collateral Backed',
        statusType: 'info'
      }
    ];
  }

  return {
    score,
    verdict,
    verdictDescription,
    riskTier,
    riskTierDescription,
    newEmi,
    totalOutflow,
    dtiRatio,
    dtiStatus,
    dtiStatusLabel,
    drivers,
    lenderMatches,
    isOverdue
  };
}

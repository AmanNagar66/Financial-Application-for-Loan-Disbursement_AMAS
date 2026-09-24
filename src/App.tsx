import { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { BottomNav, TabId } from './components/BottomNav';
import { Step1Applicant } from './components/Step1Applicant';
import { Step2Finances } from './components/Step2Finances';
import { Step3Results } from './components/Step3Results';
import { DecisionsScreen } from './components/DecisionsScreen';
import { ReportModal } from './components/ReportModal';
import { PresetModal } from './components/PresetModal';
import { InfoModal } from './components/InfoModal';
import { ApplicantData, FinanceData } from './types';
import { calculateUnderwriting } from './utils/underwriting';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('apply');

  // Initial Applicant State matching Image 1
  const [applicant, setApplicant] = useState<ApplicantData>({
    fullName: 'Aarav Mehta',
    age: 29,
    gender: 'Male',
    aadhaarNumber: 'XXXX-XXXX-4819',
    panNumber: 'ABCDE1234F',
    city: 'Bengaluru, Karnataka',
  });

  // Initial Financial State matching Image 2
  const [finance, setFinance] = useState<FinanceData>({
    loanAmount: 500000,
    tenureMonths: 36,
    loanPurpose: 'Personal',
    monthlyIncome: 75000,
    employmentType: 'salaried',
    existingEmi: 12500,
    repaymentTrackDelay: 25,
    creditAgePoints: 45,
    activeLoansPoints: -5,
  });

  // Modals state
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isPresetsOpen, setIsPresetsOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  // Responsive device view option for desktop viewing
  const [isFramedMode, setIsFramedMode] = useState(false);

  // Compute Underwriting Result
  const underwritingResult = useMemo(
    () => calculateUnderwriting(applicant, finance),
    [applicant, finance]
  );

  // Scroll to top on tab change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  const handleUpdateApplicant = (data: Partial<ApplicantData>) => {
    setApplicant((prev) => ({ ...prev, ...data }));
  };

  const handleUpdateFinance = (data: Partial<FinanceData>) => {
    setFinance((prev) => ({ ...prev, ...data }));
  };

  const handleSelectPreset = (newApplicant: ApplicantData, newFinance: FinanceData) => {
    setApplicant(newApplicant);
    setFinance(newFinance);
  };

  return (
    <div className={`min-h-screen bg-[#f1f4fb] ${isFramedMode ? 'py-6 px-4' : ''}`}>
      {/* Desktop Helper Bar */}
      <div className="hidden lg:flex fixed top-3 right-4 z-50 items-center gap-2 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md border border-[#dce9ff] text-[12px] text-[#44474d]">
        <button
          onClick={() => setIsPresetsOpen(true)}
          className="flex items-center gap-1 font-metric font-semibold text-[#003bd6] hover:underline"
          type="button"
        >
          <span className="material-symbols-outlined text-[15px]">tune</span>
          Scenarios ({underwritingResult.score} pts)
        </button>
        <span className="text-gray-300">|</span>
        <button
          onClick={() => setIsFramedMode(!isFramedMode)}
          className="flex items-center gap-1 hover:text-[#0b1c30]"
          type="button"
          title="Toggle Mobile Mockup Frame"
        >
          <span className="material-symbols-outlined text-[15px]">
            {isFramedMode ? 'fit_screen' : 'smartphone'}
          </span>
          {isFramedMode ? 'Wide View' : 'Device Frame'}
        </button>
      </div>

      {/* Main Container */}
      <div
        className={`mx-auto bg-[#f8f9ff] min-h-screen flex flex-col relative ${
          isFramedMode
            ? 'max-w-[430px] rounded-3xl shadow-2xl overflow-hidden border-8 border-[#0d1c32]'
            : 'max-w-md shadow-sm'
        }`}
      >
        {/* Fixed Header */}
        <Header
          onOpenInfo={() => setIsInfoOpen(true)}
          onOpenPresets={() => setIsPresetsOpen(true)}
        />

        {/* Scrollable Content Body */}
        <main className="flex-1 w-full pt-20 pb-24 px-4">
          {activeTab === 'apply' && (
            <Step1Applicant
              data={applicant}
              onChange={handleUpdateApplicant}
              onContinue={() => setActiveTab('finances')}
            />
          )}

          {activeTab === 'finances' && (
            <Step2Finances
              data={finance}
              result={underwritingResult}
              onChange={handleUpdateFinance}
              onRunEngine={() => setActiveTab('assessment')}
              onBack={() => setActiveTab('apply')}
            />
          )}

          {activeTab === 'assessment' && (
            <Step3Results
              result={underwritingResult}
              finance={finance}
              onEditInputs={() => setActiveTab('finances')}
              onViewDecisions={() => setActiveTab('decisions')}
              onDownloadReport={() => setIsReportOpen(true)}
            />
          )}

          {activeTab === 'decisions' && (
            <DecisionsScreen
              applicant={applicant}
              finance={finance}
              result={underwritingResult}
              onEditInputs={() => setActiveTab('finances')}
              onDownloadReport={() => setIsReportOpen(true)}
            />
          )}
        </main>

        {/* Fixed Bottom Navigation Bar */}
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Modals */}
      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        applicant={applicant}
        finance={finance}
        result={underwritingResult}
      />

      <PresetModal
        isOpen={isPresetsOpen}
        onClose={() => setIsPresetsOpen(false)}
        onSelectPreset={handleSelectPreset}
      />

      <InfoModal isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} />
    </div>
  );
}

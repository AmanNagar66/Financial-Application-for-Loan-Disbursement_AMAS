import React from 'react';

export type TabId = 'apply' | 'finances' | 'assessment' | 'decisions';

interface BottomNavProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const tabs: { id: TabId; label: string; icon: string }[] = [
    { id: 'apply', label: 'Step 1: Applicant', icon: 'person' },
    { id: 'finances', label: 'Step 2: Finances', icon: 'account_balance_wallet' },
    { id: 'assessment', label: 'Risk Assessment', icon: 'speed' },
    { id: 'decisions', label: 'Decisions', icon: 'verified' },
  ];

  return (
    <nav className="fixed bottom-0 w-full z-50 bg-[#f8f9ff]/90 backdrop-blur-xl border-t border-[#e5eeff] shadow-[0_-2px_12px_rgba(11,28,48,0.06)] pb-[env(safe-area-inset-bottom,0px)]">
      <div className="max-w-md mx-auto flex items-center justify-around h-16 px-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center gap-1 min-w-[56px] min-h-[44px] px-1 transition-all ${
                isActive ? 'text-[#003bd6]' : 'text-[#44474d] hover:text-[#0b1c30]'
              }`}
              type="button"
            >
              <span
                className={`material-symbols-outlined text-[22px] transition-transform ${
                  isActive ? 'scale-110 font-bold' : ''
                }`}
                style={isActive ? { fontVariationSettings: "'FILL' 1, 'wght' 600" } : undefined}
              >
                {tab.icon}
              </span>
              <span className={`text-[11px] font-metric whitespace-nowrap leading-none ${isActive ? 'font-bold' : 'font-medium'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

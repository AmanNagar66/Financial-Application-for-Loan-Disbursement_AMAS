import React from 'react';

interface HeaderProps {
  onOpenInfo?: () => void;
  onOpenPresets?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenInfo, onOpenPresets }) => {
  return (
    <header className="fixed top-0 w-full z-50 bg-[#f8f9ff]/90 backdrop-blur-xl border-b border-[#e5eeff] shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="max-w-md mx-auto h-16 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            alt="CrediCheck Shield Logo"
            className="h-8 w-auto object-contain"
            src="https://lh3.googleusercontent.com/aida/AEtjO1US4sxre82r0TZBgyIDRFUbXEDQBgQDsbYxSZU72c3jQgulwMuwDMrQhzHuqcVBGeKlPZJLYMaWUa7OleB1oqIx2kCm_K-6Im42HUFDm2gWB1FBofCaEeHpZ-MyyJFo18IJl-sGvT1bgC53lwd43d8l0bPgCgbXq7qaLKHeLtm8MovcE526C0L1GmUCsu3-RvRioa1OCmGRxZJoLfNJ-IKwIEKr990cWm1jD73JQRx5MTD1WKfrRyB2LA"
          />
          <div className="flex flex-col leading-tight">
            <span className="text-[16px] font-bold tracking-tight text-[#0b1c30]">CrediCheck</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[13px] text-[#44474d] font-medium">Underwriting</span>
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-[#e5eeff] text-[#0c9488] font-metric text-[10px] font-bold tracking-wider">
                <span className="material-symbols-outlined text-[11px]">lock</span>
                SIMULATION
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onOpenInfo}
            title="Simulation Engine Parameters"
            className="w-9 h-9 rounded-full flex items-center justify-center text-[#44474d] hover:bg-[#dce9ff] transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">shield</span>
          </button>
          
          <button
            onClick={onOpenPresets}
            title="Applicant Profile & Test Presets"
            className="relative rounded-full focus:outline-none focus:ring-2 focus:ring-[#003bd6] focus:ring-offset-1"
            type="button"
          >
            <img
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover border border-[#b9c3ff]"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCOYNAolHPhPjpFVzRl1NH9Zdt7OnYRxI__vB9pxn_RfAXn8J9r9hGmbJSC1pRyXuWafX7vTAVBzq2dBfIUIWVx4whNt9F5JZtNTupydeIe5OWwLOeQfeVNgpG457vAHPawVlVWbUDvZL-j9_eeuesmFy5U627DD956ELyd9e_QMNzX9V19eXJm8MOouYO504jrH02N-7zF6cxcjXHje6xUHdW5Jft6kzs7CYgT3JO4xjaypf6Dic_n"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white"></span>
          </button>
        </div>
      </div>
    </header>
  );
};

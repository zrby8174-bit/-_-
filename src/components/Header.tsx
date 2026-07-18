import React, { useState, useEffect } from "react";
import { UniversityLogo } from "./UniversityLogo";
import { Moon, Sun, ShieldAlert, LogOut } from "lucide-react";

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  isAdminMode: boolean;
  setIsAdminMode: (admin: boolean) => void;
  isExamRunning: boolean;
  onSecretTrigger: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  setDarkMode,
  isAdminMode,
  setIsAdminMode,
  isExamRunning,
  onSecretTrigger,
}) => {
  const [logoClicks, setLogoClicks] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);

  // Logo click secret trigger
  const handleLogoClick = () => {
    const now = Date.now();
    if (now - lastClickTime < 2500) {
      const nextClicks = logoClicks + 1;
      if (nextClicks >= 5) {
        onSecretTrigger();
        setLogoClicks(0);
      } else {
        setLogoClicks(nextClicks);
      }
    } else {
      setLogoClicks(1);
    }
    setLastClickTime(now);
  };

  // Listen to keyboard shortcut (Ctrl + Shift + A)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "a") {
        e.preventDefault();
        onSecretTrigger();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onSecretTrigger]);

  return (
    <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-100 dark:border-slate-700 sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand Logo and Title - Secret Trigger on Logo click */}
        <div className="flex items-center gap-3">
          <div 
            onClick={handleLogoClick}
            className="cursor-pointer active:scale-95 transition-transform"
            title="جامعة صنعاء"
          >
            <UniversityLogo size={52} className="hidden sm:block" />
            <UniversityLogo size={40} className="sm:hidden" />
          </div>
          <div>
            <h1 className="text-sm sm:text-lg font-bold text-slate-900 dark:text-white leading-tight">
              جامعة صنعاء
            </h1>
            <p className="text-[10px] sm:text-xs text-amber-600 dark:text-amber-500 font-semibold tracking-wider">
              منصة الاختبارات الإلكترونية • اللجنة العلمية المركزية
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Admin Dashboard Active Exit Button */}
          {isAdminMode && (
            <button
              id="adminToggleBtn"
              onClick={() => setIsAdminMode(false)}
              className="flex items-center gap-1.5 bg-red-550 hover:bg-red-600 text-white px-3 py-2 rounded-xl text-xs font-bold transition-all border border-red-550 shadow-sm cursor-pointer"
            >
              <LogOut size={14} />
              <span>الخروج من وضع الإدارة</span>
            </button>
          )}

          {/* Theme Toggle Button */}
          <button
            id="themeToggleBtn"
            onClick={() => setDarkMode(!darkMode)}
            className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition cursor-pointer"
            title="تبديل المظهر"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>
    </header>
  );
};

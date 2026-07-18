import { useState, useEffect } from "react";
import { College, ExamState, Question, ExamAttempt } from "./types";
import { INITIAL_COLLEGES } from "./data/seedData";
import { Header } from "./components/Header";
import { PortalHome } from "./components/PortalHome";
import { ExamEngine } from "./components/ExamEngine";
import { ExamResults } from "./components/ExamResults";
import { AdminDashboard } from "./components/AdminDashboard";
import { Lock, ShieldAlert, X, ChevronLeft } from "lucide-react";

export default function App() {
  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      return savedTheme === "dark";
    }
    return false;
  });

  // App and Database State
  const [colleges, setColleges] = useState<College[]>(() => {
    if (typeof window !== "undefined") {
      const savedDb = localStorage.getItem("sanaa_university_exams_db");
      if (savedDb) {
        try {
          return JSON.parse(savedDb);
        } catch (e) {
          console.error("Failed parsing exams database from LocalStorage", e);
        }
      }
    }
    return INITIAL_COLLEGES;
  });

  // Exam Attempts state
  const [attempts, setAttempts] = useState<ExamAttempt[]>(() => {
    if (typeof window !== "undefined") {
      const savedAttempts = localStorage.getItem("sanaa_university_attempts_db");
      if (savedAttempts) {
        try {
          return JSON.parse(savedAttempts);
        } catch (e) {
          console.error("Failed parsing exam attempts from LocalStorage", e);
        }
      }
    }
    return [];
  });

  // Student Profile
  const [studentProfile, setStudentProfile] = useState<{ id: string; name: string }>(() => {
    if (typeof window !== "undefined") {
      const savedProfile = localStorage.getItem("sanaa_student_profile");
      if (savedProfile) {
        try {
          return JSON.parse(savedProfile);
        } catch (e) {}
      }
      // Generate standard random student ID
      const newId = "SU-" + Math.floor(10000 + Math.random() * 90000);
      const profile = { id: newId, name: "طالب جديد" };
      localStorage.setItem("sanaa_student_profile", JSON.stringify(profile));
      return profile;
    }
    return { id: "SU-10000", name: "طالب جديد" };
  });

  // Covert Security States
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [showSecretPinModal, setShowSecretPinModal] = useState(false);
  const [enteredPin, setEnteredPin] = useState("");
  const [pinError, setPinError] = useState(false);
  const [adminPin, setAdminPin] = useState(() => {
    if (typeof window !== "undefined") {
      const savedPin = localStorage.getItem("sanaa_exams_admin_pin");
      return savedPin || "2026";
    }
    return "2026";
  });

  // Resumption State
  const [pendingResumeState, setPendingResumeState] = useState<any>(null);

  // Historical attempt being reviewed
  const [viewingAttempt, setViewingAttempt] = useState<ExamAttempt | null>(null);

  // Cascading Portal Selection
  const [selectedCollegeId, setSelectedCollegeId] = useState("");
  const [selectedLevelId, setSelectedLevelId] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [selectedYearId, setSelectedYearId] = useState("");
  const [selectedPeriodId, setSelectedPeriodId] = useState("");

  // Exam custom parameters
  const [shuffleQuestions, setShuffleQuestions] = useState(false);
  const [shuffleOptions, setShuffleOptions] = useState(false);

  // Active Exam state
  const [examState, setExamState] = useState<ExamState | null>(null);
  const [initialExamDuration, setInitialExamDuration] = useState(0);

  // Sync theme changes with DOM body class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // Load pending active exam progress on startup
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sanaa_university_active_exam_state");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.examState && !parsed.examState.isFinished) {
            setPendingResumeState(parsed);
          }
        } catch (e) {}
      }
    }
  }, []);

  // Save progress dynamically while exam is running
  useEffect(() => {
    if (examState && examState.isStarted && !examState.isFinished) {
      const progress = {
        selectedCollegeId,
        selectedLevelId,
        selectedSubjectId,
        selectedYearId,
        selectedPeriodId,
        examState,
        initialExamDuration,
      };
      localStorage.setItem("sanaa_university_active_exam_state", JSON.stringify(progress));
    } else if (examState?.isFinished) {
      localStorage.removeItem("sanaa_university_active_exam_state");
    }
  }, [examState, selectedCollegeId, selectedLevelId, selectedSubjectId, selectedYearId, selectedPeriodId, initialExamDuration]);

  // Resume the saved progress session
  const handleResumePrevious = () => {
    if (pendingResumeState) {
      setSelectedCollegeId(pendingResumeState.selectedCollegeId);
      setSelectedLevelId(pendingResumeState.selectedLevelId);
      setSelectedSubjectId(pendingResumeState.selectedSubjectId);
      setSelectedYearId(pendingResumeState.selectedYearId);
      setSelectedPeriodId(pendingResumeState.selectedPeriodId);
      setInitialExamDuration(pendingResumeState.initialExamDuration);
      setExamState(pendingResumeState.examState);
      setPendingResumeState(null);
    }
  };

  // Dismiss the saved progress session
  const handleDismissPrevious = () => {
    localStorage.removeItem("sanaa_university_active_exam_state");
    setPendingResumeState(null);
  };

  // Handle active countdown timer when exam is running
  useEffect(() => {
    let timerId: NodeJS.Timeout | null = null;

    if (examState && examState.isStarted && !examState.isFinished) {
      timerId = setInterval(() => {
        setExamState((prev) => {
          if (!prev) return null;
          if (prev.timeLeft <= 1) {
            clearInterval(timerId!);
            // Timeout alert and conclude
            setTimeout(() => {
              alert("انتهى الوقت المخصص للاختبار! سيتم تسليم إجاباتك الحالية وتصحيحها تلقائياً.");
              handleFinishExam();
            }, 100);
            return {
              ...prev,
              timeLeft: 0,
              isFinished: true,
            };
          }
          return {
            ...prev,
            timeLeft: prev.timeLeft - 1,
          };
        });
      }, 1000);
    }

    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [examState?.isStarted, examState?.isFinished]);

  // Persist any updates of colleges to LocalStorage
  const handleSaveToLocalStorage = (updatedColleges: College[]) => {
    setColleges(updatedColleges);
    localStorage.setItem("sanaa_university_exams_db", JSON.stringify(updatedColleges));
  };

  // Launch Active Exam and prepare randomized orders
  const handleStartExam = () => {
    const college = colleges.find((c) => c.id === selectedCollegeId);
    const level = college?.levels.find((l) => l.id === selectedLevelId);
    const subject = level?.subjects.find((s) => s.id === selectedSubjectId);
    const year = subject?.years.find((y) => y.id === selectedYearId);
    const period = year?.periods.find((p) => p.id === selectedPeriodId);

    if (!period || !period.questions || period.questions.length === 0) {
      alert("عذراً، هذا النموذج لا يحتوي على أي أسئلة مضافة بعد.");
      return;
    }

    const totalQuestions = period.questions.length;
    let originalToShuffledIndices = Array.from({ length: totalQuestions }, (_, i) => i);

    // Shuffle questions if requested
    if (shuffleQuestions) {
      for (let i = originalToShuffledIndices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [originalToShuffledIndices[i], originalToShuffledIndices[j]] = [
          originalToShuffledIndices[j],
          originalToShuffledIndices[i],
        ];
      }
    }

    const shuffledQuestionsList = originalToShuffledIndices.map((idx) => period.questions[idx]);

    // Shuffle options mapping for each question if requested
    const shuffledOptionsMap: { [questionId: string]: number[] } = {};
    shuffledQuestionsList.forEach((q) => {
      let optionOrder = [0, 1, 2, 3];
      if (shuffleOptions) {
        for (let i = optionOrder.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [optionOrder[i], optionOrder[j]] = [optionOrder[j], optionOrder[i]];
        }
      }
      shuffledOptionsMap[q.id] = optionOrder;
    });

    // 45 seconds per question with 30 min minimum duration
    const computedDuration = Math.max(30 * 60, totalQuestions * 45);

    setInitialExamDuration(computedDuration);
    setExamState({
      currentQuestionIndex: 0,
      answers: {},
      timeLeft: computedDuration,
      isStarted: true,
      isFinished: false,
      shuffledQuestions: shuffledQuestionsList,
      originalToShuffledMap: originalToShuffledIndices,
      shuffledOptionsMap: shuffledOptionsMap,
    });
    setIsAdminMode(false); // Make sure to hide Admin mode when exam is active
  };

  const handleFinishExam = () => {
    setExamState((prev) => {
      if (!prev) return null;

      const college = colleges.find((c) => c.id === selectedCollegeId);
      const level = college?.levels.find((l) => l.id === selectedLevelId);
      const subject = level?.subjects.find((s) => s.id === selectedSubjectId);
      const year = subject?.years.find((y) => y.id === selectedYearId);
      const period = year?.periods.find((p) => p.id === selectedPeriodId);

      let correctCount = 0;
      prev.shuffledQuestions.forEach((q) => {
        const userAns = prev.answers[q.id];
        if (userAns !== undefined && userAns === q.correctAnswerIndex) {
          correctCount++;
        }
      });

      const newAttempt: ExamAttempt = {
        id: "attempt_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
        collegeId: selectedCollegeId,
        collegeName: college?.name || "عام",
        subjectId: selectedSubjectId,
        subjectName: subject?.name || "مادة",
        yearId: selectedYearId,
        yearName: year?.name || "سنة",
        periodId: selectedPeriodId,
        periodName: period?.name || "فترة",
        timestamp: new Date().toISOString(),
        score: correctCount,
        totalQuestions: prev.shuffledQuestions.length,
        percentage: prev.shuffledQuestions.length > 0 ? Math.round((correctCount / prev.shuffledQuestions.length) * 100) : 0,
        timeTaken: initialExamDuration - prev.timeLeft,
        answers: prev.answers,
      };

      setAttempts((prevAttempts) => {
        const updated = [newAttempt, ...prevAttempts];
        localStorage.setItem("sanaa_university_attempts_db", JSON.stringify(updated));
        return updated;
      });

      return {
        ...prev,
        isFinished: true,
      };
    });
  };

  const handleRestartExam = () => {
    handleStartExam();
  };

  const handleBackToHome = () => {
    setExamState(null);
  };

  // Trigger historical attempt review in student results dashboard
  const handleReviewAttempt = (attempt: ExamAttempt) => {
    setViewingAttempt(attempt);
  };

  const handleClearHistory = () => {
    if (window.confirm("هل أنت متأكد من رغبتك في حذف سجل تدريباتك بالكامل؟ لا يمكن التراجع عن هذا الإجراء.")) {
      setAttempts([]);
      localStorage.removeItem("sanaa_university_attempts_db");
    }
  };

  // Keyboard shortcut listener to type PIN on secret keypad
  useEffect(() => {
    if (!showSecretPinModal) return;

    const handlePinInput = (e: KeyboardEvent) => {
      if (e.key >= "0" && e.key <= "9") {
        handleKeyPress(e.key);
      } else if (e.key === "Backspace") {
        handleDeletePress();
      } else if (e.key === "Escape") {
        setShowSecretPinModal(false);
        setEnteredPin("");
      }
    };
    window.addEventListener("keydown", handlePinInput);
    return () => window.removeEventListener("keydown", handlePinInput);
  }, [showSecretPinModal, enteredPin]);

  const handleKeyPress = (num: string) => {
    if (enteredPin.length < 4) {
      const nextPin = enteredPin + num;
      setEnteredPin(nextPin);

      if (nextPin.length === 4) {
        if (nextPin === adminPin) {
          setIsAdminMode(true);
          setShowSecretPinModal(false);
          setEnteredPin("");
        } else {
          setPinError(true);
          setTimeout(() => {
            setPinError(false);
            setEnteredPin("");
          }, 650);
        }
      }
    }
  };

  const handleDeletePress = () => {
    setEnteredPin((prev) => prev.slice(0, -1));
  };

  // Compute textual course title details
  const activeCollege = colleges.find((c) => c.id === selectedCollegeId);
  const activeLevel = activeCollege?.levels.find((l) => l.id === selectedLevelId);
  const activeSubject = activeLevel?.subjects.find((s) => s.id === selectedSubjectId);
  const activeYear = activeSubject?.years.find((y) => y.id === selectedYearId);
  const activePeriod = activeYear?.periods.find((p) => p.id === selectedPeriodId);

  const courseTitle = activeSubject
    ? `${activeCollege?.name} • ${activeSubject?.name} (${activeYear?.name})`
    : "";
  const periodName = activePeriod?.name || "";

  // Find questions for the historical attempt review
  const viewingAttemptQuestions = viewingAttempt ? (() => {
    const col = colleges.find((c) => c.id === viewingAttempt.collegeId);
    for (const lvl of col?.levels || []) {
      const sub = lvl.subjects.find((s) => s.id === viewingAttempt.subjectId);
      if (sub) {
        const yr = sub.years.find((y) => y.id === viewingAttempt.yearId);
        const per = yr?.periods.find((p) => p.id === viewingAttempt.periodId);
        if (per && per.questions) return per.questions;
      }
    }
    return [] as Question[];
  })() : [];

  return (
    <div className="bg-slate-50 text-slate-800 dark:bg-slate-900 dark:text-slate-100 min-h-screen flex flex-col antialiased transition-colors duration-300">
      {/* Brand Header */}
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        isAdminMode={isAdminMode}
        setIsAdminMode={setIsAdminMode}
        isExamRunning={examState !== null && examState.isStarted && !examState.isFinished}
        onSecretTrigger={() => {
          if (isAdminMode) {
            setIsAdminMode(false);
          } else {
            setShowSecretPinModal(true);
            setEnteredPin("");
          }
        }}
      />

      {/* Main stage layout wrapper */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 py-6 flex flex-col justify-start">
        {/* Branch screens depending on states */}
        {viewingAttempt ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-white dark:bg-slate-800 p-4 rounded-xl shadow-xs border border-slate-100 dark:border-slate-700">
              <div className="space-y-1">
                <span className="text-[10px] bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 font-bold px-2.5 py-0.5 rounded-full block w-max">
                  مراجعة أرشيفية
                </span>
                <h2 className="text-sm sm:text-base font-extrabold text-slate-800 dark:text-white">
                  مراجعة إجابات: {viewingAttempt.subjectName} ({viewingAttempt.periodName})
                </h2>
              </div>
              <button
                onClick={() => setViewingAttempt(null)}
                className="bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-1 hover:bg-emerald-700"
              >
                <span>العودة للملف الشخصي</span>
                <ChevronLeft size={14} className="transform rotate-180" />
              </button>
            </div>

            <ExamResults
              courseTitle={`${viewingAttempt.collegeName} • ${viewingAttempt.subjectName} (${viewingAttempt.yearName})`}
              periodName={viewingAttempt.periodName}
              shuffledQuestions={viewingAttemptQuestions.length > 0 ? viewingAttemptQuestions : []}
              answers={viewingAttempt.answers}
              timeTaken={viewingAttempt.timeTaken}
              onRestartExam={() => {
                setSelectedCollegeId(viewingAttempt.collegeId);
                setSelectedLevelId(""); // cascade rebuild on load
                setSelectedSubjectId(viewingAttempt.subjectId);
                setSelectedYearId(viewingAttempt.yearId);
                setSelectedPeriodId(viewingAttempt.periodId);
                setViewingAttempt(null);
                setTimeout(() => {
                  handleStartExam();
                }, 100);
              }}
              onBackToHome={() => setViewingAttempt(null)}
            />
          </div>
        ) : isAdminMode ? (
          <AdminDashboard
            colleges={colleges}
            setColleges={setColleges}
            onSaveToLocalStorage={handleSaveToLocalStorage}
            adminPin={adminPin}
            onUpdatePin={(newPin) => {
              setAdminPin(newPin);
              localStorage.setItem("sanaa_exams_admin_pin", newPin);
            }}
          />
        ) : examState === null ? (
          <PortalHome
            colleges={colleges}
            selectedCollegeId={selectedCollegeId}
            setSelectedCollegeId={setSelectedCollegeId}
            selectedLevelId={selectedLevelId}
            setSelectedLevelId={setSelectedLevelId}
            selectedSubjectId={selectedSubjectId}
            setSelectedSubjectId={setSelectedSubjectId}
            selectedYearId={selectedYearId}
            setSelectedYearId={setSelectedYearId}
            selectedPeriodId={selectedPeriodId}
            setSelectedPeriodId={setSelectedPeriodId}
            shuffleQuestions={shuffleQuestions}
            setShuffleQuestions={setShuffleQuestions}
            shuffleOptions={shuffleOptions}
            setShuffleOptions={setShuffleOptions}
            onStartExam={handleStartExam}
            studentProfile={studentProfile}
            setStudentProfile={setStudentProfile}
            attempts={attempts}
            onReviewAttempt={handleReviewAttempt}
            onClearHistory={handleClearHistory}
            pendingResumeState={pendingResumeState}
            onResumePrevious={handleResumePrevious}
            onDismissPrevious={handleDismissPrevious}
          />
        ) : !examState.isFinished ? (
          <ExamEngine
            courseTitle={courseTitle}
            periodName={periodName}
            examState={examState}
            setExamState={setExamState}
            onFinishExam={handleFinishExam}
          />
        ) : (
          <ExamResults
            courseTitle={courseTitle}
            periodName={periodName}
            shuffledQuestions={examState.shuffledQuestions}
            answers={examState.answers}
            timeTaken={initialExamDuration - examState.timeLeft}
            onRestartExam={handleRestartExam}
            onBackToHome={handleBackToHome}
          />
        )}
      </main>

      {/* Footnote decoration */}
      <footer className="bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 py-4 text-center text-xs text-slate-400 dark:text-slate-500 transition-colors">
        <p>© 2026 اللجنة العلمية المركزية - جامعة صنعاء. جميع الحقوق محفوظة.</p>
        <p className="mt-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
          مصمم بدقة لتمكين الطلاب وتيسير تدريبات الامتحانات.
        </p>
      </footer>

      {/* COVERT PIN ENTRY LOCKSCREEN MODAL */}
      {showSecretPinModal && (
        <div className="fixed inset-0 bg-slate-900/85 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
          <div 
            className={`bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 w-full max-w-sm border border-slate-100 dark:border-slate-750 shadow-2xl space-y-6 text-center transform transition-all ${
              pinError ? "animate-bounce border-red-500" : ""
            }`}
          >
            <div className="space-y-2">
              <div className="w-12 h-12 bg-amber-50 dark:bg-amber-950/40 text-amber-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <Lock size={20} />
              </div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">الولوج الأمني المطور</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                أدخل رمز المرور المكون من 4 أرقام لفتح وإدارة المنصة
              </p>
            </div>

            {/* Password Indicator Dots */}
            <div className="flex items-center justify-center gap-4.5 py-2">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div
                  key={idx}
                  className={`w-4.5 h-4.5 rounded-full border-2 transition-all duration-150 ${
                    enteredPin.length > idx
                      ? "bg-emerald-600 border-emerald-600 scale-110 shadow-sm"
                      : "border-slate-350 dark:border-slate-650 bg-transparent"
                  }`}
                />
              ))}
            </div>

            {/* Numeric Dial Pad */}
            <div className="grid grid-cols-3 gap-3.5 max-w-[260px] mx-auto">
              {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
                <button
                  key={num}
                  onClick={() => handleKeyPress(num)}
                  className="w-14 h-14 bg-slate-50 hover:bg-slate-100 active:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-750 text-base font-extrabold rounded-full text-slate-800 dark:text-slate-100 flex items-center justify-center transition shadow-xs cursor-pointer select-none"
                >
                  {num}
                </button>
              ))}
              <button
                onClick={handleDeletePress}
                className="w-14 h-14 text-xs font-bold rounded-full text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 flex items-center justify-center transition cursor-pointer select-none"
              >
                تراجع
              </button>
              <button
                onClick={() => handleKeyPress("0")}
                className="w-14 h-14 bg-slate-50 hover:bg-slate-100 active:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-750 text-base font-extrabold rounded-full text-slate-800 dark:text-slate-100 flex items-center justify-center transition shadow-xs cursor-pointer select-none"
              >
                0
              </button>
              <button
                onClick={() => {
                  setShowSecretPinModal(false);
                  setEnteredPin("");
                }}
                className="w-14 h-14 text-xs font-bold rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 flex items-center justify-center transition cursor-pointer select-none"
              >
                إلغاء
              </button>
            </div>

            {pinError && (
              <p className="text-xs text-red-500 font-bold animate-pulse">
                رمز المرور غير صحيح! يرجى المحاولة مجدداً.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

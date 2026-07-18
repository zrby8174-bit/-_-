import React, { useState } from "react";
import { Question, ExamState } from "../types";
import { Clock, Play, CheckCircle, ChevronLeft, ChevronRight, LayoutGrid, AlertTriangle } from "lucide-react";

interface ExamEngineProps {
  courseTitle: string;
  periodName: string;
  examState: ExamState;
  setExamState: React.Dispatch<React.SetStateAction<ExamState>>;
  onFinishExam: () => void;
}

export const ExamEngine: React.FC<ExamEngineProps> = ({
  courseTitle,
  periodName,
  examState,
  setExamState,
  onFinishExam,
}) => {
  const [showGrid, setShowGrid] = useState(false);

  const {
    currentQuestionIndex,
    answers,
    timeLeft,
    shuffledQuestions,
    shuffledOptionsMap,
  } = examState;

  const currentQuestion = shuffledQuestions[currentQuestionIndex];
  const totalQuestions = shuffledQuestions.length;

  // Format time (MM:SS)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  // Progression metrics
  const answeredCount = Object.keys(answers).length;
  const progressPct = totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;

  // Answer handler
  const handleSelectOption = (questionId: string, originalOptionIndex: number) => {
    setExamState((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionId]: originalOptionIndex,
      },
    }));
  };

  // Navigation handlers
  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setExamState((prev) => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
      }));
    } else {
      handleConfirmFinish();
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setExamState((prev) => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex - 1,
      }));
    }
  };

  const handleGoToQuestion = (index: number) => {
    setExamState((prev) => ({
      ...prev,
      currentQuestionIndex: index,
    }));
  };

  const handleConfirmFinish = () => {
    const unanswered = totalQuestions - answeredCount;
    let message = "هل أنت متأكد من رغبتك في إنهاء وتسليم الاختبار؟\n";
    if (unanswered > 0) {
      message += `تنبيه: يوجد ${unanswered} أسئلة لم تقم بالإجابة عليها بعد!`;
    } else {
      message += "لقد أجبت على كافة الأسئلة بنجاح.";
    }

    if (window.confirm(message)) {
      onFinishExam();
    }
  };

  if (!currentQuestion) return null;

  const optionsOrder = shuffledOptionsMap[currentQuestion.id] || [0, 1, 2, 3];
  const savedAnswer = answers[currentQuestion.id];

  return (
    <div id="examSection" className="w-full space-y-4 animate-fade-in">
      {/* Top Banner stats and Timer */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-100 dark:border-slate-700 flex flex-wrap items-center justify-between gap-4 transition-colors">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></span>
          <span className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">
            {courseTitle} ({periodName})
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Real-time Timer display */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-bold text-xs sm:text-sm font-mono transition-all ${
              timeLeft < 180
                ? "bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border-red-150 dark:border-red-900/40 animate-pulse"
                : "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-500 border-amber-100 dark:border-amber-900/30"
            }`}
          >
            <Clock size={16} />
            <span>{formatTime(timeLeft)}</span>
          </div>

          {/* Question Fraction Tracker */}
          <div className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-lg font-extrabold text-xs sm:text-sm border border-transparent dark:border-slate-650">
            السؤال: <span className="text-emerald-600 dark:text-emerald-400">{currentQuestionIndex + 1}</span> / {totalQuestions}
          </div>
        </div>
      </div>

      {/* Modern fluid progress bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          <span>مستوى التقدم والحل</span>
          <span>{progressPct}% ({answeredCount} من {totalQuestions})</span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-emerald-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          ></div>
        </div>
      </div>

      {/* Main Question Render Card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 sm:p-7 shadow-md border border-slate-100 dark:border-slate-700 space-y-6 transition-colors">
        <div className="space-y-2">
          <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-md inline-block uppercase tracking-wider">
            نص السؤال الحالي
          </span>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
            {currentQuestion.text}
          </h3>
          
          {currentQuestion.image && (
            <div className="mt-4 rounded-xl overflow-hidden max-h-[250px] bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 flex justify-center items-center">
              <img
                src={currentQuestion.image}
                alt="توضيح السؤال"
                referrerPolicy="no-referrer"
                className="max-h-[250px] object-contain"
              />
            </div>
          )}
        </div>

        {/* Form Choice Options */}
        <div className="grid grid-cols-1 gap-3">
          {optionsOrder.map((originalIndex, displayIndex) => {
            const isSelected = savedAnswer === originalIndex;
            const alphabet = ["أ", "ب", "ج", "د"];
            const optionText = currentQuestion.options[originalIndex];

            return (
              <button
                key={displayIndex}
                type="button"
                onClick={() => handleSelectOption(currentQuestion.id, originalIndex)}
                className={`w-full text-right p-4 rounded-xl border font-semibold text-sm transition-all flex items-center justify-between gap-3 cursor-pointer ${
                  isSelected
                    ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:border-emerald-500 text-emerald-800 dark:text-emerald-300 ring-2 ring-emerald-500"
                    : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-800/40"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shadow-sm flex-shrink-0 transition-colors ${
                      isSelected
                        ? "bg-emerald-600 text-white"
                        : "bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    {alphabet[displayIndex]}
                  </span>
                  <span className="leading-relaxed">{optionText}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Prev / Next controls */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={handlePrev}
          disabled={currentQuestionIndex === 0}
          className="flex-1 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed text-slate-800 dark:text-white font-bold py-3 px-4 rounded-xl shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <ChevronRight size={18} />
          <span>السابق</span>
        </button>

        <button
          onClick={handleNext}
          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>{currentQuestionIndex === totalQuestions - 1 ? "المراجعة والتسليم" : "التالي"}</span>
          <ChevronLeft size={18} />
        </button>
      </div>

      {/* Bottom control anchors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        {/* Toggle navigation map */}
        <button
          onClick={() => setShowGrid(!showGrid)}
          className="bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-750 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-bold py-3 px-4 rounded-xl text-xs transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <LayoutGrid size={15} />
          <span>{showGrid ? "إخفاء خريطة الأسئلة" : "عرض لوحة التنقل بين الأسئلة"}</span>
        </button>

        {/* Quick finish trigger */}
        <button
          onClick={handleConfirmFinish}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-xl text-xs shadow transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <CheckCircle size={15} />
          <span>إنهاء وتسليم الاختبار</span>
        </button>
      </div>

      {/* Navigation panel layout */}
      {showGrid && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-md border border-slate-100 dark:border-slate-700 space-y-3.5 transition-all animate-fade-in">
          <h4 className="text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <LayoutGrid size={13} className="text-emerald-600" />
            <span>خريطة الأسئلة (اضغط للانتقال السريع):</span>
          </h4>
          <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-1">
            {shuffledQuestions.map((q, idx) => {
              const isAnswered = answers[q.id] !== undefined;
              const isActive = idx === currentQuestionIndex;

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleGoToQuestion(idx)}
                  className={`w-10 h-10 rounded-xl font-bold text-sm transition-all flex items-center justify-center border cursor-pointer ${
                    isActive
                      ? "ring-4 ring-emerald-300 dark:ring-emerald-800 bg-emerald-600 text-white border-emerald-600"
                      : isAnswered
                      ? "bg-emerald-600 text-white border-emerald-600"
                      : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-transparent hover:bg-slate-200 dark:hover:bg-slate-600"
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

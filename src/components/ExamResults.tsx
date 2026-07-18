import React, { useState, useEffect, useMemo } from "react";
import { Question, ExamAttempt } from "../types";
import {
  RotateCcw,
  Home,
  CheckCircle2,
  XCircle,
  Clock,
  BookOpen,
  BarChart2,
  TrendingUp,
  AlertTriangle,
  Award,
  Users,
  Target,
  Percent,
  Check,
  ChevronLeft,
  BookMarked
} from "lucide-react";

interface ExamResultsProps {
  courseTitle: string;
  periodName: string;
  shuffledQuestions: Question[];
  answers: { [questionId: string]: number };
  timeTaken: number; // in seconds
  onRestartExam: () => void;
  onBackToHome: () => void;
}

export const ExamResults: React.FC<ExamResultsProps> = ({
  courseTitle,
  periodName,
  shuffledQuestions,
  answers,
  timeTaken,
  onRestartExam,
  onBackToHome,
}) => {
  const [activeTab, setActiveTab] = useState<"student" | "admin">("student");
  const [allAttempts, setAllAttempts] = useState<ExamAttempt[]>([]);

  // Load past attempts from localStorage for analytics
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedAttempts = localStorage.getItem("sanaa_university_attempts_db");
      if (savedAttempts) {
        try {
          setAllAttempts(JSON.parse(savedAttempts));
        } catch (e) {
          console.error("Failed to load historical attempts in ExamResults", e);
        }
      }
    }
  }, []);

  const total = shuffledQuestions.length;
  let correct = 0;

  shuffledQuestions.forEach((q) => {
    if (answers[q.id] !== undefined && answers[q.id] === q.correctAnswerIndex) {
      correct++;
    }
  });

  const wrong = total - correct;
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

  // Format MM:SS elapsed time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  // Determine status details
  let statusText = "";
  let badgeColorClass = "";
  let ringStroke = "#ef4444"; // Red default

  if (percentage >= 85) {
    statusText = "ممتاز جداً - أداء استثنائي رائع!";
    badgeColorClass = "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-850";
    ringStroke = "#059669"; // Green
  } else if (percentage >= 75) {
    statusText = "جيد جداً - تمكن ممتاز من المادة!";
    badgeColorClass = "bg-blue-50 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-850";
    ringStroke = "#3b82f6"; // Blue
  } else if (percentage >= 50) {
    statusText = "مقبول - بحاجة لبعض المراجعة الإضافية";
    badgeColorClass = "bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-850";
    ringStroke = "#f59e0b"; // Gold
  } else {
    statusText = "تحت المعدل - نوصي بشدة بإعادة المذاكرة وتكرار المحاولة";
    badgeColorClass = "bg-red-50 text-red-800 dark:bg-red-950/60 dark:text-red-300 border border-red-200 dark:border-red-850";
    ringStroke = "#ef4444"; // Red
  }

  // Question categorizer function
  const getQuestionTopic = (text: string): string => {
    const t = text.toLowerCase();
    if (t.includes("عقوب") || t.includes("إعدام") || t.includes("تدابير")) return "العقوبات والجزاءات الجنائية";
    if (t.includes("ركن") || t.includes("سلوك") || t.includes("مادي") || t.includes("قصد") || t.includes("نية") || t.includes("علم") || t.includes("إرادة")) return "الأركان العامة للجريمة";
    if (t.includes("مسؤول") || t.includes("مانع") || t.includes("جنون") || t.includes("صغر") || t.includes("إكراه") || t.includes("إباحة") || t.includes("دفاع")) return "المسؤولية الجنائية وأسباب الإباحة";
    if (t.includes("شروع") || t.includes("خاب") || t.includes("عدول") || t.includes("مستحيل")) return "الشروع والمساهمة الجنائية";
    
    if (t.includes("عظم") || t.includes("فخذ") || t.includes("هيكل") || t.includes("عضد")) return "الجهاز الهيكلي والعظام";
    if (t.includes("غد") || t.includes("نخام") || t.includes("درق") || t.includes("هرمون")) return "الغدد الصماء والهرمونات";
    if (t.includes("قلب") || t.includes("صمام") || t.includes("أذين") || t.includes("بطين") || t.includes("دوري")) return "الجهاز الدوري وصمامات القلب";
    if (t.includes("كلى") || t.includes("بول") || t.includes("تنقية") || t.includes("كبد") || t.includes("طحال")) return "أعضاء التصفية والوظائف الكلوية";

    if (t.includes("منهج") || t.includes("سكرام") || t.includes("شلال") || t.includes("agile") || t.includes("scrum")) return "منهجيات تطوير البرمجيات";
    if (t.includes("acid") || t.includes("بيان") || t.includes("معامل") || t.includes("تشفير") || t.includes("قاعدة")) return "قواعد البيانات وهندسة المعاملات";
    
    return "المفاهيم العامة والمبادئ الأساسية";
  };

  // 1. Calculate Student topic breakdown
  const topicBreakdown = useMemo(() => {
    const breakdown: { [topic: string]: { total: number; correct: number } } = {};
    shuffledQuestions.forEach((q) => {
      const topic = getQuestionTopic(q.text);
      if (!breakdown[topic]) {
        breakdown[topic] = { total: 0, correct: 0 };
      }
      breakdown[topic].total += 1;
      const isCorrect = answers[q.id] !== undefined && answers[q.id] === q.correctAnswerIndex;
      if (isCorrect) {
        breakdown[topic].correct += 1;
      }
    });
    return Object.entries(breakdown).map(([name, stats]) => ({
      name,
      total: stats.total,
      correct: stats.correct,
      pct: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
    }));
  }, [shuffledQuestions, answers]);

  // Determine critical topics for student to improve
  const areasForImprovement = useMemo(() => {
    return topicBreakdown.filter((item) => item.pct < 70);
  }, [topicBreakdown]);

  // 2. Calculate Admin Statistics across all attempts for this model
  const adminStats = useMemo(() => {
    // Filter attempts for this same model (by course title or matching periods)
    const matchingAttempts = allAttempts.filter(
      (att) => att.subjectName && courseTitle.includes(att.subjectName)
    );

    const totalAttemptsCount = matchingAttempts.length;
    if (totalAttemptsCount === 0) {
      return {
        totalAttemptsCount: 0,
        averageScore: 0,
        passRate: 0,
        frequentlyMissed: [] as Array<{ text: string; missedPercentage: number; count: number; textArabic: string }>,
      };
    }

    const totalScoresSum = matchingAttempts.reduce((sum, att) => sum + att.percentage, 0);
    const averageScore = Math.round(totalScoresSum / totalAttemptsCount);

    const passedAttemptsCount = matchingAttempts.filter((att) => att.percentage >= 50).length;
    const passRate = Math.round((passedAttemptsCount / totalAttemptsCount) * 100);

    // Track question incorrect counts
    const questionMissedCounter: { [qId: string]: { text: string; missedCount: number; totalRuns: number } } = {};
    
    matchingAttempts.forEach((att) => {
      if (!att.answers) return;
      // We look up the questions from this model
      shuffledQuestions.forEach((q) => {
        if (!questionMissedCounter[q.id]) {
          questionMissedCounter[q.id] = { text: q.text, missedCount: 0, totalRuns: 0 };
        }
        const userAns = att.answers[q.id];
        if (userAns !== undefined) {
          questionMissedCounter[q.id].totalRuns += 1;
          if (userAns !== q.correctAnswerIndex) {
            questionMissedCounter[q.id].missedCount += 1;
          }
        }
      });
    });

    const frequentlyMissed = Object.entries(questionMissedCounter)
      .map(([id, info]) => {
        const pct = info.totalRuns > 0 ? Math.round((info.missedCount / info.totalRuns) * 100) : 0;
        return {
          id,
          text: info.text,
          missedPercentage: pct,
          count: info.missedCount,
        };
      })
      .filter((q) => q.missedPercentage > 0)
      .sort((a, b) => b.missedPercentage - a.missedPercentage)
      .slice(0, 5); // top 5 most challenging

    return {
      totalAttemptsCount,
      averageScore,
      passRate,
      frequentlyMissed,
    };
  }, [allAttempts, courseTitle, shuffledQuestions]);

  // SVG ring calculations
  const radius = 64;
  const circumference = 2 * Math.PI * radius; // ~402.12
  const strokeDashoffset = circumference - (circumference * percentage) / 100;

  return (
    <div id="resultsSection" className="w-full space-y-6 animate-fade-in">
      {/* Dynamic Tab Switcher */}
      <div className="flex border-b border-slate-200 dark:border-slate-750 gap-4">
        <button
          onClick={() => setActiveTab("student")}
          className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === "student"
              ? "border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400"
              : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          }`}
        >
          <Award size={16} />
          <span>تقرير الطالب التفصيلي</span>
        </button>

        <button
          onClick={() => setActiveTab("admin")}
          className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === "admin"
              ? "border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400"
              : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          }`}
        >
          <BarChart2 size={16} />
          <span>إحصائيات الإدارة والتحليل العام ({adminStats.totalAttemptsCount} محاولات)</span>
        </button>
      </div>

      {activeTab === "student" ? (
        <>
          {/* Main Score graphic panel */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 shadow-md border border-slate-100 dark:border-slate-700 text-center space-y-6 transition-colors">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-3.5 py-1 rounded-full uppercase tracking-wider inline-block border border-emerald-150 dark:border-emerald-900/40">
                تقرير ودرجة الاختبار النهائي
              </span>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">{courseTitle}</h2>
              <p className="text-xs text-slate-400 font-bold">{periodName}</p>
            </div>

            {/* Circular Progress score */}
            <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="72"
                  cy="72"
                  r={radius}
                  stroke="#e2e8f0"
                  strokeWidth="8"
                  fill="transparent"
                  className="dark:stroke-slate-700"
                />
                <circle
                  cx="72"
                  cy="72"
                  r={radius}
                  stroke={ringStroke}
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{percentage}%</span>
                <span className="text-xs text-slate-400 font-bold mt-0.5">
                  {correct} / {total} correct
                </span>
              </div>
            </div>

            {/* Status Badge */}
            <div>
              <span className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold shadow-xs ${badgeColorClass}`}>
                {statusText}
              </span>
            </div>

            {/* Stats segment widgets */}
            <div className="grid grid-cols-3 gap-2 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 transition-colors">
              <div className="text-center space-y-1">
                <span className="text-slate-400 text-[10px] font-bold block flex items-center justify-center gap-1">
                  <CheckCircle2 size={10} className="text-emerald-500" />
                  <span>إجابات صحيحة</span>
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-extrabold text-lg sm:text-xl">
                  {correct}
                </span>
              </div>
              <div className="text-center space-y-1 border-x border-slate-200 dark:border-slate-700">
                <span className="text-slate-400 text-[10px] font-bold block flex items-center justify-center gap-1">
                  <XCircle size={10} className="text-red-500" />
                  <span>إجابات خاطئة</span>
                </span>
                <span className="text-red-500 font-extrabold text-lg sm:text-xl">
                  {wrong}
                </span>
              </div>
              <div className="text-center space-y-1">
                <span className="text-slate-400 text-[10px] font-bold block flex items-center justify-center gap-1">
                  <Clock size={10} className="text-slate-400" />
                  <span>الوقت المستغرق</span>
                </span>
                <span className="text-slate-700 dark:text-slate-300 font-extrabold text-sm sm:text-base font-mono">
                  {formatTime(timeTaken)}
                </span>
              </div>
            </div>

            {/* Action triggers */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={onRestartExam}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw size={18} />
                <span>إعادة المحاولة</span>
              </button>

              <button
                onClick={onBackToHome}
                className="flex-1 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white font-bold py-3.5 px-6 rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Home size={18} />
                <span>العودة للرئيسية</span>
              </button>
            </div>
          </div>

          {/* Performance Breakdown per Topic */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 sm:p-7 shadow-sm border border-slate-100 dark:border-slate-700 space-y-5 transition-colors">
            <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-2 uppercase tracking-wider">
              <BookMarked size={16} className="text-emerald-600" />
              <span>تحليل الأداء التفصيلي حسب المحور التعليمي والموضوع:</span>
            </h3>

            <div className="space-y-4">
              {topicBreakdown.map((topic, i) => {
                let barColor = "bg-red-500";
                let textCol = "text-red-600 dark:text-red-400";
                if (topic.pct >= 75) {
                  barColor = "bg-emerald-600";
                  textCol = "text-emerald-600 dark:text-emerald-400";
                } else if (topic.pct >= 50) {
                  barColor = "bg-amber-500";
                  textCol = "text-amber-600 dark:text-amber-500";
                }

                return (
                  <div key={i} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-extrabold text-slate-700 dark:text-slate-300">{topic.name}</span>
                      <span className={`font-extrabold ${textCol}`}>
                        {topic.pct}% ({topic.correct} من {topic.total})
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                      <div
                        className={`${barColor} h-full rounded-full transition-all duration-300`}
                        style={{ width: `${topic.pct}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tailored recommendations and study path */}
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-7 space-y-4">
            <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <TrendingUp size={16} className="text-emerald-600" />
              <span>خطة مراجعة مخصصة وتوصيات علمية:</span>
            </h3>

            {areasForImprovement.length > 0 ? (
              <div className="space-y-3">
                <p className="text-xs text-slate-500 leading-relaxed">
                  بناءً على أخطائك في هذا الاختبار، قمنا بتحديد بعض الجوانب التي تتطلب مزيداً من التركيز والمذاكرة. نقترح عليك البدء بالمواضيع التالية فوراً:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {areasForImprovement.map((area, i) => (
                    <div
                      key={i}
                      className="bg-white dark:bg-slate-850 p-4 rounded-xl border border-red-150 dark:border-red-950/40 flex items-start gap-3"
                    >
                      <AlertTriangle size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{area.name}</h4>
                        <p className="text-[11px] text-slate-400">
                          مستوى إجابتك هو {area.pct}%. ننصح بقراءة الشروحات والتوضيحات المرفقة بأسئلة هذا القسم وإعادة حله.
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3 p-4 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 rounded-xl">
                <Award size={20} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">أداء متميز للغاية!</h4>
                  <p className="text-[11px] text-slate-400">
                    تهانينا! لقد حققت مستوى متميزاً في جميع محاور هذا الاختبار. أنت تمتلك أساساً معرفياً قوياً وجاهزية تامة للامتحانات الرسمية. استمر في التدرب للحفاظ على هذا المستوى الرفيع.
                  </p>
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        /* Admin Overall performance Statistics view */
        <div className="space-y-6">
          {/* Metrics summary grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-150 dark:border-slate-700 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0">
                <Users size={24} />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-bold block">إجمالي محاولات الاختبار</span>
                <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                  {adminStats.totalAttemptsCount}
                </span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-150 dark:border-slate-700 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                <Target size={24} />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-bold block">متوسط الدرجات الكلي</span>
                <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                  {adminStats.averageScore}%
                </span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-150 dark:border-slate-700 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/40 flex items-center justify-center text-purple-600 dark:text-purple-400 flex-shrink-0">
                <Percent size={24} />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-bold block">نسبة الاجتياز (أكبر من %50)</span>
                <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                  {adminStats.passRate}%
                </span>
              </div>
            </div>
          </div>

          {/* Hardest / Frequently missed questions list */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 sm:p-7 shadow-sm border border-slate-100 dark:border-slate-700 space-y-4">
            <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <AlertTriangle size={16} className="text-red-500" />
              <span>الأسئلة الأكثر صعوبة (الأعلى نسبة خطأ بين المتقدمين):</span>
            </h3>

            {adminStats.frequentlyMissed.length > 0 ? (
              <div className="space-y-4">
                {adminStats.frequentlyMissed.map((q, i) => (
                  <div
                    key={i}
                    className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-150 dark:border-slate-800 flex items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-grow">
                      <span className="text-[10px] font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 px-2 py-0.5 rounded-md inline-block">
                        الترتيب: #{i + 1} الأكثر خطأً
                      </span>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-relaxed">
                        {q.text}
                      </p>
                    </div>
                    <div className="text-center flex-shrink-0 bg-red-50 dark:bg-red-950/50 p-3 rounded-xl border border-red-100 dark:border-red-900/40 min-w-[90px]">
                      <span className="text-lg font-extrabold text-red-600 dark:text-red-400 block">
                        {q.missedPercentage}%
                      </span>
                      <span className="text-[9px] text-slate-400 font-semibold block uppercase">معدل الخطأ</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-6">
                لم يتم رصد إحصائيات كافية لفرز الأسئلة الأكثر صعوبة بعد. سيتم تحديث هذا القسم بمجرد زيادة عدد محاولات الطلاب في المتصفح الحالي.
              </p>
            )}
          </div>
        </div>
      )}

      {/* corrections/reviews list */}
      {activeTab === "student" && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-2.5 h-5 bg-amber-500 rounded-full inline-block"></span>
            مراجعة تفصيلية وتصحيح لكافة الأسئلة:
          </h3>

          <div className="space-y-4">
            {shuffledQuestions.map((q, idx) => {
              const selectedAnsIndex = answers[q.id];
              const isCorrect = selectedAnsIndex !== undefined && selectedAnsIndex === q.correctAnswerIndex;
              const alphabet = ["أ", "ب", "ج", "د"];

              return (
                <div
                  key={q.id}
                  className={`bg-white dark:bg-slate-800 rounded-xl p-5 border shadow-sm transition-colors ${
                    isCorrect
                      ? "border-emerald-200 dark:border-emerald-900/60"
                      : "border-red-200 dark:border-red-900/60"
                  }`}
                >
                  <div className="space-y-3">
                    {/* Question header index with checkmark */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md inline-block ${
                            isCorrect
                              ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
                              : "bg-red-50 text-red-800 dark:bg-red-950/40 dark:text-red-300"
                          }`}
                        >
                          سؤال {idx + 1}
                        </span>
                        <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white leading-relaxed">
                          {q.text}
                        </h4>
                        
                        {q.image && (
                          <div className="mt-2.5 rounded-lg overflow-hidden max-h-[180px] bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-750 flex justify-start items-center">
                            <img
                              src={q.image}
                              alt="توضيح السؤال"
                              referrerPolicy="no-referrer"
                              className="max-h-[180px] object-contain"
                            />
                          </div>
                        )}
                      </div>
                      <div>
                        {isCorrect ? (
                          <CheckCircle2 className="text-emerald-600" size={22} />
                        ) : (
                          <XCircle className="text-red-500" size={22} />
                        )}
                      </div>
                    </div>

                    {/* Options grid corrective */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                      {q.options.map((opt, optIdx) => {
                        const isCorrectOption = optIdx === q.correctAnswerIndex;
                        const isSelectedByUser = optIdx === selectedAnsIndex;

                        let borderClass = "border-slate-200 dark:border-slate-750 text-slate-700 dark:text-slate-350 bg-slate-50/40 dark:bg-slate-800/40";
                        let indicatorIcon = null;

                        if (isCorrectOption) {
                          borderClass = "bg-emerald-100/70 border-emerald-300 text-emerald-900 dark:bg-emerald-950/40 dark:border-emerald-900/50 dark:text-emerald-300 font-semibold";
                          indicatorIcon = <span className="bg-emerald-600 text-white rounded-full p-0.5 text-[8px] flex-shrink-0">✓</span>;
                        } else if (isSelectedByUser) {
                          borderClass = "bg-red-100/70 border-red-300 text-red-900 dark:bg-red-950/40 dark:border-red-900/50 dark:text-red-300 font-semibold";
                          indicatorIcon = <span className="bg-red-600 text-white rounded-full p-0.5 text-[8px] flex-shrink-0">✗</span>;
                        }

                        return (
                          <div
                            key={optIdx}
                            className={`flex items-center justify-between gap-3 p-3 rounded-lg text-xs border ${borderClass}`}
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="w-5.5 h-5.5 rounded-md flex items-center justify-center font-bold bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 shadow-2xs border border-slate-100 dark:border-slate-800 flex-shrink-0">
                                {alphabet[optIdx]}
                              </span>
                              <span className="leading-relaxed">{opt}</span>
                            </div>
                            {indicatorIcon}
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation card */}
                    {q.explanation && (
                      <div className="mt-3 p-3.5 bg-amber-50/50 dark:bg-amber-950/20 border-r-4 border-amber-500 rounded-l-lg text-xs text-slate-600 dark:text-slate-300 leading-relaxed flex items-start gap-2.5 transition-colors">
                        <BookOpen size={14} className="text-amber-600 dark:text-amber-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <strong className="text-amber-700 dark:text-amber-500 block mb-0.5">توضيح الإجابة الصحيحة:</strong>
                          <span>{q.explanation}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

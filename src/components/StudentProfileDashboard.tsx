import React, { useState, useMemo } from "react";
import { College, ExamAttempt, Subject } from "../types";
import { 
  User, 
  Edit3, 
  Check, 
  Award, 
  BookOpen, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Activity, 
  History, 
  FileText, 
  RotateCcw,
  Sparkles,
  ChevronLeft
} from "lucide-react";

interface StudentProfileDashboardProps {
  profile: { id: string; name: string };
  setProfile: (p: { id: string; name: string }) => void;
  attempts: ExamAttempt[];
  colleges: College[];
  onReviewAttempt: (attempt: ExamAttempt) => void;
  onClearHistory: () => void;
}

export const StudentProfileDashboard: React.FC<StudentProfileDashboardProps> = ({
  profile,
  setProfile,
  attempts,
  colleges,
  onReviewAttempt,
  onClearHistory,
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(profile.name);

  const handleSaveName = () => {
    const trimmed = nameInput.trim();
    if (trimmed) {
      const updated = { ...profile, name: trimmed };
      setProfile(updated);
      localStorage.setItem("sanaa_student_profile", JSON.stringify(updated));
    }
    setIsEditingName(false);
  };

  // Extract all subjects in the system
  const allSubjects = useMemo(() => {
    const list: Array<{ collegeName: string; levelName: string; sub: Subject }> = [];
    colleges.forEach((c) => {
      c.levels.forEach((l) => {
        l.subjects.forEach((s) => {
          list.push({ collegeName: c.name, levelName: l.name, sub: s });
        });
      });
    });
    return list;
  }, [colleges]);

  // Map subjects with attempts
  const subjectProgress = useMemo(() => {
    const totalCount = allSubjects.length;
    if (totalCount === 0) return { finished: [], remaining: [], rate: 0 };

    const finishedMap: { [subId: string]: boolean } = {};
    attempts.forEach((att) => {
      if (att.percentage >= 50) {
        finishedMap[att.subjectId] = true;
      }
    });

    const finishedList = allSubjects.filter((item) => finishedMap[item.sub.id]);
    const remainingList = allSubjects.filter((item) => !finishedMap[item.sub.id]);
    const completionRate = Math.round((finishedList.length / totalCount) * 100);

    return {
      finished: finishedList,
      remaining: remainingList,
      rate: completionRate,
    };
  }, [allSubjects, attempts]);

  // Statistics
  const stats = useMemo(() => {
    if (attempts.length === 0) {
      return { count: 0, average: 0, passCount: 0, failCount: 0, maxScore: 0 };
    }

    const totalPercentage = attempts.reduce((acc, curr) => acc + curr.percentage, 0);
    const passCount = attempts.filter((a) => a.percentage >= 50).length;
    const maxScore = Math.max(...attempts.map((a) => a.percentage));

    return {
      count: attempts.length,
      average: Math.round(totalPercentage / attempts.length),
      passCount,
      failCount: attempts.length - passCount,
      maxScore,
    };
  }, [attempts]);

  return (
    <div className="space-y-6">
      {/* Student identity Card & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Identity Widget */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-xs flex flex-col justify-between transition-colors">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 font-mono font-bold px-3 py-1 rounded-full">
                ID: {profile.id}
              </span>
              <span className="flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-500 font-bold">
                <Sparkles size={12} />
                <span>حساب الطالب النشط</span>
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center font-bold shadow-xs">
                <User size={28} />
              </div>
              <div className="space-y-1">
                {isEditingName ? (
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500 w-36"
                      autoFocus
                    />
                    <button
                      onClick={handleSaveName}
                      className="p-1 bg-emerald-600 text-white rounded-lg cursor-pointer"
                    >
                      <Check size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                      {profile.name}
                    </h4>
                    <button
                      onClick={() => setIsEditingName(true)}
                      className="text-slate-400 hover:text-emerald-600 transition cursor-pointer"
                    >
                      <Edit3 size={13} />
                    </button>
                  </div>
                )}
                <p className="text-[10px] text-slate-400">طالب في جامعة صنعاء</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-700 mt-4 flex items-center justify-between text-xs text-slate-400">
            <span>تاريخ التسجيل بالمنصة</span>
            <span className="font-semibold text-slate-650 dark:text-slate-300">اليوم تلقائياً</span>
          </div>
        </div>

        {/* Completion Rate Dial */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-xs transition-colors flex items-center justify-between">
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400">نسبة الإنجاز الأكاديمي</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              تحسب هذه النسبة بناءً على المواد التي اجتزتها بنجاح بمعدل (٥٠٪ أو أعلى).
            </p>
            <div className="flex gap-4 text-[10px] font-bold">
              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                ● {subjectProgress.finished.length} مواد منجزة
              </span>
              <span className="text-slate-400 flex items-center gap-1">
                ● {subjectProgress.remaining.length} مواد متبقية
              </span>
            </div>
          </div>

          <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
            {/* SVG circle meter */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="38"
                className="stroke-slate-100 dark:stroke-slate-700"
                strokeWidth="7"
                fill="transparent"
              />
              <circle
                cx="48"
                cy="48"
                r="38"
                className="stroke-emerald-500"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={238.7}
                strokeDashoffset={238.7 - (238.7 * subjectProgress.rate) / 100}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-lg font-extrabold text-slate-900 dark:text-white block leading-none">
                {subjectProgress.rate}%
              </span>
            </div>
          </div>
        </div>

        {/* Stats Summary Panel */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-xs transition-colors">
          <h4 className="text-xs font-bold text-slate-400 pb-3 border-b border-slate-100 dark:border-slate-700 mb-3 flex items-center gap-1">
            <Activity size={14} className="text-indigo-500" />
            <span>إحصائيات التدريب الشخصية</span>
          </h4>
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center p-2.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl">
              <span className="text-[9px] font-bold text-slate-400 block">المحاولات</span>
              <span className="text-base font-extrabold text-slate-900 dark:text-white block mt-0.5">
                {stats.count}
              </span>
            </div>
            <div className="text-center p-2.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl">
              <span className="text-[9px] font-bold text-slate-400 block">متوسط النجاح</span>
              <span className={`text-base font-extrabold block mt-0.5 ${stats.average >= 50 ? "text-emerald-600" : "text-red-500"}`}>
                {stats.average}%
              </span>
            </div>
            <div className="text-center p-2.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl">
              <span className="text-[9px] font-bold text-slate-400 block">أعلى درجة</span>
              <span className="text-base font-extrabold text-indigo-500 block mt-0.5">
                {stats.maxScore}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid for Subject list and Attempts history */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Attempts History List */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-xs transition-colors space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
              <History size={16} className="text-amber-500" />
              <span>سجل محاولات الاختبارات السابقة</span>
            </h3>
            {attempts.length > 0 && (
              <button
                onClick={onClearHistory}
                className="text-[10px] text-red-500 hover:underline font-bold"
              >
                مسح السجل
              </button>
            )}
          </div>

          {attempts.length === 0 ? (
            <div className="text-center py-8 bg-slate-50/50 dark:bg-slate-900/30 rounded-xl border border-dashed border-slate-200 dark:border-slate-750">
              <p className="text-xs text-slate-400 font-medium">لا توجد اختبارات سابقة مسجلة لك بعد.</p>
              <p className="text-[10px] text-slate-400 mt-1">ابدأ بأول اختبار تجريبي وسجل تقدمك مباشرة.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-750 text-slate-400 font-bold">
                    <th className="pb-2">المادة / النموذج</th>
                    <th className="pb-2">النتيجة</th>
                    <th className="pb-2 hidden sm:table-cell">الوقت المستغرق</th>
                    <th className="pb-2 hidden sm:table-cell">التاريخ</th>
                    <th className="pb-2 text-left">الإجراء</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-750">
                  {attempts.map((att) => {
                    const isPass = att.percentage >= 50;
                    return (
                      <tr key={att.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                        <td className="py-3">
                          <div className="font-extrabold text-slate-850 dark:text-slate-200">
                            {att.subjectName}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {att.collegeName} • {att.periodName} ({att.yearName})
                          </div>
                        </td>
                        <td className="py-3">
                          <span className={`inline-flex items-center gap-1 font-extrabold text-xs px-2 py-0.5 rounded-lg ${
                            isPass 
                              ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400" 
                              : "bg-red-50 text-red-500 dark:bg-red-950/30 dark:text-red-400"
                          }`}>
                            {att.score}/{att.totalQuestions} ({att.percentage}%)
                          </span>
                        </td>
                        <td className="py-3 font-mono text-slate-500 dark:text-slate-400 hidden sm:table-cell">
                          {Math.floor(att.timeTaken / 60)}د {att.timeTaken % 60}ث
                        </td>
                        <td className="py-3 text-[10px] text-slate-400 hidden sm:table-cell">
                          {new Date(att.timestamp).toLocaleDateString("ar-YE")}
                        </td>
                        <td className="py-3 text-left">
                          <button
                            onClick={() => onReviewAttempt(att)}
                            className="text-[10px] font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-650 px-2.5 py-1.5 rounded-lg text-slate-700 dark:text-slate-300 transition cursor-pointer inline-flex items-center gap-0.5"
                          >
                            <span>مراجعة</span>
                            <ChevronLeft size={10} className="transform rotate-180" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Subjects list dashboard widget */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-xs transition-colors space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
            <BookOpen size={16} className="text-emerald-600" />
            <span>تفصيل إنجاز المواد ({allSubjects.length})</span>
          </h3>

          <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
            {allSubjects.length === 0 ? (
              <p className="text-xs text-slate-400">لا توجد كليات ومواد مضافة في النظام حالياً.</p>
            ) : (
              allSubjects.map((item, index) => {
                const subAttempts = attempts.filter((a) => a.subjectId === item.sub.id);
                const isPassed = subAttempts.some((a) => a.percentage >= 50);
                const attempted = subAttempts.length > 0;

                return (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-800"
                  >
                    <div className="space-y-0.5 max-w-[70%]">
                      <span className="text-[10px] text-slate-400 block truncate">
                        {item.collegeName} • {item.levelName}
                      </span>
                      <span className="text-[11px] font-extrabold text-slate-800 dark:text-white truncate block">
                        {item.sub.name}
                      </span>
                    </div>

                    <div className="shrink-0">
                      {isPassed ? (
                        <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 px-2 py-1 rounded-full font-bold">
                          <CheckCircle2 size={11} />
                          <span>مكتملة</span>
                        </span>
                      ) : attempted ? (
                        <span className="inline-flex items-center gap-1 text-[10px] bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-500 px-2 py-1 rounded-full font-bold">
                          <AlertCircle size={11} />
                          <span>قيد التدريب</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 px-2 py-1 rounded-full font-semibold">
                          <span>غير مفتوحة</span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from "react";
import { College, Level, Subject, Year, Period, ExamAttempt } from "../types";
import { BookOpen, GraduationCap, Calendar, Clock, ChevronLeft, User, Award, Activity } from "lucide-react";
import { StudentProfileDashboard } from "./StudentProfileDashboard";

interface PortalHomeProps {
  colleges: College[];
  selectedCollegeId: string;
  setSelectedCollegeId: (id: string) => void;
  selectedLevelId: string;
  setSelectedLevelId: (id: string) => void;
  selectedSubjectId: string;
  setSelectedSubjectId: (id: string) => void;
  selectedYearId: string;
  setSelectedYearId: (id: string) => void;
  selectedPeriodId: string;
  setSelectedPeriodId: (id: string) => void;
  shuffleQuestions: boolean;
  setShuffleQuestions: (b: boolean) => void;
  shuffleOptions: boolean;
  setShuffleOptions: (b: boolean) => void;
  onStartExam: () => void;
  studentProfile: { id: string; name: string };
  setStudentProfile: (p: { id: string; name: string }) => void;
  attempts: ExamAttempt[];
  onReviewAttempt: (attempt: ExamAttempt) => void;
  onClearHistory: () => void;
  pendingResumeState: any;
  onResumePrevious: () => void;
  onDismissPrevious: () => void;
}

export const PortalHome: React.FC<PortalHomeProps> = ({
  colleges,
  selectedCollegeId,
  setSelectedCollegeId,
  selectedLevelId,
  setSelectedLevelId,
  selectedSubjectId,
  setSelectedSubjectId,
  selectedYearId,
  setSelectedYearId,
  selectedPeriodId,
  setSelectedPeriodId,
  shuffleQuestions,
  setShuffleQuestions,
  shuffleOptions,
  setShuffleOptions,
  onStartExam,
  studentProfile,
  setStudentProfile,
  attempts,
  onReviewAttempt,
  onClearHistory,
  pendingResumeState,
  onResumePrevious,
  onDismissPrevious,
}) => {
  const [activeTab, setActiveTab] = useState<"selector" | "student">("selector");

  // Find current active selections for sub-dropdown cascades
  const currentCollege = colleges.find((c) => c.id === selectedCollegeId);
  const currentLevel = currentCollege?.levels.find((l) => l.id === selectedLevelId);
  const currentSubject = currentLevel?.subjects.find((s) => s.id === selectedSubjectId);
  const currentYear = currentSubject?.years.find((y) => y.id === selectedYearId);
  const currentPeriod = currentYear?.periods.find((p) => p.id === selectedPeriodId);

  const handleCollegeChange = (id: string) => {
    setSelectedCollegeId(id);
    setSelectedLevelId("");
    setSelectedSubjectId("");
    setSelectedYearId("");
    setSelectedPeriodId("");
  };

  const handleLevelChange = (id: string) => {
    setSelectedLevelId(id);
    setSelectedSubjectId("");
    setSelectedYearId("");
    setSelectedPeriodId("");
  };

  const handleSubjectChange = (id: string) => {
    setSelectedSubjectId(id);
    setSelectedYearId("");
    setSelectedPeriodId("");
  };

  const handleYearChange = (id: string) => {
    setSelectedYearId(id);
    setSelectedPeriodId("");
  };

  const handlePeriodChange = (id: string) => {
    setSelectedPeriodId(id);
  };

  const hasQuestions = currentPeriod && currentPeriod.questions && currentPeriod.questions.length > 0;

  return (
    <div id="portalSection" className="w-full space-y-6">
      {/* Welcome Banner Card */}
      <div className="bg-gradient-to-br from-emerald-800 to-emerald-950 text-white rounded-2xl p-6 sm:p-8 text-center shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="relative z-10 space-y-3">
          <span className="bg-amber-500 text-slate-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-block">
            البوابة الطلابية الرسمية
          </span>
          <h2 className="text-xl sm:text-3xl font-extrabold leading-tight">
            مرحباً بك {studentProfile.name} في منصة الاختبارات التجريبية
          </h2>
          <p className="text-sm sm:text-base text-emerald-100 max-w-xl mx-auto">
            مرحباً بك في المنصة المخصصة لطلاب جامعة صنعاء للتدريب على نماذج الامتحانات السابقة في كافة الكليات والمستويات. اختر خيارات نموذجك أدناه للبدء فوراً.
          </p>
        </div>
      </div>

      {/* Pending Resume Active Exam Toast Alert */}
      {pendingResumeState && (
        <div className="bg-amber-500/10 border border-amber-500/30 dark:bg-amber-500/5 text-amber-800 dark:text-amber-400 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-pulse">
          <div className="space-y-1">
            <h4 className="text-sm font-extrabold flex items-center gap-2">
              <Clock size={16} />
              <span>لديك جلسة اختبار قيد الحل لم تكتمل!</span>
            </h4>
            <p className="text-xs opacity-90">
              يمكنك استئناف نموذج <strong>{pendingResumeState.examState?.shuffledQuestions?.length} أسئلة</strong> من حيث توقفت والمحافظة على وقتك المتبقي وإجاباتك.
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={onResumePrevious}
              className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-extrabold px-4 py-2.5 rounded-xl transition cursor-pointer"
            >
              استئناف الاختبار الآن
            </button>
            <button
              onClick={onDismissPrevious}
              className="bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-350 text-xs font-bold px-3 py-2.5 rounded-xl transition cursor-pointer"
            >
              بدء جديد وحذف السابق
            </button>
          </div>
        </div>
      )}

      {/* Segment controller */}
      <div className="flex bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl max-w-md mx-auto transition-colors">
        <button
          onClick={() => setActiveTab("selector")}
          className={`flex-1 text-center py-2.5 rounded-xl text-xs font-extrabold transition cursor-pointer ${
            activeTab === "selector"
              ? "bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
          }`}
        >
          اختيار نموذج واختبار
        </button>
        <button
          onClick={() => setActiveTab("student")}
          className={`flex-1 text-center py-2.5 rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === "student"
              ? "bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-ping"></span>
          ملف الطالب والتقدم
        </button>
      </div>

      {/* Conditional Tabs Render */}
      {activeTab === "student" ? (
        <StudentProfileDashboard
          profile={studentProfile}
          setProfile={setStudentProfile}
          attempts={attempts}
          colleges={colleges}
          onReviewAttempt={onReviewAttempt}
          onClearHistory={onClearHistory}
        />
      ) : (
        <div className="space-y-6">
          {/* Selector cascading card */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-md border border-slate-100 dark:border-slate-700 space-y-6 transition-colors">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-700 flex items-center gap-2">
              <span className="w-2.5 h-5 bg-emerald-600 rounded-full inline-block"></span>
              تحديد مسار وقناة الاختبار
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* 1. College Select */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <GraduationCap size={14} className="text-emerald-600" />
                  <span>الكلية / التخصص</span>
                </label>
                <select
                  id="collegeSelect"
                  value={selectedCollegeId}
                  onChange={(e) => handleCollegeChange(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all cursor-pointer text-slate-800 dark:text-slate-100"
                >
                  <option value="">-- اختر الكلية --</option>
                  {colleges.map((col) => (
                    <option key={col.id} value={col.id}>
                      {col.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 2. Level Select */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <BookOpen size={14} className="text-emerald-600" />
                  <span>المستوى الدراسي</span>
                </label>
                <select
                  id="levelSelect"
                  value={selectedLevelId}
                  disabled={!selectedCollegeId}
                  onChange={(e) => handleLevelChange(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all cursor-pointer text-slate-800 dark:text-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">-- اختر المستوى --</option>
                  {currentCollege?.levels.map((lvl) => (
                    <option key={lvl.id} value={lvl.id}>
                      {lvl.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 3. Subject Select */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <BookOpen size={14} className="text-emerald-600" />
                  <span>المادة الدراسية</span>
                </label>
                <select
                  id="subjectSelect"
                  value={selectedSubjectId}
                  disabled={!selectedLevelId}
                  onChange={(e) => handleSubjectChange(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all cursor-pointer text-slate-800 dark:text-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">-- اختر المادة --</option>
                  {currentLevel?.subjects.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 4. Year Select */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Calendar size={14} className="text-emerald-600" />
                  <span>السنة / العام الدراسي</span>
                </label>
                <select
                  id="yearSelect"
                  value={selectedYearId}
                  disabled={!selectedSubjectId}
                  onChange={(e) => handleYearChange(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all cursor-pointer text-slate-800 dark:text-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">-- اختر السنة --</option>
                  {currentSubject?.years.map((yr) => (
                    <option key={yr.id} value={yr.id}>
                      {yr.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 5. Period Select */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Clock size={14} className="text-emerald-600" />
                  <span>الفترة الزمنية / النموذج</span>
                </label>
                <select
                  id="periodSelect"
                  value={selectedPeriodId}
                  disabled={!selectedYearId}
                  onChange={(e) => handlePeriodChange(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all cursor-pointer text-slate-800 dark:text-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">-- اختر الفترة --</option>
                  {currentYear?.periods.map((per) => (
                    <option key={per.id} value={per.id}>
                      {per.name} ({per.questions?.length || 0} سؤالاً)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Options configuration checkmark fields */}
            {selectedPeriodId && (
              <div id="examConfigPanel" className="pt-5 border-t border-slate-100 dark:border-slate-700 space-y-3.5 animate-fade-in">
                <h4 className="text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">
                  خيارات إضافية لتخصيص محرك الأسئلة:
                </h4>
                <div className="flex flex-wrap gap-6 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl">
                  <label className="flex items-center gap-2.5 cursor-pointer text-sm font-semibold text-slate-700 dark:text-slate-300 select-none">
                    <input
                      type="checkbox"
                      checked={shuffleQuestions}
                      onChange={(e) => setShuffleQuestions(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500 w-4.5 h-4.5 border-slate-350 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                    <span>خلط عشوائي لترتيب الأسئلة</span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer text-sm font-semibold text-slate-700 dark:text-slate-300 select-none">
                    <input
                      type="checkbox"
                      checked={shuffleOptions}
                      onChange={(e) => setShuffleOptions(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500 w-4.5 h-4.5 border-slate-350 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                    <span>خلط عشوائي للخيارات الأربعة</span>
                  </label>
                </div>
              </div>
            )}

            {/* Start button trigger */}
            <div className="pt-2">
              <button
                id="startExamBtn"
                onClick={onStartExam}
                disabled={!selectedPeriodId || !hasQuestions}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 dark:disabled:bg-slate-700 disabled:text-slate-400 dark:disabled:text-slate-500 text-white font-extrabold py-4 px-6 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:cursor-not-allowed"
              >
                <span>ابدأ التدريب والاختبار الآن</span>
                <ChevronLeft size={20} className="transform rotate-180" />
              </button>
              {selectedPeriodId && !hasQuestions && (
                <p className="text-center text-xs text-red-500 font-bold mt-2">
                  تنبيه: هذا النموذج فارغ حالياً من الأسئلة. الرجاء التوجه للوحة التحكم لإضافة أسئلة أو تجربة نموذج آخر.
                </p>
              )}
            </div>
          </div>

          {/* Helpful Quick Tips Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-100/50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200/50 dark:border-slate-750 text-center space-y-1.5 transition-colors">
              <span className="text-xl">⏱️</span>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">مؤقت تفاعلي حقيقي</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                يتم حساب وقت تلقائي للنموذج لتمكينك من التدرب على سرعة الحل في الامتحانات الرسمية.
              </p>
            </div>
            <div className="bg-slate-100/50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200/50 dark:border-slate-750 text-center space-y-1.5 transition-colors">
              <span className="text-xl">💾</span>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">حفظ تلقائي وفوري</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                لا داعي للقلق عند تدوير الهاتف أو الخروج، حيث يتم حفظ إجاباتك فورياً وتلقائياً.
              </p>
            </div>
            <div className="bg-slate-100/50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200/50 dark:border-slate-750 text-center space-y-1.5 transition-colors">
              <span className="text-xl">📋</span>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">مراجعة شاملة</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                ستحصل فور الانتهاء على تقرير كامل يوضح إجاباتك مع تبيين الصواب والخطأ مع الشرح.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

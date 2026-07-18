import { College } from "../types";

export function exportToStandaloneHTML(collegesData: College[]): string {
  const jsonString = JSON.stringify(collegesData);

  // We write a beautifully-crafted standalone HTML file that contains:
  // 1. Tailwind CDN for gorgeous layout rendering.
  // 2. Custom CSS variables and styles for perfect transitions and typography.
  // 3. Fully localized Arabic interface (RTL).
  // 4. State management in pure ES6 JavaScript.
  // 5. Features: College flow selection, interactive quiz, timer, progress, grid navigation, results with correction, retake, shuffle, and a standalone offline local storage!
  // 6. Embedded SVG logo of Sana'a University.
  
  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>منصة الاختبارات الإلكترونية - جامعة صنعاء</title>
    <!-- Tailwind CSS v4 CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Font Tajawal -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
    
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['Tajawal', 'sans-serif'],
                        mono: ['JetBrains Mono', 'monospace'],
                    },
                    colors: {
                        emerald: {
                            50: '#ecfdf5',
                            100: '#d1fae5',
                            600: '#059669',
                            700: '#047857',
                            800: '#065f46',
                            900: '#064e3b',
                        }
                    }
                }
            }
        }
    </script>
    <style>
        body {
            font-family: 'Tajawal', sans-serif;
            transition: background-color 0.3s, color 0.3s;
        }
        /* Custom scrollbar */
        ::-webkit-scrollbar {
            width: 6px;
            height: 6px;
        }
        ::-webkit-scrollbar-track {
            background: transparent;
        }
        ::-webkit-scrollbar-thumb {
            background: #d1d5db;
            border-radius: 4px;
        }
        .dark ::-webkit-scrollbar-thumb {
            background: #4b5563;
        }
    </style>
</head>
<body class="bg-slate-50 text-slate-800 dark:bg-slate-900 dark:text-slate-100 min-h-screen flex flex-col antialiased">

    <!-- Header -->
    <header class="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-100 dark:border-slate-700 sticky top-0 z-40 transition-colors">
        <div class="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <div class="flex items-center gap-3">
                <!-- SVG University Logo -->
                <div class="w-12 h-12 flex-shrink-0">
                    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
                        <path d="M100 10 L178 55 L178 145 L100 190 L22 145 L22 55 Z" fill="#065F46" stroke="#D97706" strokeWidth="6" strokeLinejoin="round"/>
                        <path d="M100 20 L169 60 L169 140 L100 180 L31 140 L31 60 Z" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinejoin="round"/>
                        <path d="M65 130 L65 95 L80 95 L80 75 L120 75 L120 95 L135 95 L135 130 Z" fill="#FFFDF5" stroke="#D97706" strokeWidth="3"/>
                        <path d="M90 85 Q100 72 110 85 Z" fill="#D97706" />
                        <circle cx="100" cy="102" r="6" fill="#059669" />
                        <path d="M100 135 C85 125 55 125 45 135 V155 C55 145 85 145 100 155 C115 145 145 145 155 155 V135 C145 125 115 125 100 135 Z" fill="#FFFFFF" stroke="#D97706" strokeWidth="3"/>
                        <line x1="100" y1="135" x2="100" y2="155" stroke="#D97706" strokeWidth="2" />
                    </svg>
                </div>
                <div>
                    <h1 class="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-tight">جامعة صنعاء</h1>
                    <p class="text-[10px] sm:text-xs text-amber-600 dark:text-amber-500 font-medium">اللجنة العلمية المركزية</p>
                </div>
            </div>
            
            <div class="flex items-center gap-2">
                <!-- Theme Toggle Button -->
                <button id="themeToggleBtn" onclick="toggleTheme()" class="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition" title="تبديل المظهر">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 dark:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 hidden dark:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                    </svg>
                </button>
            </div>
        </div>
    </header>

    <!-- Main Container -->
    <main class="flex-grow max-w-4xl mx-auto w-full px-4 py-6 flex flex-col justify-start">
        
        <!-- Section: Welcome & Selection -->
        <div id="selectionSection" class="w-full space-y-6">
            <!-- Welcome Card -->
            <div class="bg-gradient-to-br from-emerald-800 to-emerald-950 text-white rounded-2xl p-6 sm:p-8 text-center shadow-lg relative overflow-hidden">
                <div class="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
                <div class="relative z-10 space-y-3">
                    <span class="bg-amber-500 text-slate-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-block">النسخة المستقلة دون إنترنت</span>
                    <h2 class="text-xl sm:text-3xl font-extrabold leading-tight">منصة الاختبارات الإلكترونية</h2>
                    <p class="text-sm sm:text-base text-emerald-100 max-w-xl mx-auto">أهلاً بك في البوابة الرسمية للطلاب واللجان العلمية. يرجى اختيار كليتك ومستواك لبدء التدريب على نماذج الامتحانات السابقة.</p>
                </div>
            </div>

            <!-- Flow Dropdowns -->
            <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-md border border-slate-100 dark:border-slate-700 space-y-4 transition-colors">
                <h3 class="text-lg font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-700 flex items-center gap-2">
                    <span class="w-2 h-5 bg-emerald-600 rounded-full inline-block"></span>
                    تحديد مسار الاختبار
                </h3>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- College Dropdown -->
                    <div class="space-y-1.5">
                        <label class="text-xs font-bold text-slate-500 dark:text-slate-400">الكلية / التخصص</label>
                        <select id="collegeSelect" onchange="onCollegeChange()" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors">
                            <option value="">-- اختر الكلية --</option>
                        </select>
                    </div>

                    <!-- Level Dropdown -->
                    <div class="space-y-1.5">
                        <label class="text-xs font-bold text-slate-500 dark:text-slate-400">المستوى الدراسي</label>
                        <select id="levelSelect" onchange="onLevelChange()" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors" disabled>
                            <option value="">-- اختر المستوى --</option>
                        </select>
                    </div>

                    <!-- Subject Dropdown -->
                    <div class="space-y-1.5">
                        <label class="text-xs font-bold text-slate-500 dark:text-slate-400">المادة الدراسية</label>
                        <select id="subjectSelect" onchange="onSubjectChange()" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors" disabled>
                            <option value="">-- اختر المادة --</option>
                        </select>
                    </div>

                    <!-- Year Dropdown -->
                    <div class="space-y-1.5">
                        <label class="text-xs font-bold text-slate-500 dark:text-slate-400">سنة النموذج</label>
                        <select id="yearSelect" onchange="onYearChange()" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors" disabled>
                            <option value="">-- اختر السنة --</option>
                        </select>
                    </div>

                    <!-- Period Dropdown -->
                    <div class="space-y-1.5 md:col-span-2">
                        <label class="text-xs font-bold text-slate-500 dark:text-slate-400">الفترة الزمنية / النموذج</label>
                        <select id="periodSelect" onchange="onPeriodChange()" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors" disabled>
                            <option value="">-- اختر الفترة --</option>
                        </select>
                    </div>
                </div>

                <!-- Exam Config Checkboxes -->
                <div id="examConfig" class="pt-4 border-t border-slate-100 dark:border-slate-700 space-y-3 hidden">
                    <h4 class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">خيارات إضافية لتخصيص الاختبار:</h4>
                    <div class="flex flex-wrap gap-4">
                        <label class="flex items-center gap-2 cursor-pointer text-sm font-medium">
                            <input type="checkbox" id="shuffleQuestions" class="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4">
                            <span>خلط عشوائي للأسئلة</span>
                        </label>
                        <label class="flex items-center gap-2 cursor-pointer text-sm font-medium">
                            <input type="checkbox" id="shuffleOptions" class="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4">
                            <span>خلط عشوائي للخيارات الأربعة</span>
                        </label>
                    </div>
                </div>

                <div class="pt-4">
                    <button id="startExamBtn" onclick="startExam()" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-xl shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2" disabled>
                        <span>ابدأ الاختبار الآن</span>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L9.414 11H13a1 1 0 100-2H9.414l1.293-1.293z" clip-rule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>

        <!-- Section: Active Exam Screen -->
        <div id="examSection" class="w-full space-y-4 hidden">
            <!-- Top stats card -->
            <div class="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-100 dark:border-slate-700 flex flex-wrap items-center justify-between gap-4 transition-colors">
                <div class="flex items-center gap-2">
                    <span class="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></span>
                    <span id="activeExamTitle" class="text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300">جاري تحميل الاختبار...</span>
                </div>
                
                <div class="flex items-center gap-3">
                    <!-- Timer Widget -->
                    <div class="flex items-center gap-1.5 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 px-3 py-1.5 rounded-lg border border-red-100 dark:border-red-900/50 font-bold text-xs sm:text-sm font-mono">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span id="examTimer">45:00</span>
                    </div>

                    <!-- Question Tracker -->
                    <div class="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-lg font-bold text-xs sm:text-sm">
                        السؤال: <span id="currentQuestionNum">1</span> / <span id="totalQuestionsNum">50</span>
                    </div>
                </div>
            </div>

            <!-- Progress Bar -->
            <div class="space-y-1">
                <div class="flex justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <span>نسبة الإجابة والتقدم</span>
                    <span id="progressPercentage">0%</span>
                </div>
                <div class="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                    <div id="progressBar" class="bg-emerald-600 h-full w-0 transition-all duration-300"></div>
                </div>
            </div>

            <!-- Question Card -->
            <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-md border border-slate-100 dark:border-slate-700 space-y-6 transition-colors">
                <div class="space-y-2">
                    <span class="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-md">السؤال الرقمي</span>
                    <h3 id="questionText" class="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">أين يقع السؤال المختار هنا؟</h3>
                </div>

                <!-- Choices Container -->
                <div id="choicesContainer" class="grid grid-cols-1 gap-3">
                    <!-- Dynamic choices go here -->
                </div>
            </div>

            <!-- Navigation Buttons -->
            <div class="flex items-center justify-between gap-4">
                <button onclick="prevQuestion()" id="prevBtn" class="flex-1 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white font-bold py-3 px-4 rounded-xl shadow-sm transition flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                    </svg>
                    <span>السابق</span>
                </button>

                <button onclick="nextQuestion()" id="nextBtn" class="flex-1 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white font-bold py-3 px-4 rounded-xl shadow-sm transition flex items-center justify-center gap-2">
                    <span>التالي</span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                </button>
            </div>

            <!-- Question Navigator Grid Trigger & Finish Trigger -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button onclick="toggleNavigator()" class="bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-bold py-2.5 px-4 rounded-xl text-xs transition flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                    <span>عرض لوحة التنقل بين الأسئلة</span>
                </button>

                <button onclick="confirmFinishExam()" class="bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow transition flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>إنهاء وتسليم الاختبار</span>
                </button>
            </div>

            <!-- Navigation Panel / Question Grid -->
            <div id="navigatorPanel" class="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-md border border-slate-100 dark:border-slate-700 space-y-3 hidden transition-colors">
                <h4 class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">خريطة الأسئلة (اضغط للانتقال السريع):</h4>
                <div id="navigatorGrid" class="flex flex-wrap gap-2">
                    <!-- Dynamic buttons go here -->
                </div>
            </div>
        </div>

        <!-- Section: Exam Results Summary -->
        <div id="resultsSection" class="w-full space-y-6 hidden">
            <!-- Main Score Card -->
            <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 shadow-md border border-slate-100 dark:border-slate-700 text-center space-y-6 transition-colors">
                <div class="space-y-1">
                    <span class="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1 rounded-full uppercase tracking-wider inline-block">نتيجة الاختبار</span>
                    <h2 id="resultCourseTitle" class="text-lg font-bold text-slate-900 dark:text-white">قانون العقوبات - 2025</h2>
                    <p id="resultPeriodName" class="text-xs text-slate-400">الفترة الأولى</p>
                </div>

                <!-- Big Circular Score Display -->
                <div class="relative w-36 h-36 mx-auto flex items-center justify-center">
                    <svg class="w-full h-full transform -rotate-90">
                        <circle cx="72" cy="72" r="64" stroke="#e2e8f0" stroke-width="8" fill="transparent" class="dark:stroke-slate-700" />
                        <circle id="resultProgressRing" cx="72" cy="72" r="64" stroke="#059669" stroke-width="8" fill="transparent" stroke-dasharray="402" stroke-dashoffset="402" stroke-linecap="round" class="transition-all duration-1000" />
                    </svg>
                    <div class="absolute inset-0 flex flex-col items-center justify-center">
                        <span id="resultPercentageText" class="text-3xl font-extrabold text-slate-900 dark:text-white">0%</span>
                        <span id="resultScoreFraction" class="text-xs text-slate-400 font-bold">0 / 0</span>
                    </div>
                </div>

                <!-- Score Status Badge -->
                <div>
                    <span id="resultStatusBadge" class="px-4 py-1.5 rounded-full text-sm font-bold shadow-sm">جاري احتساب النتيجة...</span>
                </div>

                <!-- Quick Stats -->
                <div class="grid grid-cols-3 gap-2 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl transition-colors">
                    <div class="text-center space-y-1">
                        <span class="text-slate-400 text-[10px] font-bold block">إجابات صحيحة</span>
                        <span id="correctAnswersCount" class="text-emerald-600 dark:text-emerald-400 font-extrabold text-lg">0</span>
                    </div>
                    <div class="text-center space-y-1 border-x border-slate-200 dark:border-slate-700">
                        <span class="text-slate-400 text-[10px] font-bold block">إجابات خاطئة</span>
                        <span id="wrongAnswersCount" class="text-red-500 font-extrabold text-lg">0</span>
                    </div>
                    <div class="text-center space-y-1">
                        <span class="text-slate-400 text-[10px] font-bold block">الوقت المستغرق</span>
                        <span id="timeElapsedText" class="text-slate-700 dark:text-slate-300 font-extrabold text-sm sm:text-base font-mono">00:00</span>
                    </div>
                </div>

                <div class="flex flex-wrap gap-3">
                    <button onclick="restartActiveExam()" class="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-xl shadow transition flex items-center justify-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 110 2H4a1 1 0 01-1-1V3a1 1 0 011-1z" clip-rule="evenodd" />
                        </svg>
                        <span>إعادة الاختبار</span>
                    </button>
                    
                    <button onclick="backToSelection()" class="flex-1 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white font-bold py-3 px-6 rounded-xl shadow-sm transition flex items-center justify-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
                        </svg>
                        <span>العودة للرئيسية</span>
                    </button>
                </div>
            </div>

            <!-- Detailed Questions Corrections -->
            <div class="space-y-4">
                <h3 class="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span class="w-2 h-5 bg-amber-500 rounded-full inline-block"></span>
                    مراجعة تفصيلية للإجابات:
                </h3>
                
                <div id="correctionsContainer" class="space-y-4">
                    <!-- Dynamic review items go here -->
                </div>
            </div>
        </div>

    </main>

    <!-- Footer -->
    <footer class="bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 py-4 text-center text-xs text-slate-400 transition-colors">
        <p>© 2026 اللجنة العلمية المركزية - جامعة صنعاء. جميع الحقوق محفوظة.</p>
        <p class="mt-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">تم التصميم والتطوير خصيصاً لتيسير المذاكرة والمراجعة.</p>
    </footer>

    <!-- JS Logic Core -->
    <script>
        // Data Store injected directly
        const COLLEGES_DATA = ${jsonString};

        // UI State
        let currentCollegeId = "";
        let currentLevelId = "";
        let currentSubjectId = "";
        let currentYearId = "";
        let currentPeriodId = "";

        // Exam State
        let selectedPeriod = null;
        let shuffledQuestions = [];
        let originalToShuffledIndices = [];
        let optionOrderMap = {}; // questionId -> option indices order
        let userAnswers = {}; // questionId -> selectedIndex (in the original options order)
        let examTimeLeft = 0; // in seconds
        let examTotalDuration = 0; // in seconds
        let examTimerInterval = null;
        let currentQuestionIndex = 0;

        // Initialize App
        window.addEventListener('DOMContentLoaded', () => {
            // Apply theme on load
            const savedTheme = localStorage.getItem('theme') || 'light';
            if (savedTheme === 'dark' || (savedTheme === 'light' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                // Keep default or user saved
            }
            if (savedTheme === 'dark') {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }

            populateColleges();
        });

        function toggleTheme() {
            if (document.documentElement.classList.contains('dark')) {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('theme', 'light');
            } else {
                document.documentElement.classList.add('dark');
                localStorage.setItem('theme', 'dark');
            }
        }

        // Dropdowns population logic
        function populateColleges() {
            const select = document.getElementById('collegeSelect');
            select.innerHTML = '<option value="">-- اختر الكلية --</option>';
            COLLEGES_DATA.forEach(college => {
                const opt = document.createElement('option');
                opt.value = college.id;
                opt.textContent = college.name;
                select.appendChild(opt);
            });
        }

        function onCollegeChange() {
            currentCollegeId = document.getElementById('collegeSelect').value;
            currentLevelId = "";
            currentSubjectId = "";
            currentYearId = "";
            currentPeriodId = "";

            const levelSelect = document.getElementById('levelSelect');
            const subjectSelect = document.getElementById('subjectSelect');
            const yearSelect = document.getElementById('yearSelect');
            const periodSelect = document.getElementById('periodSelect');
            const startBtn = document.getElementById('startExamBtn');
            const configDiv = document.getElementById('examConfig');

            levelSelect.innerHTML = '<option value="">-- اختر المستوى --</option>';
            levelSelect.disabled = true;
            subjectSelect.innerHTML = '<option value="">-- اختر المادة --</option>';
            subjectSelect.disabled = true;
            yearSelect.innerHTML = '<option value="">-- اختر السنة --</option>';
            yearSelect.disabled = true;
            periodSelect.innerHTML = '<option value="">-- اختر الفترة --</option>';
            periodSelect.disabled = true;
            startBtn.disabled = true;
            configDiv.classList.add('hidden');

            if (!currentCollegeId) return;

            const college = COLLEGES_DATA.find(c => c.id === currentCollegeId);
            if (college && college.levels) {
                college.levels.forEach(level => {
                    const opt = document.createElement('option');
                    opt.value = level.id;
                    opt.textContent = level.name;
                    levelSelect.appendChild(opt);
                });
                levelSelect.disabled = false;
            }
        }

        function onLevelChange() {
            currentLevelId = document.getElementById('levelSelect').value;
            currentSubjectId = "";
            currentYearId = "";
            currentPeriodId = "";

            const subjectSelect = document.getElementById('subjectSelect');
            const yearSelect = document.getElementById('yearSelect');
            const periodSelect = document.getElementById('periodSelect');
            const startBtn = document.getElementById('startExamBtn');
            const configDiv = document.getElementById('examConfig');

            subjectSelect.innerHTML = '<option value="">-- اختر المادة --</option>';
            subjectSelect.disabled = true;
            yearSelect.innerHTML = '<option value="">-- اختر السنة --</option>';
            yearSelect.disabled = true;
            periodSelect.innerHTML = '<option value="">-- اختر الفترة --</option>';
            periodSelect.disabled = true;
            startBtn.disabled = true;
            configDiv.classList.add('hidden');

            if (!currentLevelId) return;

            const college = COLLEGES_DATA.find(c => c.id === currentCollegeId);
            const level = college.levels.find(l => l.id === currentLevelId);
            if (level && level.subjects) {
                level.subjects.forEach(subject => {
                    const opt = document.createElement('option');
                    opt.value = subject.id;
                    opt.textContent = subject.name;
                    subjectSelect.appendChild(opt);
                });
                subjectSelect.disabled = false;
            }
        }

        function onSubjectChange() {
            currentSubjectId = document.getElementById('subjectSelect').value;
            currentYearId = "";
            currentPeriodId = "";

            const yearSelect = document.getElementById('yearSelect');
            const periodSelect = document.getElementById('periodSelect');
            const startBtn = document.getElementById('startExamBtn');
            const configDiv = document.getElementById('examConfig');

            yearSelect.innerHTML = '<option value="">-- اختر السنة --</option>';
            yearSelect.disabled = true;
            periodSelect.innerHTML = '<option value="">-- اختر الفترة --</option>';
            periodSelect.disabled = true;
            startBtn.disabled = true;
            configDiv.classList.add('hidden');

            if (!currentSubjectId) return;

            const college = COLLEGES_DATA.find(c => c.id === currentCollegeId);
            const level = college.levels.find(l => l.id === currentLevelId);
            const subject = level.subjects.find(s => s.id === currentSubjectId);
            if (subject && subject.years) {
                subject.years.forEach(year => {
                    const opt = document.createElement('option');
                    opt.value = year.id;
                    opt.textContent = year.name;
                    yearSelect.appendChild(opt);
                });
                yearSelect.disabled = false;
            }
        }

        function onYearChange() {
            currentYearId = document.getElementById('yearSelect').value;
            currentPeriodId = "";

            const periodSelect = document.getElementById('periodSelect');
            const startBtn = document.getElementById('startExamBtn');
            const configDiv = document.getElementById('examConfig');

            periodSelect.innerHTML = '<option value="">-- اختر الفترة --</option>';
            periodSelect.disabled = true;
            startBtn.disabled = true;
            configDiv.classList.add('hidden');

            if (!currentYearId) return;

            const college = COLLEGES_DATA.find(c => c.id === currentCollegeId);
            const level = college.levels.find(l => l.id === currentLevelId);
            const subject = level.subjects.find(s => s.id === currentSubjectId);
            const year = subject.years.find(y => y.id === currentYearId);
            if (year && year.periods) {
                year.periods.forEach(period => {
                    const opt = document.createElement('option');
                    opt.value = period.id;
                    opt.textContent = period.name;
                    periodSelect.appendChild(opt);
                });
                periodSelect.disabled = false;
            }
        }

        function onPeriodChange() {
            currentPeriodId = document.getElementById('periodSelect').value;
            const startBtn = document.getElementById('startExamBtn');
            const configDiv = document.getElementById('examConfig');

            if (currentPeriodId) {
                startBtn.disabled = false;
                configDiv.classList.remove('hidden');
            } else {
                startBtn.disabled = true;
                configDiv.classList.add('hidden');
            }
        }

        // Exam start
        function startExam() {
            const college = COLLEGES_DATA.find(c => c.id === currentCollegeId);
            const level = college.levels.find(l => l.id === currentLevelId);
            const subject = level.subjects.find(s => s.id === currentSubjectId);
            const year = subject.years.find(y => y.id === currentYearId);
            selectedPeriod = year.periods.find(p => p.id === currentPeriodId);

            if (!selectedPeriod || !selectedPeriod.questions || selectedPeriod.questions.length === 0) {
                alert("عذراً، هذا النموذج لا يحتوي على أسئلة بعد.");
                return;
            }

            const activeExamTitle = document.getElementById('activeExamTitle');
            activeExamTitle.textContent = college.name + " - " + subject.name + " (" + selectedPeriod.name + " " + year.name + ")";

            const shuffleQuestionsCheck = document.getElementById('shuffleQuestions').checked;
            const shuffleOptionsCheck = document.getElementById('shuffleOptions').checked;

            // Prepare questions
            let questionsToUse = [...selectedPeriod.questions];
            let indexMap = Array.from({ length: questionsToUse.length }, (_, i) => i);

            if (shuffleQuestionsCheck) {
                // Fisher-Yates Shuffle
                for (let i = indexMap.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [indexMap[i], indexMap[j]] = [indexMap[j], indexMap[i]];
                }
            }

            shuffledQuestions = indexMap.map(idx => selectedPeriod.questions[idx]);
            originalToShuffledIndices = indexMap;

            // Prepare options mapping
            optionOrderMap = {};
            shuffledQuestions.forEach(q => {
                let optionsIndices = [0, 1, 2, 3];
                if (shuffleOptionsCheck) {
                    for (let i = 3; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [optionsIndices[i], optionsIndices[j]] = [optionsIndices[j], optionsIndices[i]];
                    }
                }
                optionOrderMap[q.id] = optionsIndices;
            });

            // Reset exam states
            userAnswers = {};
            currentQuestionIndex = 0;
            
            // 45 seconds per question with 30 min minimum
            const calculatedTime = Math.max(30 * 60, shuffledQuestions.length * 45); 
            examTotalDuration = calculatedTime;
            examTimeLeft = calculatedTime;

            // UI Swapping
            document.getElementById('selectionSection').classList.add('hidden');
            document.getElementById('examSection').classList.remove('hidden');
            document.getElementById('resultsSection').classList.add('hidden');

            renderActiveQuestion();
            startTimer();
            updateProgressBar();
            buildNavigatorPanel();
        }

        // Timer control
        function startTimer() {
            if (examTimerInterval) clearInterval(examTimerInterval);
            updateTimerDisplay();

            examTimerInterval = setInterval(() => {
                examTimeLeft--;
                updateTimerDisplay();

                if (examTimeLeft <= 0) {
                    clearInterval(examTimerInterval);
                    alert("انتهى وقت الاختبار المحدد! سيتم تسليم إجاباتك الحالية تلقائياً.");
                    finishExam();
                }
            }, 1000);
        }

        function updateTimerDisplay() {
            const minutes = Math.floor(examTimeLeft / 60);
            const seconds = examTimeLeft % 60;
            const formattedMinutes = String(minutes).padStart(2, '0');
            const formattedSeconds = String(seconds).padStart(2, '0');
            document.getElementById('examTimer').textContent = formattedMinutes + ":" + formattedSeconds;
            
            if (examTimeLeft < 180) { // Under 3 mins red alert
                const timerWidget = document.getElementById('examTimer').parentNode;
                timerWidget.classList.add('bg-red-100', 'text-red-800', 'animate-pulse');
            } else {
                const timerWidget = document.getElementById('examTimer').parentNode;
                timerWidget.classList.remove('bg-red-100', 'text-red-800', 'animate-pulse');
            }
        }

        // Rendering question
        function renderActiveQuestion() {
            const question = shuffledQuestions[currentQuestionIndex];
            document.getElementById('currentQuestionNum').textContent = currentQuestionIndex + 1;
            document.getElementById('totalQuestionsNum').textContent = shuffledQuestions.length;
            document.getElementById('questionText').textContent = question.text;

            const choicesContainer = document.getElementById('choicesContainer');
            choicesContainer.innerHTML = "";

            const optionsOrder = optionOrderMap[question.id];
            const savedSelectedOption = userAnswers[question.id];

            optionsOrder.forEach((originalIndex, displayIndex) => {
                const choiceText = question.options[originalIndex];
                
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.onclick = () => selectOption(question.id, originalIndex);
                btn.className = "w-full text-right p-4 rounded-xl border font-semibold text-sm transition flex items-center justify-between gap-3 " +
                    (savedSelectedOption === originalIndex 
                        ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:border-emerald-500 text-emerald-800 dark:text-emerald-300 ring-2 ring-emerald-500" 
                        : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-800/50");

                // Layout with option letter and content
                const alpha = ["أ", "ب", "ج", "د"];
                btn.innerHTML = \`
                    <div class="flex items-center gap-3">
                        <span class="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shadow-sm flex-shrink-0 \${
                            savedSelectedOption === originalIndex 
                                ? "bg-emerald-600 text-white" 
                                : "bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                        }">\${alpha[displayIndex]}</span>
                        <span class="leading-relaxed">\${choiceText}</span>
                    </div>
                \`;

                choicesContainer.appendChild(btn);
            });

            // Prev and next buttons status
            document.getElementById('prevBtn').disabled = currentQuestionIndex === 0;
            document.getElementById('prevBtn').style.opacity = currentQuestionIndex === 0 ? "0.5" : "1";
            
            // If last, Next shows "تسليم" or behaves like finish triggers
            const nextBtnText = document.getElementById('nextBtn').querySelector('span');
            if (currentQuestionIndex === shuffledQuestions.length - 1) {
                nextBtnText.textContent = "المراجعة والتسليم";
            } else {
                nextBtnText.textContent = "التالي";
            }
        }

        function selectOption(questionId, originalIndex) {
            userAnswers[questionId] = originalIndex;
            renderActiveQuestion();
            updateProgressBar();
            
            // Also update navigator panel state
            const navBtn = document.getElementById('nav-btn-' + currentQuestionIndex);
            if (navBtn) {
                navBtn.classList.remove('bg-slate-100', 'dark:bg-slate-700', 'text-slate-600', 'dark:text-slate-300');
                navBtn.classList.add('bg-emerald-600', 'text-white', 'border-emerald-600');
            }
        }

        function prevQuestion() {
            if (currentQuestionIndex > 0) {
                currentQuestionIndex--;
                renderActiveQuestion();
                highlightActiveNavButton();
            }
        }

        function nextQuestion() {
            if (currentQuestionIndex < shuffledQuestions.length - 1) {
                currentQuestionIndex++;
                renderActiveQuestion();
                highlightActiveNavButton();
            } else {
                // If on the last question, show the confirmation modal/alert to finish
                confirmFinishExam();
            }
        }

        function updateProgressBar() {
            const total = shuffledQuestions.length;
            const answered = Object.keys(userAnswers).length;
            const pct = total > 0 ? Math.round((answered / total) * 100) : 0;

            document.getElementById('progressPercentage').textContent = pct + "%";
            document.getElementById('progressBar').style.width = pct + "%";
        }

        // Navigation Panel Grid
        function toggleNavigator() {
            const panel = document.getElementById('navigatorPanel');
            panel.classList.toggle('hidden');
        }

        function buildNavigatorPanel() {
            const grid = document.getElementById('navigatorGrid');
            grid.innerHTML = "";

            shuffledQuestions.forEach((q, idx) => {
                const btn = document.createElement('button');
                btn.id = 'nav-btn-' + idx;
                btn.type = 'button';
                btn.onclick = () => {
                    currentQuestionIndex = idx;
                    renderActiveQuestion();
                    highlightActiveNavButton();
                };

                const hasAnswered = userAnswers[q.id] !== undefined;

                btn.className = "w-10 h-10 rounded-xl font-bold text-sm transition flex items-center justify-center border " +
                    (hasAnswered 
                        ? "bg-emerald-600 text-white border-emerald-600" 
                        : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-transparent hover:bg-slate-200 dark:hover:bg-slate-600");

                btn.textContent = idx + 1;
                grid.appendChild(btn);
            });

            highlightActiveNavButton();
        }

        function highlightActiveNavButton() {
            // Remove active style from all nav buttons
            shuffledQuestions.forEach((_, idx) => {
                const btn = document.getElementById('nav-btn-' + idx);
                if (btn) {
                    btn.classList.remove('ring-4', 'ring-emerald-300', 'dark:ring-emerald-800');
                }
            });

            // Add to active
            const activeBtn = document.getElementById('nav-btn-' + currentQuestionIndex);
            if (activeBtn) {
                activeBtn.classList.add('ring-4', 'ring-emerald-300', 'dark:ring-emerald-800');
            }
        }

        // End exam confirmation
        function confirmFinishExam() {
            const total = shuffledQuestions.length;
            const answered = Object.keys(userAnswers).length;
            const unanswered = total - answered;

            let confirmationMsg = "هل أنت متأكد من رغبتك في تسليم وإنهاء الاختبار؟\\n";
            if (unanswered > 0) {
                confirmationMsg += "تنبيه: لديك " + unanswered + " سؤالاً لم تجب عليها بعد!";
            } else {
                confirmationMsg += "لقد أجبت على جميع الأسئلة بالتكامل.";
            }

            if (confirm(confirmationMsg)) {
                finishExam();
            }
        }

        // Finish & Calculation
        function finishExam() {
            if (examTimerInterval) clearInterval(examTimerInterval);

            // Hide exam, show results
            document.getElementById('examSection').classList.add('hidden');
            document.getElementById('resultsSection').classList.remove('hidden');

            const total = shuffledQuestions.length;
            let correct = 0;

            shuffledQuestions.forEach(q => {
                if (userAnswers[q.id] !== undefined && userAnswers[q.id] === q.correctAnswerIndex) {
                    correct++;
                }
            });

            const wrong = total - correct;
            const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

            // Details info
            const college = COLLEGES_DATA.find(c => c.id === currentCollegeId);
            const level = college.levels.find(l => l.id === currentLevelId);
            const subject = level.subjects.find(s => s.id === currentSubjectId);
            const year = subject.years.find(y => y.id === currentYearId);

            document.getElementById('resultCourseTitle').textContent = college.name + " - " + subject.name + " (" + year.name + ")";
            document.getElementById('resultPeriodName').textContent = selectedPeriod.name;

            // Score graphics
            document.getElementById('resultPercentageText').textContent = percentage + "%";
            document.getElementById('resultScoreFraction').textContent = correct + " / " + total;

            const ring = document.getElementById('resultProgressRing');
            const strokeDashOffset = 402 - (402 * percentage) / 100;
            ring.style.strokeDashoffset = strokeDashOffset;

            // Color ring depending on score
            if (percentage >= 85) {
                ring.setAttribute('stroke', '#059669'); // Green
                document.getElementById('resultStatusBadge').textContent = "ممتاز جداً - استعد للنجاح!";
                document.getElementById('resultStatusBadge').className = "px-4 py-1.5 rounded-full text-sm font-bold shadow-sm bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300";
            } else if (percentage >= 75) {
                ring.setAttribute('stroke', '#3b82f6'); // Blue
                document.getElementById('resultStatusBadge').textContent = "جيد جداً - أداء رائع!";
                document.getElementById('resultStatusBadge').className = "px-4 py-1.5 rounded-full text-sm font-bold shadow-sm bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300";
            } else if (percentage >= 50) {
                ring.setAttribute('stroke', '#d97706'); // Gold
                document.getElementById('resultStatusBadge').textContent = "مقبول - بحاجة لمزيد من المذاكرة";
                document.getElementById('resultStatusBadge').className = "px-4 py-1.5 rounded-full text-sm font-bold shadow-sm bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300";
            } else {
                ring.setAttribute('stroke', '#ef4444'); // Red
                document.getElementById('resultStatusBadge').textContent = "تحت المعدل - يرجى إعادة المذاكرة وتكرار المحاولة";
                document.getElementById('resultStatusBadge').className = "px-4 py-1.5 rounded-full text-sm font-bold shadow-sm bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300";
            }

            document.getElementById('correctAnswersCount').textContent = correct;
            document.getElementById('wrongAnswersCount').textContent = wrong;

            const elapsedSeconds = examTotalDuration - examTimeLeft;
            const elapsedMin = Math.floor(elapsedSeconds / 60);
            const elapsedSec = elapsedSeconds % 60;
            document.getElementById('timeElapsedText').textContent = 
                String(elapsedMin).padStart(2, '0') + ":" + String(elapsedSec).padStart(2, '0');

            buildCorrectionsList();
        }

        function buildCorrectionsList() {
            const container = document.getElementById('correctionsContainer');
            container.innerHTML = "";

            shuffledQuestions.forEach((q, idx) => {
                const item = document.createElement('div');
                const selectedAns = userAnswers[q.id];
                const isCorrect = selectedAns !== undefined && selectedAns === q.correctAnswerIndex;

                item.className = "bg-white dark:bg-slate-800 rounded-xl p-5 border shadow-sm transition-colors " +
                    (isCorrect 
                        ? "border-emerald-200 dark:border-emerald-900/60" 
                        : "border-red-200 dark:border-red-900/60");

                let choicesListHTML = "";
                q.options.forEach((opt, optIdx) => {
                    let badgeClass = "border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300";
                    let checkMark = "";

                    if (optIdx === q.correctAnswerIndex) {
                        badgeClass = "bg-emerald-100 border-emerald-300 text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300 font-semibold";
                        checkMark = \`
                            <span class="bg-emerald-600 text-white rounded-full p-0.5 text-[8px] mr-auto flex-shrink-0">✓</span>
                        \`;
                    } else if (selectedAns !== undefined && optIdx === selectedAns) {
                        badgeClass = "bg-red-100 border-red-300 text-red-800 dark:bg-red-950/40 dark:border-red-800 dark:text-red-300 font-semibold";
                        checkMark = \`
                            <span class="bg-red-600 text-white rounded-full p-0.5 text-[8px] mr-auto flex-shrink-0">✗</span>
                        \`;
                    }

                    choicesListHTML += \`
                        <div class="flex items-center gap-3 p-2.5 rounded-lg text-xs \${badgeClass}">
                            <span class="w-5 h-5 rounded-md flex items-center justify-center font-bold bg-white dark:bg-slate-900 text-slate-500 shadow-xs flex-shrink-0">\${optIdx + 1}</span>
                            <span>\${opt}</span>
                            \${checkMark}
                        </div>
                    \`;
                });

                item.innerHTML = \`
                    <div class="space-y-3">
                        <div class="flex items-start justify-between gap-3">
                            <div class="space-y-1">
                                <span class="text-[10px] font-bold px-2 py-0.5 rounded-md \${
                                    isCorrect 
                                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300" 
                                        : "bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-300"
                                }">السؤال \${idx + 1}</span>
                                <h4 class="font-bold text-sm text-slate-900 dark:text-white leading-relaxed">\${q.text}</h4>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                            \${choicesListHTML}
                        </div>

                        \${q.explanation ? \`
                            <div class="mt-3 p-3 bg-amber-50/50 dark:bg-amber-950/20 border-r-4 border-amber-500 rounded-l-lg text-xs text-slate-600 dark:text-slate-350 leading-relaxed">
                                <strong>توضيح الإجابة:</strong> \${q.explanation}
                            </div>
                        \` : ''}
                    </div>
                \`;

                container.appendChild(item);
            });
        }

        function restartActiveExam() {
            startExam();
        }

        function backToSelection() {
            document.getElementById('selectionSection').classList.remove('hidden');
            document.getElementById('examSection').classList.add('hidden');
            document.getElementById('resultsSection').classList.add('hidden');
        }
    </script>
</body>
</html>`;
}

import React, { useState, useRef, useMemo } from "react";
import { College, Level, Subject, Year, Period, Question } from "../types";
import { exportToStandaloneHTML } from "../utils/htmlExporter";
import {
  Lock,
  PlusCircle,
  Trash2,
  Edit3,
  Download,
  Upload,
  Database,
  CheckCircle,
  FileText,
  Sparkles,
  Search,
  ArrowUpDown,
  Copy,
  FolderSync,
  X,
  FileSpreadsheet,
  Layers,
  GraduationCap,
  Calendar,
  Clock,
  ChevronRight,
  ArrowRightLeft,
  BookOpen,
  Plus,
  HelpCircle,
  Check,
  RotateCcw,
  BarChart3,
  Users,
  Target
} from "lucide-react";

interface AdminDashboardProps {
  colleges: College[];
  setColleges: React.Dispatch<React.SetStateAction<College[]>>;
  onSaveToLocalStorage: (data: College[]) => void;
  adminPin: string;
  onUpdatePin: (newPin: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  colleges,
  setColleges,
  onSaveToLocalStorage,
  adminPin,
  onUpdatePin,
}) => {
  // Authentication State
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [authError, setAuthError] = useState("");

  // Navigation Tabs for Admin Area
  const [adminTab, setAdminTab] = useState<"structure" | "analytics" | "search" | "parser" | "system">("structure");

  // Selection states for Tree manager
  const [selectedCollegeId, setSelectedCollegeId] = useState("");
  const [selectedLevelId, setSelectedLevelId] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [selectedYearId, setSelectedYearId] = useState("");
  const [selectedPeriodId, setSelectedPeriodId] = useState("");

  // Global search & filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCollegeId, setFilterCollegeId] = useState("");
  const [filterSubjectId, setFilterSubjectId] = useState("");
  const [filterYearId, setFilterYearId] = useState("");

  // Modals state
  const [modalType, setModalType] = useState<"college" | "level" | "subject" | "year" | "period" | "move_period" | "clone_period" | "copy_subject" | null>(null);
  const [modalAction, setModalAction] = useState<"add" | "edit">("add");
  const [modalInputValue, setModalInputValue] = useState("");
  const [modalTargetId, setModalTargetId] = useState("");

  // Extra selection targets for Copy/Move Modals
  const [modalDestYearId, setModalDestYearId] = useState("");
  const [modalDestLevelId, setModalDestLevelId] = useState("");
  const [modalDestCollegeId, setModalDestCollegeId] = useState("");

  // Single Question inline form state
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [qText, setQText] = useState("");
  const [qOptA, setQOptA] = useState("");
  const [qOptB, setQOptB] = useState("");
  const [qOptC, setQOptC] = useState("");
  const [qOptD, setQOptD] = useState("");
  const [qCorrectIdx, setQCorrectIdx] = useState<number>(0);
  const [qExplanation, setQExplanation] = useState("");
  const [qImage, setQImage] = useState("");

  // PIN change state
  const [newPinValue, setNewPinValue] = useState("");
  const [pinChangeSuccess, setPinChangeSuccess] = useState("");

  // Real-time analytics local attempts state
  const [localAttempts, setLocalAttempts] = useState<any[]>([]);

  React.useEffect(() => {
    const raw = localStorage.getItem("sanaa_university_attempts_db");
    if (raw) {
      try {
        setLocalAttempts(JSON.parse(raw));
      } catch (e) {
        // Safe catch
      }
    }
  }, [adminTab]);

  // Text PDF Parser input state
  const [pdfRawText, setPdfRawText] = useState("");
  const [parsedQuestions, setParsedQuestions] = useState<Question[]>([]);
  const [isReviewingParsed, setIsReviewingParsed] = useState(false);

  // File Reference
  const fileInputRef = useRef<HTMLInputElement>(null);
  const ADMIN_PASSWORD = "admin"; // Standard default password

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setAuthError("");
    } else {
      setAuthError("كلمة المرور غير صحيحة. يرجى إدخال 'admin' للتجربة.");
    }
  };

  // Helper to persist database changes
  const updateDb = (newColleges: College[]) => {
    setColleges(newColleges);
    onSaveToLocalStorage(newColleges);
  };

  // Safe selections references
  const currentCollege = colleges.find((c) => c.id === selectedCollegeId);
  const currentLevel = currentCollege?.levels.find((l) => l.id === selectedLevelId);
  const currentSubject = currentLevel?.subjects.find((s) => s.id === selectedSubjectId);
  const currentYear = currentSubject?.years.find((y) => y.id === selectedYearId);
  const currentPeriod = currentYear?.periods.find((p) => p.id === selectedPeriodId);

  // Count calculations
  const stats = useMemo(() => {
    let levelCount = 0;
    let subjectCount = 0;
    let yearCount = 0;
    let periodCount = 0;
    let questionCount = 0;

    colleges.forEach((c) => {
      levelCount += c.levels.length;
      c.levels.forEach((l) => {
        subjectCount += l.subjects.length;
        l.subjects.forEach((s) => {
          yearCount += s.years.length;
          s.years.forEach((y) => {
            periodCount += y.periods.length;
            y.periods.forEach((p) => {
              questionCount += (p.questions || []).length;
            });
          });
        });
      });
    });

    return {
      colleges: colleges.length,
      levels: levelCount,
      subjects: subjectCount,
      years: yearCount,
      periods: periodCount,
      questions: questionCount,
    };
  }, [colleges]);

  // Tree action handles (Modal submissions)
  const handleOpenModal = (type: typeof modalType, action: "add" | "edit", initialVal: string = "", targetId: string = "") => {
    setModalType(type);
    setModalAction(action);
    setModalInputValue(initialVal);
    setModalTargetId(targetId);
    setModalDestYearId("");
    setModalDestLevelId("");
    setModalDestCollegeId("");
  };

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = modalInputValue.trim();
    if (!val && !["move_period", "clone_period", "copy_subject"].includes(modalType || "")) return;

    let updated = [...colleges];

    if (modalType === "college") {
      if (modalAction === "add") {
        const newCol: College = { id: "college_" + Date.now(), name: val, levels: [] };
        updated.push(newCol);
        setSelectedCollegeId(newCol.id);
      } else {
        updated = updated.map((c) => (c.id === modalTargetId ? { ...c, name: val } : c));
      }
    } else if (modalType === "level") {
      if (modalAction === "add") {
        const newLvl: Level = { id: "level_" + Date.now(), name: val, subjects: [] };
        updated = updated.map((c) =>
          c.id === selectedCollegeId ? { ...c, levels: [...c.levels, newLvl] } : c
        );
        setSelectedLevelId(newLvl.id);
      } else {
        updated = updated.map((c) =>
          c.id === selectedCollegeId
            ? {
                ...c,
                levels: c.levels.map((l) => (l.id === modalTargetId ? { ...l, name: val } : l)),
              }
            : c
        );
      }
    } else if (modalType === "subject") {
      if (modalAction === "add") {
        const newSub: Subject = { id: "subject_" + Date.now(), name: val, years: [] };
        updated = updated.map((c) =>
          c.id === selectedCollegeId
            ? {
                ...c,
                levels: c.levels.map((l) =>
                  l.id === selectedLevelId ? { ...l, subjects: [...l.subjects, newSub] } : l
                ),
              }
            : c
        );
        setSelectedSubjectId(newSub.id);
      } else {
        updated = updated.map((c) =>
          c.id === selectedCollegeId
            ? {
                ...c,
                levels: c.levels.map((l) =>
                  l.id === selectedLevelId
                    ? {
                        ...l,
                        subjects: l.subjects.map((s) =>
                          s.id === modalTargetId ? { ...s, name: val } : s
                        ),
                      }
                    : l
                ),
              }
            : c
        );
      }
    } else if (modalType === "year") {
      if (modalAction === "add") {
        const newYr: Year = { id: "year_" + Date.now(), name: val, periods: [] };
        updated = updated.map((c) =>
          c.id === selectedCollegeId
            ? {
                ...c,
                levels: c.levels.map((l) =>
                  l.id === selectedLevelId
                    ? {
                        ...l,
                        subjects: l.subjects.map((s) =>
                          s.id === selectedSubjectId ? { ...s, years: [...s.years, newYr] } : s
                        ),
                      }
                    : l
                ),
              }
            : c
        );
        setSelectedYearId(newYr.id);
      } else {
        updated = updated.map((c) =>
          c.id === selectedCollegeId
            ? {
                ...c,
                levels: c.levels.map((l) =>
                  l.id === selectedLevelId
                    ? {
                        ...l,
                        subjects: l.subjects.map((s) =>
                          s.id === selectedSubjectId
                            ? {
                                ...s,
                                years: s.years.map((y) =>
                                  y.id === modalTargetId ? { ...y, name: val } : y
                                ),
                              }
                            : s
                        ),
                      }
                    : l
                ),
              }
            : c
        );
      }
    } else if (modalType === "period") {
      if (modalAction === "add") {
        const newPer: Period = { id: "period_" + Date.now(), name: val, questions: [] };
        updated = updated.map((c) =>
          c.id === selectedCollegeId
            ? {
                ...c,
                levels: c.levels.map((l) =>
                  l.id === selectedLevelId
                    ? {
                        ...l,
                        subjects: l.subjects.map((s) =>
                          s.id === selectedSubjectId
                            ? {
                                ...s,
                                years: s.years.map((y) =>
                                  y.id === selectedYearId
                                    ? { ...y, periods: [...y.periods, newPer] }
                                    : y
                                ),
                              }
                            : s
                        ),
                      }
                    : l
                ),
              }
            : c
        );
        setSelectedPeriodId(newPer.id);
      } else {
        updated = updated.map((c) =>
          c.id === selectedCollegeId
            ? {
                ...c,
                levels: c.levels.map((l) =>
                  l.id === selectedLevelId
                    ? {
                        ...l,
                        subjects: l.subjects.map((s) =>
                          s.id === selectedSubjectId
                            ? {
                                ...s,
                                years: s.years.map((y) =>
                                  y.id === selectedYearId
                                    ? {
                                        ...y,
                                        periods: y.periods.map((p) =>
                                          p.id === modalTargetId ? { ...p, name: val } : p
                                        ),
                                      }
                                    : y
                                ),
                              }
                            : s
                        ),
                      }
                    : l
                ),
              }
            : c
        );
      }
    } else if (modalType === "move_period" || modalType === "clone_period") {
      // Find the period to move/clone
      if (!currentPeriod || !modalDestYearId) return;
      const isClone = modalType === "clone_period";

      // Insert target period into destination
      updated = updated.map((c) => {
        return {
          ...c,
          levels: c.levels.map((l) => {
            return {
              ...l,
              subjects: l.subjects.map((s) => {
                return {
                  ...s,
                  years: s.years.map((y) => {
                    // If this is the destination year, add the period
                    if (y.id === modalDestYearId) {
                      const periodToAdd: Period = isClone
                        ? {
                            ...currentPeriod,
                            id: "period_clone_" + Date.now(),
                            name: currentPeriod.name + " (نسخة)",
                            questions: currentPeriod.questions.map((q) => ({
                              ...q,
                              id: "q_clone_" + Date.now() + "_" + Math.random(),
                            })),
                          }
                        : { ...currentPeriod };
                      
                      // Check if already contains period id to avoid duplication
                      const exists = y.periods.some((p) => p.id === periodToAdd.id);
                      return {
                        ...y,
                        periods: exists ? y.periods : [...y.periods, periodToAdd],
                      };
                    }
                    // If this is the source year and we are MOVING, remove the period
                    if (y.id === selectedYearId && !isClone) {
                      return {
                        ...y,
                        periods: y.periods.filter((p) => p.id !== selectedPeriodId),
                      };
                    }
                    return y;
                  }),
                };
              }),
            };
          }),
        };
      });

      if (!isClone) {
        setSelectedPeriodId("");
      }
      alert(isClone ? "تم استنساخ النموذج بنجاح!" : "تم نقل النموذج بنجاح إلى العام المحدد!");
    } else if (modalType === "copy_subject") {
      // Clone subject to destination Level
      if (!currentSubject || !modalDestLevelId) return;

      updated = updated.map((c) => {
        return {
          ...c,
          levels: c.levels.map((l) => {
            if (l.id === modalDestLevelId) {
              const clonedSub: Subject = {
                id: "subject_clone_" + Date.now(),
                name: currentSubject.name + " (نسخة مكررة)",
                years: currentSubject.years.map((y) => ({
                  ...y,
                  id: "year_clone_" + Date.now() + "_" + Math.random(),
                  periods: y.periods.map((p) => ({
                    ...p,
                    id: "period_clone_" + Date.now() + "_" + Math.random(),
                    questions: p.questions.map((q) => ({
                      ...q,
                      id: "q_clone_" + Date.now() + "_" + Math.random(),
                    })),
                  })),
                })),
              };
              return { ...l, subjects: [...l.subjects, clonedSub] };
            }
            return l;
          }),
        };
      });
      alert("تمت مضاعفة ونسخ المادة بنجاح!");
    }

    updateDb(updated);
    setModalType(null);
  };

  const handleDeleteNode = (type: "college" | "level" | "subject" | "year" | "period", id: string) => {
    if (!window.confirm("تحذير أمني: هل أنت متأكد من رغبتك في حذف هذا القسم بالكامل بما يحتويه من مستويات ومواد ونماذج وأسئلة؟ هذا الإجراء لا يمكن التراجع عنه.")) return;

    let updated = [...colleges];

    if (type === "college") {
      updated = updated.filter((c) => c.id !== id);
      setSelectedCollegeId("");
      setSelectedLevelId("");
    } else if (type === "level") {
      updated = updated.map((c) =>
        c.id === selectedCollegeId ? { ...c, levels: c.levels.filter((l) => l.id !== id) } : c
      );
      setSelectedLevelId("");
      setSelectedSubjectId("");
    } else if (type === "subject") {
      updated = updated.map((c) =>
        c.id === selectedCollegeId
          ? {
              ...c,
              levels: c.levels.map((l) =>
                l.id === selectedLevelId ? { ...l, subjects: l.subjects.filter((s) => s.id !== id) } : l
              ),
            }
          : c
      );
      setSelectedSubjectId("");
      setSelectedYearId("");
    } else if (type === "year") {
      updated = updated.map((c) =>
        c.id === selectedCollegeId
          ? {
              ...c,
              levels: c.levels.map((l) =>
                l.id === selectedLevelId
                  ? {
                      ...l,
                      subjects: l.subjects.map((s) =>
                        s.id === selectedSubjectId ? { ...s, years: s.years.filter((y) => y.id !== id) } : s
                      ),
                    }
                  : l
              ),
            }
          : c
      );
      setSelectedYearId("");
      setSelectedPeriodId("");
    } else if (type === "period") {
      updated = updated.map((c) =>
        c.id === selectedCollegeId
          ? {
              ...c,
              levels: c.levels.map((l) =>
                l.id === selectedLevelId
                  ? {
                      ...l,
                      subjects: l.subjects.map((s) =>
                        s.id === selectedSubjectId
                          ? {
                              ...s,
                              years: s.years.map((y) =>
                                y.id === selectedYearId
                                  ? { ...y, periods: y.periods.filter((p) => p.id !== id) }
                                  : y
                              ),
                            }
                          : s
                      ),
                    }
                  : l
              ),
            }
          : c
      );
      setSelectedPeriodId("");
    }

    updateDb(updated);
  };

  // Reorder subjects/years by moving them up or down safely
  const handleReorder = (type: "subject" | "year", id: string, direction: "up" | "down") => {
    let updated = [...colleges];

    updated = updated.map((c) => {
      if (c.id !== selectedCollegeId) return c;
      return {
        ...c,
        levels: c.levels.map((l) => {
          if (l.id !== selectedLevelId) return l;

          if (type === "subject") {
            const list = [...l.subjects];
            const idx = list.findIndex((s) => s.id === id);
            if (idx === -1) return l;
            const nextIdx = direction === "up" ? idx - 1 : idx + 1;
            if (nextIdx >= 0 && nextIdx < list.length) {
              [list[idx], list[nextIdx]] = [list[nextIdx], list[idx]];
            }
            return { ...l, subjects: list };
          }

          // If type is year
          return {
            ...l,
            subjects: l.subjects.map((s) => {
              if (s.id !== selectedSubjectId) return s;
              const list = [...s.years];
              const idx = list.findIndex((y) => y.id === id);
              if (idx === -1) return s;
              const nextIdx = direction === "up" ? idx - 1 : idx + 1;
              if (nextIdx >= 0 && nextIdx < list.length) {
                [list[idx], list[nextIdx]] = [list[nextIdx], list[idx]];
              }
              return { ...s, years: list };
            }),
          };
        }),
      };
    });

    updateDb(updated);
  };

  const handleMoveQuestionUp = (qId: string) => {
    if (!currentPeriod) return;
    const qList = [...currentPeriod.questions];
    const index = qList.findIndex((q) => q.id === qId);
    if (index > 0) {
      [qList[index], qList[index - 1]] = [qList[index - 1], qList[index]];
      const updated = colleges.map((c) =>
        c.id === selectedCollegeId
          ? {
              ...c,
              levels: c.levels.map((l) =>
                l.id === selectedLevelId
                  ? {
                      ...l,
                      subjects: l.subjects.map((s) =>
                        s.id === selectedSubjectId
                          ? {
                              ...s,
                              years: s.years.map((y) =>
                                y.id === selectedYearId
                                  ? {
                                      ...y,
                                      periods: y.periods.map((p) =>
                                        p.id === selectedPeriodId ? { ...p, questions: qList } : p
                                      ),
                                    }
                                  : y
                              ),
                            }
                          : s
                      ),
                    }
                  : l
              ),
            }
          : c
      );
      updateDb(updated);
    }
  };

  const handleMoveQuestionDown = (qId: string) => {
    if (!currentPeriod) return;
    const qList = [...currentPeriod.questions];
    const index = qList.findIndex((q) => q.id === qId);
    if (index >= 0 && index < qList.length - 1) {
      [qList[index], qList[index + 1]] = [qList[index + 1], qList[index]];
      const updated = colleges.map((c) =>
        c.id === selectedCollegeId
          ? {
              ...c,
              levels: c.levels.map((l) =>
                l.id === selectedLevelId
                  ? {
                      ...l,
                      subjects: l.subjects.map((s) =>
                        s.id === selectedSubjectId
                          ? {
                              ...s,
                              years: s.years.map((y) =>
                                y.id === selectedYearId
                                  ? {
                                      ...y,
                                      periods: y.periods.map((p) =>
                                        p.id === selectedPeriodId ? { ...p, questions: qList } : p
                                      ),
                                    }
                                  : y
                              ),
                            }
                          : s
                      ),
                    }
                  : l
              ),
            }
          : c
      );
      updateDb(updated);
    }
  };

  // Question save & delete
  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qText.trim() || !qOptA.trim() || !qOptB.trim() || !qOptC.trim() || !qOptD.trim() || !selectedPeriodId) {
      alert("الرجاء إدخال نص السؤال وجميع الخيارات الأربعة.");
      return;
    }

    const questionData: Question = {
      id: editingQuestionId || "q_" + Date.now(),
      text: qText.trim(),
      options: [qOptA.trim(), qOptB.trim(), qOptC.trim(), qOptD.trim()],
      correctAnswerIndex: qCorrectIdx,
      explanation: qExplanation.trim() || undefined,
      image: qImage.trim() || undefined,
    };

    let updated = colleges.map((c) => {
      if (c.id === selectedCollegeId) {
        return {
          ...c,
          levels: c.levels.map((l) => {
            if (l.id === selectedLevelId) {
              return {
                ...l,
                subjects: l.subjects.map((s) => {
                  if (s.id === selectedSubjectId) {
                    return {
                      ...s,
                      years: s.years.map((y) => {
                        if (y.id === selectedYearId) {
                          return {
                            ...y,
                            periods: y.periods.map((p) => {
                              if (p.id === selectedPeriodId) {
                                let list = [...(p.questions || [])];
                                if (editingQuestionId) {
                                  list = list.map((q) => (q.id === editingQuestionId ? questionData : q));
                                } else {
                                  list.push(questionData);
                                }
                                return { ...p, questions: list };
                              }
                              return p;
                            }),
                          };
                        }
                        return y;
                      }),
                    };
                  }
                  return s;
                }),
              };
            }
            return l;
          }),
        };
      }
      return c;
    });

    updateDb(updated);
    resetQuestionForm();
  };

  const resetQuestionForm = () => {
    setEditingQuestionId(null);
    setQText("");
    setQOptA("");
    setQOptB("");
    setQOptC("");
    setQOptD("");
    setQCorrectIdx(0);
    setQExplanation("");
    setQImage("");
  };

  const handleEditQuestion = (q: Question) => {
    setEditingQuestionId(q.id);
    setQText(q.text);
    setQOptA(q.options[0] || "");
    setQOptB(q.options[1] || "");
    setQOptC(q.options[2] || "");
    setQOptD(q.options[3] || "");
    setQCorrectIdx(q.correctAnswerIndex);
    setQExplanation(q.explanation || "");
    setQImage(q.image || "");

    const formElement = document.getElementById("questionFormAnchor");
    if (formElement) formElement.scrollIntoView({ behavior: "smooth" });
  };

  const handleDeleteQuestion = (qId: string, periodId: string = selectedPeriodId) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا السؤال نهائياً؟")) return;

    let updated = colleges.map((c) => {
      return {
        ...c,
        levels: c.levels.map((l) => {
          return {
            ...l,
            subjects: l.subjects.map((s) => {
              return {
                ...s,
                years: s.years.map((y) => {
                  return {
                    ...y,
                    periods: y.periods.map((p) => {
                      if (p.id === periodId) {
                        return { ...p, questions: (p.questions || []).filter((q) => q.id !== qId) };
                      }
                      return p;
                    }),
                  };
                }),
              };
            }),
          };
        }),
      };
    });

    updateDb(updated);
    if (editingQuestionId === qId) resetQuestionForm();
  };

  const handleUpdatePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPinValue.length !== 4 || isNaN(Number(newPinValue))) {
      alert("يرجى إدخال رمز مرور سري (PIN) مكون من 4 أرقام بالضبط.");
      return;
    }
    onUpdatePin(newPinValue);
    setPinChangeSuccess("تم تحديث الرمز السري الجديد للوحة التحكم بنجاح!");
    setNewPinValue("");
    setTimeout(() => {
      setPinChangeSuccess("");
    }, 4500);
  };

  // Smart regex/text parser for Copy-Pasted PDF Questions
  const handleParseQuestions = () => {
    if (!pdfRawText.trim()) {
      alert("الرجاء لصق نص الاختبار المنسوخ من ملف الـ PDF أولاً.");
      return;
    }

    // Split text into lines
    const lines = pdfRawText.split("\n").map((line) => line.trim()).filter(Boolean);
    const parsed: Question[] = [];
    let currentQ: Partial<Question> = {};
    let optionsList: string[] = [];

    // Helper to add current working question
    const commitCurrent = () => {
      if (currentQ.text && optionsList.length >= 2) {
        // pad up to 4 options if less
        while (optionsList.length < 4) {
          optionsList.push(`بديل افتراضي ${optionsList.length + 1}`);
        }
        parsed.push({
          id: "parsed_" + Date.now() + "_" + Math.random().toString(36).substr(2, 5),
          text: currentQ.text,
          options: optionsList.slice(0, 4),
          correctAnswerIndex: currentQ.correctAnswerIndex !== undefined ? currentQ.correctAnswerIndex : 1,
          explanation: currentQ.explanation || "مستخرج ومراجع تلقائياً عبر المصحح.",
        });
      }
      currentQ = {};
      optionsList = [];
    };

    // Parse loop
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Question detection (starts with number like "1-", "1.", "س1" or is relatively long and ends with "?")
      const isQuestionMarker = /^\d+[-.)\s]|^(س\d+|\d+)\s*[:/]\s*/.test(line) || (line.length > 25 && line.endsWith("؟"));
      
      if (isQuestionMarker) {
        commitCurrent();
        // Strip out leading numbers for clean text
        currentQ.text = line.replace(/^\d+[-.)\s]+|^(س\d+|\d+)\s*[:/]\s*/, "");
        continue;
      }

      // Option markers detection: A/B/C/D or أ/ب/ج/د
      const optionMatch = line.match(/^([أبجدABCDA-D])[-\s).]+(.*)/i);
      if (optionMatch) {
        const optionLetter = optionMatch[1].toLowerCase();
        const optionVal = optionMatch[2].trim();
        optionsList.push(optionVal);

        // Check if correct answer is marked on this line (e.g. contains asterisk (*) or (صحيح) or (الجواب))
        if (line.includes("*") || line.includes("✓") || line.includes("(صحيح)") || line.includes("(الجواب)")) {
          currentQ.correctAnswerIndex = optionsList.length - 1;
        }
        continue;
      }

      // Check for standalone correct answer indicators like: "الحل: ب", "الإجابة: ب", "الإجابة الصحيحة: ب"
      const ansMatch = line.match(/^(الحل|الجواب|الإجابة|الإجابة الصحيحة)\s*[:=]\s*([أبجدABCDa-d])\s*$/i);
      if (ansMatch && currentQ) {
        const letter = ansMatch[2].toLowerCase();
        const map: { [key: string]: number } = { "أ": 0, "أ-": 0, "a": 0, "ب": 1, "b": 1, "ج": 2, "c": 2, "د": 3, "d": 3 };
        if (map[letter] !== undefined) {
          currentQ.correctAnswerIndex = map[letter];
        }
        continue;
      }

      // If line is not a question or option, and we have an active question text, it might be the continuation or explanation
      if (currentQ.text) {
        if (line.startsWith("الشرح:") || line.startsWith("توضيح:") || line.startsWith("explanation:")) {
          currentQ.explanation = line.replace(/^(الشرح|توضيح|explanation)\s*[:/]\s*/i, "");
        } else if (optionsList.length === 0) {
          // Continue question text if no options added yet
          currentQ.text += " " + line;
        } else {
          // If options exist, append as another option if less than 4
          if (optionsList.length < 4) {
            optionsList.push(line);
          }
        }
      }
    }

    commitCurrent();

    if (parsed.length === 0) {
      alert("تعذر استخراج الأسئلة. يرجى التأكد من أن النص يحتوي على أسئلة مرقمة وخيارات بحروف أ، ب، ج، د ليعمل الاستخراج بنجاح.");
      return;
    }

    setParsedQuestions(parsed);
    setIsReviewingParsed(true);
    alert(`تم استخراج عدد (${parsed.length}) أسئلة بنجاح! يرجى مراجعتها بالجدول أدناه وحفظها للنموذج.`);
  };

  // Bulk save parsed questions to current period
  const handleSaveParsedQuestions = () => {
    if (!selectedPeriodId || parsedQuestions.length === 0) return;

    let updated = colleges.map((c) => {
      if (c.id === selectedCollegeId) {
        return {
          ...c,
          levels: c.levels.map((l) => {
            if (l.id === selectedLevelId) {
              return {
                ...l,
                subjects: l.subjects.map((s) => {
                  if (s.id === selectedSubjectId) {
                    return {
                      ...s,
                      years: s.years.map((y) => {
                        if (y.id === selectedYearId) {
                          return {
                            ...y,
                            periods: y.periods.map((p) => {
                              if (p.id === selectedPeriodId) {
                                return { ...p, questions: [...(p.questions || []), ...parsedQuestions] };
                              }
                              return p;
                            }),
                          };
                        }
                        return y;
                      }),
                    };
                  }
                  return s;
                }),
              };
            }
            return l;
          }),
        };
      }
      return c;
    });

    updateDb(updated);
    setParsedQuestions([]);
    setPdfRawText("");
    setIsReviewingParsed(false);
    alert("تم بنجاح حفظ جميع الأسئلة المستخرجة إلى النموذج المحدد في قاعدة البيانات!");
  };

  // Global searchable database list
  const filteredGlobalQuestions = useMemo(() => {
    const list: Array<{
      q: Question;
      collegeName: string;
      subjectName: string;
      yearName: string;
      periodId: string;
      periodName: string;
    }> = [];

    colleges.forEach((c) => {
      if (filterCollegeId && c.id !== filterCollegeId) return;
      c.levels.forEach((l) => {
        l.subjects.forEach((s) => {
          if (filterSubjectId && s.id !== filterSubjectId) return;
          s.years.forEach((y) => {
            if (filterYearId && y.id !== filterYearId) return;
            y.periods.forEach((p) => {
              (p.questions || []).forEach((q) => {
                const matchesSearch =
                  !searchQuery ||
                  q.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  q.options.some((o) => o.toLowerCase().includes(searchQuery.toLowerCase()));

                if (matchesSearch) {
                  list.push({
                    q,
                    collegeName: c.name,
                    subjectName: s.name,
                    yearName: y.name,
                    periodId: p.id,
                    periodName: p.name,
                  });
                }
              });
            });
          });
        });
      });
    });

    return list;
  }, [colleges, searchQuery, filterCollegeId, filterSubjectId, filterYearId]);

  // JSON Import & Backup
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target?.result as string);
        if (Array.isArray(importedData)) {
          const isValid = importedData.every((col) => col.id && col.name && Array.isArray(col.levels));
          if (isValid) {
            updateDb(importedData);
            alert("تم استيراد واسترجاع النسخة الاحتياطية بنجاح!");
            setSelectedCollegeId("");
            setSelectedLevelId("");
            setSelectedSubjectId("");
            setSelectedYearId("");
            setSelectedPeriodId("");
          } else {
            alert("صيغة ملف الـ JSON غير مطابقة للمواصفات المطلوبة.");
          }
        }
      } catch (err) {
        alert("فشل قراءة ملف النسخة الاحتياطية. الرجاء التأكد من صحة التنسيق.");
      }
    };
    reader.readAsText(file);
    if (e.target) e.target.value = "";
  };

  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(colleges, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `نسخة_احتياطية_الاختبارات_${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportHTML = () => {
    try {
      const compiledHTML = exportToStandaloneHTML(colleges);
      const blob = new Blob([compiledHTML], { type: "text/html;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `منصة_امتحانات_جامعة_صنعاء_المستقلة.html`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert("حدث خطأ أثناء تصدير ملف HTML القابل للتشغيل أوفلاين.");
    }
  };

  // Login Gate
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border border-slate-100 dark:border-slate-700 space-y-6 animate-fade-in transition-colors">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-amber-50 dark:bg-amber-950/40 text-amber-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
            <Lock size={26} />
          </div>
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">منطقة الإدارة ولوحة التحكم</h3>
          <p className="text-xs text-slate-400">
            هذه المنطقة محمية ومخصصة لإدارة الكليات، وتعديل الأسئلة، واستخراج النماذج.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400">
              كلمة مرور المشرف
            </label>
            <input
              type="password"
              placeholder="أدخل كلمة المرور..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3.5 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800 dark:text-slate-100"
            />
            {authError && <p className="text-[11px] text-red-500 font-bold">{authError}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Lock size={15} />
            <span>تسجيل الدخول للوحة التحكم</span>
          </button>
        </form>

        <p className="text-[10px] text-center text-slate-400">
          تلميح: كلمة المرور الافتراضية للتجربة والتدشين هي <strong className="font-mono text-slate-650 dark:text-slate-350">admin</strong>
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 animate-fade-in">
      {/* Header and statistics overview block */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 transition-colors">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-150 dark:border-slate-700 pb-4 mb-4">
          <div className="space-y-1">
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Database className="text-amber-500" size={22} />
              <span>لوحة التحكم الإدارية المتكاملة</span>
            </h2>
            <p className="text-xs text-slate-400 font-medium">
              نظام إدارة قواعد البيانات والأسئلة لجامعة صنعاء بالكامل دون الحاجة لتعديل الكود.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportHTML}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Sparkles size={14} />
              <span>تصدير ملف مستقل (HTML)</span>
            </button>
          </div>
        </div>

        {/* Dynamic statistics counter grid */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
          {[
            { label: "كليات", count: stats.colleges, icon: GraduationCap, color: "text-blue-500 bg-blue-50 dark:bg-blue-950/30" },
            { label: "مستويات", count: stats.levels, icon: Layers, color: "text-purple-500 bg-purple-50 dark:bg-purple-950/30" },
            { label: "مواد", count: stats.subjects, icon: BookOpen, color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30" },
            { label: "سنوات", count: stats.years, icon: Calendar, color: "text-amber-500 bg-amber-50 dark:bg-amber-950/30" },
            { label: "فترات", count: stats.periods, icon: Clock, color: "text-pink-500 bg-pink-50 dark:bg-pink-950/30" },
            { label: "إجمالي الأسئلة", count: stats.questions, icon: HelpCircle, color: "text-indigo-500 bg-indigo-50 dark:bg-indigo-950/30" },
          ].map((item, i) => (
            <div key={i} className="p-3.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 text-center space-y-1.5">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center mx-auto ${item.color}`}>
                <item.icon size={16} />
              </div>
              <span className="text-[10px] text-slate-400 font-bold block">{item.label}</span>
              <span className="text-base font-extrabold text-slate-900 dark:text-white">{item.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Control Tabs sidebar-like menu */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-2">
          {[
            { id: "structure", label: "هيكلة الفصول والكليات", desc: "إضافة وتعديل الكليات، المواد، وتعديل الأسئلة", icon: GraduationCap },
            { id: "analytics", label: "لوحة الإحصائيات الشاملة", desc: "أعداد الطلاب، نسب النجاح والأسئلة الشائعة", icon: BarChart3 },
            { id: "search", label: "البنك وبحث الأسئلة", desc: "فلترة وتعديل وحذف أي سؤال عبر الكليات", icon: Search },
            { id: "parser", label: "مستخرج الأسئلة (PDF)", desc: "استخراج ذكي لجميع الأسئلة من لصق النصوص", icon: FileText },
            { id: "system", label: "إدارة والنسخ الاحتياطي", desc: "استيراد وتصدير قاعدة البيانات بالكامل", icon: Database },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setAdminTab(tab.id as any)}
              className={`w-full text-right p-4 rounded-xl border transition-all cursor-pointer block ${
                adminTab === tab.id
                  ? "bg-slate-900 text-white border-slate-900 dark:bg-emerald-600 dark:border-emerald-600"
                  : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 dark:text-slate-300 dark:border-slate-700"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-1.5 rounded-lg ${adminTab === tab.id ? "bg-white/10" : "bg-slate-100 dark:bg-slate-700"}`}>
                  <tab.icon size={16} />
                </div>
                <div className="space-y-0.5">
                  <span className="text-xs font-bold block">{tab.label}</span>
                  <span className={`text-[10px] block ${adminTab === tab.id ? "text-slate-300" : "text-slate-400"}`}>
                    {tab.desc}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* TAB 1: STRUCTURE TREE */}
          {adminTab === "structure" && (
            <div className="space-y-6 animate-fade-in">
              {/* College, level, subject cascade cards */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-700">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">١. هيكلة الشجرة الأكاديمية:</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOpenModal("college", "add")}
                      className="bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-600 dark:text-emerald-400 px-2.5 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Plus size={12} />
                      <span>كلية جديدة</span>
                    </button>
                  </div>
                </div>

                {/* Cascading selectors with CRUD buttons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Select College */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-[11px] font-bold text-slate-450 dark:text-slate-400">الكلية</label>
                      {selectedCollegeId && (
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => handleOpenModal("college", "edit", currentCollege?.name || "", selectedCollegeId)}
                            className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                          >
                            تعديل الاسم
                          </button>
                          <button
                            onClick={() => handleDeleteNode("college", selectedCollegeId)}
                            className="text-[10px] text-red-500 hover:underline font-semibold"
                          >
                            حذف
                          </button>
                        </div>
                      )}
                    </div>
                    <select
                      value={selectedCollegeId}
                      onChange={(e) => {
                        setSelectedCollegeId(e.target.value);
                        setSelectedLevelId("");
                        setSelectedSubjectId("");
                        setSelectedYearId("");
                        setSelectedPeriodId("");
                      }}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-100"
                    >
                      <option value="">-- اختر الكلية --</option>
                      {colleges.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Select Level */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-[11px] font-bold text-slate-450 dark:text-slate-400">المستوى الدراسي</label>
                      <div className="flex gap-2">
                        {selectedCollegeId && (
                          <button
                            onClick={() => handleOpenModal("level", "add")}
                            className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold"
                          >
                            + إضافة جديد
                          </button>
                        )}
                        {selectedLevelId && (
                          <>
                            <button
                              onClick={() => handleOpenModal("level", "edit", currentLevel?.name || "", selectedLevelId)}
                              className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                            >
                              تعديل
                            </button>
                            <button
                              onClick={() => handleDeleteNode("level", selectedLevelId)}
                              className="text-[10px] text-red-500 hover:underline font-semibold"
                            >
                              حذف
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                    <select
                      value={selectedLevelId}
                      disabled={!selectedCollegeId}
                      onChange={(e) => {
                        setSelectedLevelId(e.target.value);
                        setSelectedSubjectId("");
                        setSelectedYearId("");
                        setSelectedPeriodId("");
                      }}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-100 disabled:opacity-55"
                    >
                      <option value="">-- اختر المستوى --</option>
                      {currentCollege?.levels.map((l) => (
                        <option key={l.id} value={l.id}>{l.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Select Subject */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-[11px] font-bold text-slate-450 dark:text-slate-400">المادة المقررة</label>
                      <div className="flex gap-2">
                        {selectedLevelId && (
                          <button
                            onClick={() => handleOpenModal("subject", "add")}
                            className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold"
                          >
                            + إضافة مادة
                          </button>
                        )}
                        {selectedSubjectId && (
                          <>
                            <button
                              onClick={() => handleOpenModal("subject", "edit", currentSubject?.name || "", selectedSubjectId)}
                              className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                            >
                              تعديل
                            </button>
                            <button
                              onClick={() => handleOpenModal("copy_subject", "add", "", selectedSubjectId)}
                              className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold flex items-center gap-0.5"
                            >
                              <Copy size={10} />
                              <span>مضاعفة مادة</span>
                            </button>
                            <button
                              onClick={() => handleDeleteNode("subject", selectedSubjectId)}
                              className="text-[10px] text-red-500 hover:underline font-semibold"
                            >
                              حذف
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                    <select
                      value={selectedSubjectId}
                      disabled={!selectedLevelId}
                      onChange={(e) => {
                        setSelectedSubjectId(e.target.value);
                        setSelectedYearId("");
                        setSelectedPeriodId("");
                      }}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-100 disabled:opacity-55"
                    >
                      <option value="">-- اختر المادة --</option>
                      {currentLevel?.subjects.map((s) => {
                        const totalQs = s.years.reduce((sum, yr) => sum + yr.periods.reduce((pSum, per) => pSum + (per.questions || []).length, 0), 0);
                        return (
                          <option key={s.id} value={s.id}>{s.name} ({totalQs} أسئلة)</option>
                        );
                      })}
                    </select>

                    {/* Order buttons for subjects */}
                    {selectedLevelId && currentLevel?.subjects && currentLevel.subjects.length > 1 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        <span className="text-[10px] text-slate-400 font-bold self-center">ترتيب المواد:</span>
                        {currentLevel.subjects.map((s) => (
                          <div key={s.id} className="flex bg-slate-100 dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-750 px-2 py-0.5 text-[9px] font-bold text-slate-650 items-center gap-1">
                            <span className="truncate max-w-[80px]">{s.name}</span>
                            <button onClick={() => handleReorder("subject", s.id, "up")} className="hover:text-emerald-600">▲</button>
                            <button onClick={() => handleReorder("subject", s.id, "down")} className="hover:text-emerald-600">▼</button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Select Year */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-[11px] font-bold text-slate-450 dark:text-slate-400">العام الأكاديمي</label>
                      <div className="flex gap-2">
                        {selectedSubjectId && (
                          <button
                            onClick={() => handleOpenModal("year", "add")}
                            className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold"
                          >
                            + إضافة سنة
                          </button>
                        )}
                        {selectedYearId && (
                          <>
                            <button
                              onClick={() => handleOpenModal("year", "edit", currentYear?.name || "", selectedYearId)}
                              className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                            >
                              تعديل
                            </button>
                            <button
                              onClick={() => handleDeleteNode("year", selectedYearId)}
                              className="text-[10px] text-red-500 hover:underline font-semibold"
                            >
                              حذف
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                    <select
                      value={selectedYearId}
                      disabled={!selectedSubjectId}
                      onChange={(e) => {
                        setSelectedYearId(e.target.value);
                        setSelectedPeriodId("");
                      }}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-100 disabled:opacity-55"
                    >
                      <option value="">-- اختر العام --</option>
                      {currentSubject?.years.map((y) => {
                        const totalQs = y.periods.reduce((sum, per) => sum + (per.questions || []).length, 0);
                        return (
                          <option key={y.id} value={y.id}>{y.name} ({totalQs} أسئلة)</option>
                        );
                      })}
                    </select>

                    {/* Order buttons for years */}
                    {selectedSubjectId && currentSubject?.years && currentSubject.years.length > 1 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        <span className="text-[10px] text-slate-400 font-bold self-center">ترتيب السنوات:</span>
                        {currentSubject.years.map((y) => (
                          <div key={y.id} className="flex bg-slate-100 dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-750 px-2 py-0.5 text-[9px] font-bold text-slate-650 items-center gap-1">
                            <span className="truncate max-w-[80px]">{y.name}</span>
                            <button onClick={() => handleReorder("year", y.id, "up")} className="hover:text-emerald-600">▲</button>
                            <button onClick={() => handleReorder("year", y.id, "down")} className="hover:text-emerald-600">▼</button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Select Period */}
                  <div className="space-y-1.5 md:col-span-2">
                    <div className="flex justify-between items-center">
                      <label className="text-[11px] font-bold text-slate-450 dark:text-slate-400">النموذج / الفترة</label>
                      <div className="flex gap-2">
                        {selectedYearId && (
                          <button
                            onClick={() => handleOpenModal("period", "add")}
                            className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold"
                          >
                            + إضافة نموذج/فترة
                          </button>
                        )}
                        {selectedPeriodId && (
                          <>
                            <button
                              onClick={() => handleOpenModal("period", "edit", currentPeriod?.name || "", selectedPeriodId)}
                              className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                            >
                              تعديل الاسم
                            </button>
                            <button
                              onClick={() => handleOpenModal("move_period", "add", "", selectedPeriodId)}
                              className="text-[10px] text-amber-600 dark:text-amber-500 font-semibold flex items-center gap-0.5"
                            >
                              <ArrowRightLeft size={10} />
                              <span>نقل لعام آخر</span>
                            </button>
                            <button
                              onClick={() => handleOpenModal("clone_period", "add", "", selectedPeriodId)}
                              className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold flex items-center gap-0.5"
                            >
                              <Copy size={10} />
                              <span>استنساخ مع الأسئلة</span>
                            </button>
                            <button
                              onClick={() => handleDeleteNode("period", selectedPeriodId)}
                              className="text-[10px] text-red-500 hover:underline font-semibold"
                            >
                              حذف النموذج
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                    <select
                      value={selectedPeriodId}
                      disabled={!selectedYearId}
                      onChange={(e) => setSelectedPeriodId(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-100 disabled:opacity-55"
                    >
                      <option value="">-- اختر النموذج --</option>
                      {currentYear?.periods.map((p) => (
                        <option key={p.id} value={p.id}>{p.name} ({p.questions?.length || 0} سؤال)</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Single Question Editor Form Card */}
              {selectedPeriodId && (
                <div
                  id="questionFormAnchor"
                  className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 space-y-4 shadow-sm"
                >
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-700">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles size={13} className="text-amber-500" />
                      <span>{editingQuestionId ? "تعديل السؤال الحالي" : "٢. إضافة سؤال يدوي للنموذج الفرعي"}</span>
                    </h4>
                    {editingQuestionId && (
                      <button
                        onClick={resetQuestionForm}
                        className="text-[10px] bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-350 px-2.5 py-1 rounded-md"
                      >
                        إلغاء التعديل
                      </button>
                    )}
                  </div>

                  <form onSubmit={handleSaveQuestion} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 dark:text-slate-400">نص السؤال العلمي</label>
                      <textarea
                        rows={2}
                        placeholder="أدخل صيغة السؤال بوضوح هنا..."
                        value={qText}
                        onChange={(e) => setQText(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 dark:text-slate-400">رابط الصورة التوضيحية للسؤال (اختياري)</label>
                      <input
                        type="url"
                        placeholder="أدخل رابط صورة بيانية أو رسم توضيحي للسؤال (مثال: https://...)"
                        value={qImage}
                        onChange={(e) => setQImage(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>

                    {qImage && (
                      <div className="p-2 border border-dashed border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 flex justify-center items-center">
                        <img src={qImage} alt="رسم توضيحي للسؤال" className="max-h-24 object-contain rounded" referrerPolicy="no-referrer" />
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { label: "الخيار (أ)", val: qOptA, set: setQOptA },
                        { label: "الخيار (ب)", val: qOptB, set: setQOptB },
                        { label: "الخيار (ج)", val: qOptC, set: setQOptC },
                        { label: "الخيار (د)", val: qOptD, set: setQOptD },
                      ].map((opt, oIdx) => (
                        <div key={oIdx} className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-450 dark:text-slate-400">{opt.label}</label>
                          <input
                            type="text"
                            placeholder="أدخل نص البديل..."
                            value={opt.val}
                            onChange={(e) => opt.set(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-100 focus:outline-none"
                            required
                          />
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400">الجواب الصحيح</label>
                        <select
                          value={qCorrectIdx}
                          onChange={(e) => setQCorrectIdx(Number(e.target.value))}
                          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 dark:text-slate-100"
                        >
                          <option value={0}>الخيار (أ)</option>
                          <option value={1}>الخيار (ب)</option>
                          <option value={2}>الخيار (ج)</option>
                          <option value={3}>الخيار (د)</option>
                        </select>
                      </div>

                      <div className="space-y-1.5 sm:col-span-2">
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 font-medium">الشرح والتبرير العلمي (اختياري)</label>
                        <input
                          type="text"
                          placeholder="اكتب تعليلاً مبسطاً لحله الصحيح..."
                          value={qExplanation}
                          onChange={(e) => setQExplanation(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-800 dark:text-slate-100"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-amber-600 hover:bg-amber-700 text-white font-extrabold py-3.5 rounded-xl text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle size={15} />
                      <span>{editingQuestionId ? "حفظ التعديلات الحالية" : "حفظ وإضافة السؤال للنموذج"}</span>
                    </button>
                  </form>
                </div>
              )}

              {/* Questions table list for currently selected period */}
              {selectedPeriodId && (
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">الأسئلة الحالية المضافة للنموذج: ({currentPeriod?.questions?.length || 0})</h4>

                  {(!currentPeriod?.questions || currentPeriod.questions.length === 0) ? (
                    <p className="text-center text-xs text-slate-400 py-6">لا توجد أسئلة مضافة في هذا النموذج بعد. أضف أسئلة أعلاه أو استخدم مستخرج الـ PDF لتعبئة النماذج تلقائياً!</p>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                      {currentPeriod.questions.map((q, idx) => (
                        <div key={q.id} className="p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl flex items-start justify-between gap-3">
                          <div className="space-y-1.5 flex-grow font-sans">
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] font-bold bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded">سؤال {idx + 1}</span>
                              <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 font-sans">الخيار الصحيح: {["أ", "ب", "ج", "د"][q.correctAnswerIndex]}</span>
                              {q.image && <span className="text-[9px] font-bold text-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 dark:text-indigo-300 px-1.5 py-0.5 rounded">يحتوي صورة توضيحية</span>}
                            </div>
                            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-relaxed font-sans">{q.text}</p>
                          </div>
                          <div className="flex gap-1 items-center flex-shrink-0">
                            <button
                              onClick={() => handleMoveQuestionUp(q.id)}
                              disabled={idx === 0}
                              type="button"
                              title="نقل لأعلى"
                              className="p-1 text-slate-400 hover:text-slate-800 dark:hover:text-white rounded transition disabled:opacity-20 cursor-pointer"
                            >
                              <ArrowUpDown size={13} className="transform rotate-180" />
                            </button>
                            <button
                              onClick={() => handleMoveQuestionDown(q.id)}
                              disabled={idx === currentPeriod.questions.length - 1}
                              type="button"
                              title="نقل لأسفل"
                              className="p-1 text-slate-400 hover:text-slate-800 dark:hover:text-white rounded transition disabled:opacity-20 cursor-pointer"
                            >
                              <ArrowUpDown size={13} />
                            </button>
                            <button onClick={() => handleEditQuestion(q)} type="button" className="p-1 text-blue-600 hover:bg-slate-200 dark:hover:bg-slate-800 rounded transition cursor-pointer"><Edit3 size={14} /></button>
                            <button onClick={() => handleDeleteQuestion(q.id)} type="button" className="p-1 text-red-500 hover:bg-slate-200 dark:hover:bg-slate-800 rounded transition cursor-pointer"><Trash2 size={14} /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 1.5: REAL-TIME ANALYTICS DASHBOARD */}
          {adminTab === "analytics" && (() => {
            const totalTrials = localAttempts.length;
            const studentIds = new Set(localAttempts.map(a => a.studentId || a.studentName || "مجهول"));
            const uniqueStudentCount = studentIds.size;
            
            const avgScore = totalTrials > 0 
              ? Math.round(localAttempts.reduce((sum, a) => sum + (a.percentage || 0), 0) / totalTrials) 
              : 0;
            
            const successCount = localAttempts.filter(a => (a.percentage || 0) >= 50).length;
            const failureCount = totalTrials - successCount;
            const successRate = totalTrials > 0 ? Math.round((successCount / totalTrials) * 100) : 100;
            
            // Subject popularity
            const subjectPopularity: { [key: string]: number } = {};
            localAttempts.forEach(a => {
              const name = a.subjectName || "عام";
              subjectPopularity[name] = (subjectPopularity[name] || 0) + 1;
            });
            const sortedSubjects = Object.entries(subjectPopularity)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 5);

            // Hardest questions lookup
            const incorrectQuestionsCount: { [key: string]: { text: string; count: number; college: string; subject: string } } = {};
            localAttempts.forEach(a => {
              if (a.answers) {
                Object.entries(a.answers).forEach(([qId, ansIdx]) => {
                  let foundQ: Question | null = null;
                  for (const c of colleges) {
                    for (const l of c.levels) {
                      for (const s of l.subjects) {
                        for (const y of s.years) {
                          for (const p of y.periods) {
                            const q = p.questions?.find(q => q.id === qId);
                            if (q) {
                              foundQ = q;
                              break;
                            }
                          }
                        }
                      }
                    }
                  }
                  if (foundQ) {
                    const isCorrect = ansIdx === foundQ.correctAnswerIndex;
                    if (!isCorrect) {
                      if (!incorrectQuestionsCount[qId]) {
                        incorrectQuestionsCount[qId] = { text: foundQ.text, count: 0, college: a.collegeName, subject: a.subjectName };
                      }
                      incorrectQuestionsCount[qId].count += 1;
                    }
                  }
                });
              }
            });

            const hardestQuestions = Object.entries(incorrectQuestionsCount)
              .sort((a, b) => b[1].count - a[1].count)
              .slice(0, 5);

            return (
              <div className="space-y-6 animate-fade-in text-right">
                {/* Metrics top overview cards */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 flex items-center justify-between shadow-xs">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 block">إجمالي الطلاب الفريدين</span>
                      <span className="text-xl font-extrabold text-slate-900 dark:text-white font-sans">{uniqueStudentCount}</span>
                    </div>
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-xl">
                      <Users size={18} />
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 flex items-center justify-between shadow-xs">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 block">الجلسات المكتملة</span>
                      <span className="text-xl font-extrabold text-slate-900 dark:text-white font-sans">{totalTrials}</span>
                    </div>
                    <div className="p-3 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-xl">
                      <FileSpreadsheet size={18} />
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 flex items-center justify-between shadow-xs">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 block">متوسط الدرجات العام</span>
                      <span className="text-xl font-extrabold text-slate-900 dark:text-white font-sans">{avgScore}%</span>
                    </div>
                    <div className="p-3 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-xl">
                      <Target size={18} />
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 flex items-center justify-between shadow-xs">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 block">معدل النجاح الإجمالي</span>
                      <span className="text-xl font-extrabold text-slate-950 dark:text-emerald-400 font-sans">{successRate}%</span>
                    </div>
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-xl">
                      <CheckCircle size={18} />
                    </div>
                  </div>
                </div>

                {/* Main visual stats section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Right side: Success distribution & subject popularity */}
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 space-y-4">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">توزيع نسب نجاح ورسوب الطلاب</h4>
                      
                      {totalTrials === 0 ? (
                        <p className="text-xs text-slate-400 text-center py-8">لا يوجد بيانات اختبارات كافية بعد لرسم المؤشر.</p>
                      ) : (
                        <div className="space-y-4">
                          <div className="relative pt-1">
                            <div className="flex mb-2 items-center justify-between text-xs">
                              <span className="text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded">الناجحون (درجة ٥٠٪ فأكثر): {successCount}</span>
                              <span className="text-red-500 font-bold bg-red-50 dark:bg-red-950/30 px-2 py-0.5 rounded">المقصرون (أقل من ٥٠٪): {failureCount}</span>
                            </div>
                            <div className="overflow-hidden h-3 text-xs flex rounded-full bg-slate-100 dark:bg-slate-900">
                              <div style={{ width: `${successRate}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-emerald-600 transition-all duration-500"></div>
                              <div style={{ width: `${100 - successRate}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500 transition-all duration-500"></div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-center pt-2">
                            <div className="p-3 bg-emerald-50/40 dark:bg-emerald-950/10 rounded-xl border border-emerald-100/30">
                              <span className="text-[10px] text-slate-400 font-semibold block">معدل النجاح</span>
                              <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 font-sans">{successRate}%</span>
                            </div>
                            <div className="p-3 bg-red-50/40 dark:bg-red-950/10 rounded-xl border border-red-100/30">
                              <span className="text-[10px] text-slate-400 font-semibold block">معدل الرسوب والتأخر</span>
                              <span className="text-lg font-extrabold text-red-500 dark:text-red-400 font-sans">{100 - successRate}%</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 space-y-4">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">المواد الدراسية الأكثر طلباً وإقبالاً</h4>
                      
                      {sortedSubjects.length === 0 ? (
                        <p className="text-xs text-slate-400 text-center py-8 font-medium">لم يتم إجراء أي امتحانات في المواد بعد.</p>
                      ) : (
                        <div className="space-y-3">
                          {sortedSubjects.map(([subjectName, count], idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-xl">
                              <div className="flex items-center gap-2.5">
                                <span className="w-5 h-5 bg-amber-500/10 text-amber-500 text-[10px] font-extrabold rounded-full flex items-center justify-center font-sans">
                                  {idx + 1}
                                </span>
                                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{subjectName}</span>
                              </div>
                              <span className="text-xs font-bold bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-lg font-sans">
                                {count} جلسات حل
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Left side: Hardest questions list */}
                  <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 space-y-4">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">أصعب ٥ أسئلة في البنك (الأكثر تكراراً للخطأ)</h4>
                    
                    {hardestQuestions.length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-12">لا توجد أخطاء مسجلة بعد للأسئلة. تظهر هنا الأسئلة التي يخطئ فيها الطلاب لتمكين الإدارة من مراجعتها.</p>
                    ) : (
                      <div className="space-y-3.5">
                        {hardestQuestions.map(([qId, item], idx) => (
                          <div key={qId} className="p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl space-y-2">
                            <div className="flex justify-between items-center text-[9px] font-bold">
                              <span className="text-red-500 bg-red-50 dark:bg-red-950/30 px-2 py-0.5 rounded">
                                أخطأ فيه الطلاب {item.count} مرات
                              </span>
                              <span className="text-slate-450">
                                {item.college} - {item.subject}
                              </span>
                            </div>
                            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
                              {item.text}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* TAB 2: GLOBAL SEARCH */}
          {adminTab === "search" && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 space-y-6 animate-fade-in transition-colors">
              <div className="space-y-1">
                <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-100">البحث السريع وبنك الأسئلة الشامل</h3>
                <p className="text-xs text-slate-400">البحث، الفلترة، النقل، الحذف، والتعديل الفوري لأي سؤال في قاعدة البيانات.</p>
              </div>

              {/* Filtering row */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold block">فلترة بالكلية</label>
                  <select
                    value={filterCollegeId}
                    onChange={(e) => {
                      setFilterCollegeId(e.target.value);
                      setFilterSubjectId("");
                    }}
                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1.5 text-xs text-slate-700 dark:text-slate-300"
                  >
                    <option value="">-- الكل --</option>
                    {colleges.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold block">فلترة بالمادة</label>
                  <select
                    value={filterSubjectId}
                    disabled={!filterCollegeId}
                    onChange={(e) => setFilterSubjectId(e.target.value)}
                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1.5 text-xs text-slate-700 dark:text-slate-300"
                  >
                    <option value="">-- الكل --</option>
                    {colleges.find((c) => c.id === filterCollegeId)?.levels.flatMap((l) => l.subjects).map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[10px] text-slate-400 font-bold block">البحث بالنص أو الخيارات</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="اكتب كلمة للبحث الفوري..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg pr-8 pl-3 py-1.5 text-xs text-slate-700 dark:text-slate-300"
                    />
                    <Search className="absolute right-2.5 top-2.5 text-slate-400" size={13} />
                  </div>
                </div>
              </div>

              {/* Query lists result */}
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-450 font-bold">نتائج البحث المصفاة: <strong className="text-slate-800 dark:text-slate-200">{filteredGlobalQuestions.length} سؤالاً</strong></span>
                </div>

                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                  {filteredGlobalQuestions.length === 0 ? (
                    <p className="text-center text-xs text-slate-400 py-10">لا توجد أي نتائج مطابقة لبحثك الحالي.</p>
                  ) : (
                    filteredGlobalQuestions.map((item, i) => (
                      <div key={item.q.id} className="p-4 bg-white dark:bg-slate-850 rounded-xl border border-slate-150 dark:border-slate-750 shadow-2xs space-y-3">
                        <div className="flex flex-wrap justify-between items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-700">
                          <div className="flex flex-wrap items-center gap-1.5 text-[9px] font-bold text-slate-400">
                            <span className="bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 px-1.5 py-0.5 rounded">{item.collegeName}</span>
                            <span>»</span>
                            <span className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 px-1.5 py-0.5 rounded">{item.subjectName}</span>
                            <span>»</span>
                            <span className="bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 px-1.5 py-0.5 rounded">{item.yearName} • {item.periodName}</span>
                          </div>
                          <button
                            onClick={() => handleDeleteQuestion(item.q.id, item.periodId)}
                            className="text-[10px] text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 px-2 py-1 rounded font-bold flex items-center gap-1"
                          >
                            <Trash2 size={11} />
                            <span>حذف السؤال</span>
                          </button>
                        </div>

                        <div className="space-y-2">
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-relaxed">{item.q.text}</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-500">
                            {item.q.options.map((opt, oIdx) => (
                              <div key={oIdx} className={`p-2 rounded border flex items-center gap-2 ${oIdx === item.q.correctAnswerIndex ? "bg-emerald-50/40 border-emerald-200 dark:bg-emerald-950/10 dark:border-emerald-900/40 text-emerald-800 dark:text-emerald-300 font-semibold" : "border-slate-100 dark:border-slate-800 bg-slate-50/35"}`}>
                                <span className="font-bold">{["أ", "ب", "ج", "د"][oIdx]}-</span>
                                <span>{opt}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PDF PARSER */}
          {adminTab === "parser" && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 space-y-6 animate-fade-in transition-colors">
              <div className="space-y-1">
                <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-100">المستخرج التلقائي للأسئلة والـ PDF الذكي</h3>
                <p className="text-xs text-slate-400">انسخ نص الاختبار بالكامل من أي ملف PDF أو مستند نصي، والصقه بالأسفل ليقوم الذكاء الداخلي بفرز الأسئلة والخيارات والحلول فوراً!</p>
              </div>

              {/* Cascade selector before pasting */}
              <div className="bg-amber-50/50 dark:bg-amber-950/20 p-4 rounded-xl border border-amber-150 dark:border-amber-900/30 text-xs space-y-3">
                <p className="font-bold text-amber-800 dark:text-amber-400">تنويه هام قبل البدء بالاستخراج:</p>
                <p className="text-slate-500 leading-relaxed">يرجى التأكد من اختيار الكلية والمادة والسنة والفترة المستهدفة لحفظ الأسئلة المستخرجة فيها:</p>
                <div className="flex flex-wrap gap-2 pt-1 font-bold">
                  <span className="bg-white dark:bg-slate-800 px-2.5 py-1 rounded border">الكلية: {currentCollege?.name || "❌ لم تختر بعد"}</span>
                  <span className="bg-white dark:bg-slate-800 px-2.5 py-1 rounded border">المادة: {currentSubject?.name || "❌ لم تختر بعد"}</span>
                  <span className="bg-white dark:bg-slate-800 px-2.5 py-1 rounded border">الفترة: {currentPeriod?.name || "❌ لم تختر بعد"}</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block">الصق نص الـ PDF المستخرج هنا بالكامل:</label>
                <textarea
                  rows={8}
                  placeholder="مثال على النسخ المطلوب:
1- ما هو الركن المادي للجريمة؟
أ- النية الجنائية فقط.
ب- السلوك الخارجي الذي تظهر به الجريمة للعالم الخارجي. *
ج- النص القانوني للعقوبة.
د- الضرر المعنوي."
                  value={pdfRawText}
                  onChange={(e) => setPdfRawText(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-xs font-mono text-slate-800 dark:text-slate-100 focus:outline-none"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleParseQuestions}
                  className="flex-1 bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-extrabold py-3.5 rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Sparkles size={14} />
                  <span>بدء تحليل واستخراج الأسئلة فوراً</span>
                </button>
                {parsedQuestions.length > 0 && (
                  <button
                    onClick={() => { setParsedQuestions([]); setIsReviewingParsed(false); }}
                    className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-350 px-4 rounded-xl text-xs transition"
                  >
                    إفراغ
                  </button>
                )}
              </div>

              {/* Review section for parsed questions */}
              {isReviewingParsed && parsedQuestions.length > 0 && (
                <div className="border-t border-slate-200 dark:border-slate-750 pt-6 space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-850 dark:text-slate-150">مراجعة وتعديل الأسئلة المستخرجة قبل الحفظ النهائي:</h4>
                      <p className="text-[10px] text-slate-400">يمكنك تعديل أي سؤال مباشرة في الجدول أدناه قبل الموافقة على الحفظ في قاعدة البيانات.</p>
                    </div>
                    <button
                      onClick={handleSaveParsedQuestions}
                      disabled={!selectedPeriodId}
                      className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-extrabold py-2.5 px-5 rounded-xl text-xs transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <CheckCircle size={14} />
                      <span>اعتماد وحفظ جميع الأسئلة ({parsedQuestions.length})</span>
                    </button>
                  </div>

                  {/* Interactive questions preview table list */}
                  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
                    {parsedQuestions.map((pq, pIdx) => (
                      <div key={pq.id} className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-150 dark:border-slate-800 space-y-3">
                        <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 pb-1.5 border-b border-slate-100 dark:border-slate-750">
                          <span>سؤال مستخرج رقم #{pIdx + 1}</span>
                          <button
                            onClick={() => setParsedQuestions(parsedQuestions.filter((q) => q.id !== pq.id))}
                            className="text-red-500 hover:underline"
                          >
                            حذف من القائمة
                          </button>
                        </div>

                        {/* Inline edits */}
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={pq.text}
                            onChange={(e) => {
                              const updated = [...parsedQuestions];
                              updated[pIdx].text = e.target.value;
                              setParsedQuestions(updated);
                            }}
                            className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1.5 text-xs text-slate-800 dark:text-slate-100 font-semibold"
                          />

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            {pq.options.map((opt, oIdx) => (
                              <div key={oIdx} className="flex gap-2 items-center bg-white dark:bg-slate-800 border border-slate-150 dark:border-slate-750 p-1.5 rounded">
                                <span className="font-bold text-[10px] text-slate-400">{["أ", "ب", "ج", "د"][oIdx]}:</span>
                                <input
                                  type="text"
                                  value={opt}
                                  onChange={(e) => {
                                    const updated = [...parsedQuestions];
                                    updated[pIdx].options[oIdx] = e.target.value;
                                    setParsedQuestions(updated);
                                  }}
                                  className="flex-1 bg-transparent border-0 p-0 text-xs text-slate-700 dark:text-slate-350 focus:ring-0 focus:outline-none"
                                />
                                <input
                                  type="radio"
                                  name={`correct_${pq.id}`}
                                  checked={oIdx === pq.correctAnswerIndex}
                                  onChange={() => {
                                    const updated = [...parsedQuestions];
                                    updated[pIdx].correctAnswerIndex = oIdx;
                                    setParsedQuestions(updated);
                                  }}
                                  title="تعيين كإجابة صحيحة"
                                  className="text-emerald-600 focus:ring-emerald-500 h-3 w-3"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: SYSTEM & BACKUPS */}
          {adminTab === "system" && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 space-y-6 animate-fade-in transition-colors">
              <div className="space-y-1">
                <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-100">إدارة النظام والنسخ الاحتياطي للمنصة</h3>
                <p className="text-xs text-slate-400 font-medium">التحكم في قاعدة البيانات واستيراد وتصدير كافة النماذج بضغطة زر واحدة.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-850 rounded-xl space-y-3">
                  <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-200">النسخ الاحتياطي وتصدير البيانات</h4>
                  <p className="text-[11px] text-slate-450 leading-relaxed">حمل نسخة احتياطية مشفرة لجميع الكليات والمواد والأسئلة بصيغة JSON على جهازك لتتمكن من استعادتها في أي وقت أو مشاركتها مع مشرف آخر.</p>
                  <button
                    onClick={handleExportJSON}
                    className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Download size={13} />
                    <span>تصدير نسخة احتياطية JSON</span>
                  </button>
                </div>

                <div className="p-5 bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-850 rounded-xl space-y-3">
                  <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-200">استيراد واستعادة قاعدة البيانات</h4>
                  <p className="text-[11px] text-slate-450 leading-relaxed">استورد قاعدة بيانات جديدة بالكامل أو ادمج نماذج مضافة مسبقاً عن طريق رفع ملف JSON الاحتياطي من جهازك.</p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-650 text-slate-800 dark:text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Upload size={13} />
                    <span>استعادة قاعدة البيانات من JSON</span>
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImportJSON}
                    accept=".json"
                    className="hidden"
                  />
                </div>
              </div>

              {/* Covert PIN Settings */}
              <div className="p-5 bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-850 rounded-2xl space-y-4">
                <div className="space-y-1">
                  <h4 className="text-xs font-extrabold text-slate-850 dark:text-slate-150">تغيير رمز المرور السري (PIN) للوحة التحكم</h4>
                  <p className="text-[11px] text-slate-400">الرمز السري الافتراضي للمنصة هو <strong className="font-mono text-slate-600 dark:text-slate-300">2026</strong>. لتغييره، يرجى إدخال 4 أرقام سرية جديدة أدناه.</p>
                </div>
                
                <form onSubmit={handleUpdatePinSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md items-end">
                  <div className="space-y-1.5 flex-1 w-full">
                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400">رمز المرور السري الجديد (4 أرقام):</label>
                    <input
                      type="text"
                      maxLength={4}
                      pattern="[0-9]{4}"
                      placeholder="مثال: 2026"
                      required
                      value={newPinValue}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, "");
                        setNewPinValue(val);
                      }}
                      className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs font-extrabold text-slate-800 dark:text-slate-100 text-center tracking-widest focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-5 py-3 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-xs w-full sm:w-auto justify-center"
                  >
                    <CheckCircle size={14} />
                    <span>حفظ وتعميم الرمز السري الجديد</span>
                  </button>
                </form>

                {pinChangeSuccess && (
                  <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 animate-pulse">{pinChangeSuccess}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RENDER DYNAMIC CRITICAL ACTION MODAL */}
      {modalType && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl border border-slate-100 dark:border-slate-700 space-y-5 animate-fade-in text-right">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-700">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                {modalType === "college" && (modalAction === "add" ? "إضافة كلية جديدة" : "تعديل اسم الكلية")}
                {modalType === "level" && (modalAction === "add" ? "إضافة مستوى دراسي جديد" : "تعديل اسم المستوى")}
                {modalType === "subject" && (modalAction === "add" ? "إضافة مادة مقررة جديدة" : "تعديل اسم المادة")}
                {modalType === "year" && (modalAction === "add" ? "إضافة سنة دراسية جديدة" : "تعديل السنة")}
                {modalType === "period" && (modalAction === "add" ? "إضافة نموذج فترة جديد" : "تعديل اسم النموذج")}
                {modalType === "move_period" && "نقل النموذج إلى عام دراسي آخر"}
                {modalType === "clone_period" && "استنساخ النموذج بالكامل مع أسئلته"}
                {modalType === "copy_subject" && "نسخ ومضاعفة المادة إلى مستوى آخر"}
              </h3>
              <button
                onClick={() => setModalType(null)}
                className="text-slate-400 hover:text-slate-650 p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleModalSubmit} className="space-y-4">
              {/* standard input for text nodes */}
              {!["move_period", "clone_period", "copy_subject"].includes(modalType) ? (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400">الاسم والبيان بالعربية</label>
                  <input
                    type="text"
                    required
                    value={modalInputValue}
                    onChange={(e) => setModalInputValue(e.target.value)}
                    placeholder="مثال: كلية الشريعة، المستوى الأول..."
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3.5 text-xs text-slate-800 dark:text-slate-100 focus:outline-none"
                  />
                </div>
              ) : modalType === "move_period" || modalType === "clone_period" ? (
                /* Year transfer destination selector */
                <div className="space-y-2">
                  <p className="text-xs text-slate-400 leading-relaxed">النموذج النشط هو: <strong className="text-slate-800 dark:text-slate-250">{currentPeriod?.name}</strong>. يرجى تحديد العام الدراسي المستهدف للنقل أو النسخ:</p>
                  <select
                    required
                    value={modalDestYearId}
                    onChange={(e) => setModalDestYearId(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-3 text-xs text-slate-800 dark:text-slate-100"
                  >
                    <option value="">-- اختر العام الدراسي المستهدف --</option>
                    {currentSubject?.years.map((y) => (
                      <option key={y.id} value={y.id}>{y.name}</option>
                    ))}
                  </select>
                </div>
              ) : (
                /* Subject copier Level selector */
                <div className="space-y-2">
                  <p className="text-xs text-slate-400 leading-relaxed">المادة النشطة هي: <strong className="text-slate-800 dark:text-slate-250">{currentSubject?.name}</strong>. يرجى تحديد المستوى الدراسي المستهدف لنسخ ومضاعفة المادة إليه:</p>
                  <select
                    required
                    value={modalDestLevelId}
                    onChange={(e) => setModalDestLevelId(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-3 text-xs text-slate-800 dark:text-slate-100"
                  >
                    <option value="">-- اختر المستوى الدراسي المستهدف --</option>
                    {currentCollege?.levels.map((l) => (
                      <option key={l.id} value={l.id}>{l.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3.5 rounded-xl text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <CheckCircle size={15} />
                <span>تنفيذ وحفظ الإجراء الأكاديمي</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

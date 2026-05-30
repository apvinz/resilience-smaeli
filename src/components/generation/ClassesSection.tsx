import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useData } from "../../context/DataContext";
import { defaultData } from "../../data/defaultData";
import { ChevronRight, ArrowUpRight, Check, Edit2, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { useAuth } from "../../context/AuthContext";

export const ClassesSection: React.FC = () => {
  const { editMode: globalEditMode, classesData, updateClassData, showToast } = useData();
  const { canEditMainSettings } = useAuth();
  const editMode = globalEditMode && canEditMainSettings();
  const navigate = useNavigate();

  // Load classes hierarchy from defaultData, but let them be editable in local state
  const [classesHierarchy, setClassesHierarchy] = useState(defaultData.classes);
  const [activeGrade, setActiveGrade] = useState<string | null>("X");

  // Track editable fields in admin mode
  const [editingGradeKey, setEditingGradeKey] = useState<string | null>(null);
  const [editingSubclassIndex, setEditingSubclassIndex] = useState<{ gradeKey: string; idx: number } | null>(null);
  const [tempText, setTempText] = useState("");

  // Track subclass select clicks to support the "second click navigates" spec in admin mode
  const [focusedSubclass, setFocusedSubclass] = useState<string | null>(null);

  const toggleGrade = (gradeKey: string) => {
    if (editingGradeKey === gradeKey) return; // ignore if editing
    setActiveGrade(activeGrade === gradeKey ? null : gradeKey);
  };

  const startEditingGrade = (gradeKey: string, currentVal: string, e: React.MouseEvent) => {
    if (!editMode) return;
    e.stopPropagation(); // prevent collapsing the grade section
    setEditingGradeKey(gradeKey);
    setTempText(currentVal);
  };

  const saveGradeEdit = (gradeKey: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (tempText.trim()) {
      setClassesHierarchy(prev => ({
        ...prev,
        [gradeKey]: {
          ...prev[gradeKey],
          label: tempText.trim()
        }
      }));
      showToast("Label tingkatan kelas diperbarui!");
    }
    setEditingGradeKey(null);
  };

  const startEditingSubclass = (gradeKey: string, idx: number, currentVal: string, e: React.MouseEvent) => {
    if (!editMode) return;
    e.stopPropagation();
    setEditingSubclassIndex({ gradeKey, idx });
    setTempText(currentVal);
  };

  const saveSubclassEdit = (gradeKey: string, idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (tempText.trim()) {
      const newList = [...classesHierarchy[gradeKey].subclasses];
      newList[idx] = tempText.trim();

      setClassesHierarchy(prev => ({
        ...prev,
        [gradeKey]: {
          ...prev[gradeKey],
          subclasses: newList
        }
      }));
      showToast("Label sub-kelas diperbarui!");
    }
    setEditingSubclassIndex(null);
  };

  const handleSubclassClick = (gradeKey: string, subclass: string) => {
    if (!editMode) {
      // Guest view navigates instantly
      navigate(`/class/${gradeKey}/${subclass.replace(/\./g, "")}`);
    } else {
      // Admin: "single click subclass -> edit inline text. To navigate: single click grade to expand, then single click subclass (second click navigates)"
      if (focusedSubclass === subclass) {
        // Second click navigates
        navigate(`/class/${gradeKey}/${subclass.replace(/\./g, "")}`);
        setFocusedSubclass(null);
      } else {
        // First click sets focused state for navigation, and allows inline editing
        setFocusedSubclass(subclass);
        showToast(`Klik sekali lagi untuk membuka halaman kelas ${subclass}, atau ubah namanya.`);
      }
    }
  };

  return (
    <section id="classes" className="py-20 px-6 bg-[#07080A] border-t border-b border-white/5 shrink-0 scroll-mt-10 select-none">
      <div className="max-w-[1200px] mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center relative max-w-sm mx-auto">
          <h2 className="text-3xl font-extrabold text-white tracking-tight relative z-10 uppercase">
            KELAS ANGKATAN 21
          </h2>
          <div className="h-1.5 w-16 bg-[#FF7A00] mx-auto mt-3 rounded-full" />
        </div>

        {/* Grade Pills Layout */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 max-w-2xl mx-auto">
          {Object.entries(classesHierarchy).map(([key, valueObj]) => {
            const value = valueObj as { label: string; subclasses: string[] };
            const isEditing = editingGradeKey === key;
            const isSelected = activeGrade === key;

            return (
              <div key={key} className="w-full relative">
                {editMode && isEditing ? (
                  <div className="flex items-center gap-1 w-full" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="text"
                      value={tempText}
                      onChange={e => setTempText(e.target.value)}
                      className="w-full py-2.5 px-4 rounded-full border-2 border-[#FF7A00] text-center font-bold text-white bg-[#0E1015] focus:outline-none text-sm"
                      autoFocus
                      onKeyDown={e => {
                        if (e.key === "Enter") {
                          saveGradeEdit(key, e as any);
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={(e) => saveGradeEdit(key, e)}
                      className="p-2.5 bg-green-500 text-white rounded-full hover:bg-green-600 shadow"
                    >
                      <Check size={14} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => toggleGrade(key)}
                    className={`w-full py-3 px-6 rounded-full font-bold tracking-wide text-sm border-2 transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? "bg-[#FF7A00] border-[#FF7A00] text-white shadow-lg shadow-[#FF7A00]/10"
                        : "bg-[#0E1015] border-white/10 hover:bg-white/5 text-gray-300"
                    }`}
                  >
                    <span>{value.label}</span>
                    <div className="flex items-center gap-1.5">
                      {editMode && (
                        <button
                          type="button"
                          onClick={(e) => startEditingGrade(key, value.label, e)}
                          className={`p-1 rounded-full text-xs hover:bg-black/10 transition-colors ${
                            isSelected ? "text-white" : "text-[#FF7A00]"
                          }`}
                          title="Ubah Nama Tingkatan"
                        >
                          <Edit2 size={12} />
                        </button>
                      )}
                      <ChevronRight
                        size={14}
                        className={`transition-transform duration-300 ${isSelected ? "rotate-90" : ""}`}
                      />
                    </div>
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Dropdown Animated Subclasses */}
        <div className="max-w-2xl mx-auto text-center">
          <AnimatePresence mode="wait">
            {activeGrade && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                key={activeGrade}
                className="overflow-hidden bg-[#0E1015] rounded-2xl p-6 border border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4"
              >
                {(() => {
                  const availableCount = classesHierarchy[activeGrade].subclasses.filter(sub => {
                    const classInfo = classesData[sub];
                    return classInfo ? classInfo.isAvailable !== false : (!sub.startsWith("XI.") && !sub.startsWith("XII."));
                  }).length;

                  if (!editMode && availableCount === 0) {
                    return (
                      <div className="col-span-full py-12 text-[#9CA3AF] font-semibold text-center italic uppercase text-xs tracking-wider">
                        Belum ada kelas {activeGrade} yang tersedia untuk dikunjungi.
                      </div>
                    );
                  }

                  return classesHierarchy[activeGrade].subclasses.map((sub, idx) => {
                    const classInfo = classesData[sub];
                    const isAvailable = classInfo ? classInfo.isAvailable !== false : (!sub.startsWith("XI.") && !sub.startsWith("XII."));

                    if (!editMode && !isAvailable) return null;

                    const isSubclassEditing =
                      editingSubclassIndex?.gradeKey === activeGrade && editingSubclassIndex?.idx === idx;
                    const isFocused = focusedSubclass === sub;

                    return (
                      <div key={idx} className="w-full relative">
                        {editMode && isSubclassEditing ? (
                          <div className="flex items-center gap-1 w-full" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="text"
                              value={tempText}
                              onChange={e => setTempText(e.target.value)}
                              className="w-full py-2 px-3 border border-[#FF7A00] bg-[#14161E] text-white rounded-xl text-center text-xs font-bold"
                              autoFocus
                              onKeyDown={e => {
                                if (e.key === "Enter") {
                                  saveSubclassEdit(activeGrade, idx, e as any);
                                }
                              }}
                            />
                            <button
                              type="button"
                              onClick={(e) => saveSubclassEdit(activeGrade, idx, e)}
                              className="p-1.5 bg-green-500 text-white rounded-lg shadow hover:bg-green-600"
                            >
                              <Check size={11} />
                            </button>
                          </div>
                        ) : (
                          <div
                            onClick={() => handleSubclassClick(activeGrade, sub)}
                            className={`group cursor-pointer select-none p-3.5 rounded-xl border font-semibold text-sm transition-all flex flex-col items-center justify-center gap-1 text-center ${
                              isFocused
                                ? "bg-[#FF7A00] border-[#FF7A00] text-white shadow-md animate-pulse"
                                : "bg-[#14161E] border-white/5 hover:border-[#FF7A00]/50 text-gray-300 hover:-translate-y-0.5 hover:bg-[#1C1E26]"
                            }`}
                          >
                            <div className="flex items-center gap-1.5 justify-center w-full">
                              <span>{sub}</span>
                              {editMode && (
                                <button
                                  type="button"
                                  onClick={(e) => startEditingSubclass(activeGrade, idx, sub, e)}
                                  className={`opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-white/10 ${
                                    isFocused ? "text-white" : "text-[#FF7A00]"
                                  } transition-opacity`}
                                  title="Ubah Nama Kelas"
                                >
                                  <Edit2 size={10} />
                                </button>
                              )}
                            </div>

                            {/* Admin Availability Switcher */}
                            {editMode && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateClassData(sub, { isAvailable: !isAvailable });
                                  showToast(`Kelas ${sub} sekarang ${!isAvailable ? "TERSEDIA" : "TIDAK TERSEDIA"} untuk pengunjung!`);
                                }}
                                className={`mt-1 px-2 py-0.5 rounded-full text-[8px] font-extrabold flex items-center gap-1 transition-all border ${
                                  isAvailable
                                    ? "bg-green-950/40 border-green-800 text-green-400 hover:bg-green-900"
                                    : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                                }`}
                                title={isAvailable ? "Ubah ke tidak tersedia" : "Ubah ke tersedia"}
                              >
                                {isAvailable ? (
                                  <>
                                    <Eye size={9} />
                                    <span>TERSEDIA</span>
                                  </>
                                ) : (
                                  <>
                                    <EyeOff size={9} />
                                    <span>LOCKED</span>
                                  </>
                                )}
                              </button>
                            )}

                            {/* Quick sub-descriptor badge */}
                            <span className={`text-[9px] font-bold ${isFocused ? "text-white/80" : "text-gray-400"} flex items-center gap-0.5`}>
                              {isFocused ? (
                                <span>KLIK LAGI BUKA</span>
                              ) : (
                                <>
                                  <span>KUNJUNGI</span>
                                  <ArrowUpRight size={8} />
                                </>
                              )}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  });
                })()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

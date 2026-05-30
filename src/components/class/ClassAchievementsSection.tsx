import React, { useState } from "react";
import { useData } from "../../context/DataContext";
import { AchievementCard } from "../generation/AchievementCard";
import { AchievementForm } from "../admin/AchievementForm";
import { Plus, Award, Star } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { useAuth } from "../../context/AuthContext";

interface ClassAchievementsSectionProps {
  level: string;
  subclass: string;
}

export const ClassAchievementsSection: React.FC<ClassAchievementsSectionProps> = ({ level, subclass }) => {
  const { editMode: globalEditMode, classesData, updateClassData, showToast } = useData();
  const { canEditClass } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);

  const subclassDisplay = subclass.includes(".") ? subclass : `${level}.${subclass.replace(level, "")}`;
  const editMode = globalEditMode && canEditClass(subclassDisplay);

  const currentClassData = classesData[subclassDisplay];
  const achievements = currentClassData?.achievements || [];

  const handleAddAchievement = (newAch: any) => {
    updateClassData(subclassDisplay, {
      achievements: [...achievements, newAch]
    });
    showToast("Prestasi kelas ditambahkan! Klik SIMPAN di kanan atas untuk mengunci data.");
  };

  const handleUpdateAchievement = (updatedAch: any) => {
    updateClassData(subclassDisplay, {
      achievements: achievements.map(ach => (ach.id === updatedAch.id ? updatedAch : ach))
    });
  };

  const handleDeleteAchievement = (id: string) => {
    updateClassData(subclassDisplay, {
      achievements: achievements.filter(ach => ach.id !== id)
    });
    showToast("Kartu prestasi kelas dihapus.");
  };

  return (
    <section id="achievements" className="py-20 px-6 bg-[#07080A] border-t border-white/5 shrink-0 scroll-mt-10 select-none">
      <div className="max-w-[1200px] mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center relative max-w-sm mx-auto">
          <h2 className="text-3xl font-extrabold text-white tracking-tight relative z-10 uppercase">
            PRESTASI KELAS {subclassDisplay}
          </h2>
          <div className="h-1.5 w-16 bg-[#FF7A00] mx-auto mt-3 rounded-full" />
        </div>

        {/* Section Actions bar */}
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-sm text-white uppercase tracking-wide flex items-center gap-2">
            <Star size={16} className="text-[#FF7A00]" />
            <span>PIALA DAN PENGHARGAAN DAN REKOR</span>
          </h3>

          {/* Admin Command triggers */}
          {editMode && (
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-full font-bold shadow flex items-center gap-1.5 transition-all text-xs cursor-pointer transform hover:scale-105 active:scale-95"
              type="button"
            >
              <Plus size={14} />
              <span>TAMBAH PRESTASI</span>
            </button>
          )}
        </div>

        {/* Achievements Card list */}
        {achievements.length === 0 ? (
          <div className="text-center py-20 bg-[#14161E] border border-white/10 rounded-2xl text-gray-400 font-semibold italic">
            Belum ada prestasi kelas yang terdaftar.
            {editMode && (
              <p className="not-italic text-[10px] text-gray-500 font-bold uppercase mt-1">
                Gunakan tombol 'Tambah Prestasi' di atas untuk mengarsip dokumentasi perlombaan.
              </p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            <AnimatePresence mode="popLayout">
              {achievements.map((ach) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  key={ach.id}
                >
                  <AchievementCard
                    achievement={ach}
                    onUpdate={handleUpdateAchievement}
                    onDelete={() => handleDeleteAchievement(ach.id)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* 5-step form addition modal */}
      {showAddModal && (
        <AchievementForm
          onSave={handleAddAchievement}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </section>
  );
};

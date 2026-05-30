import React, { useState } from "react";
import { useData } from "../../context/DataContext";
import { buildLeaderboard } from "../../utils/pointsCalculator";
import { AchievementCard } from "./AchievementCard";
import { AchievementForm } from "../admin/AchievementForm";
import { EditableText } from "../admin/EditableText";
import { Plus, Trophy, ListCollapse, Award, X, Sparkles, Medal } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { useAuth } from "../../context/AuthContext";

export const AchievementsSection: React.FC = () => {
  const { editMode: globalEditMode, generationAchievements, setGenerationAchievements, generationHero, setGenerationHero, showToast } = useData();
  const { canEditMainSettings } = useAuth();
  const editMode = globalEditMode && canEditMainSettings();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState<any | null>(null);

  // Parse leaderboard from current achievements roster
  const leaderboard = buildLeaderboard(generationAchievements).slice(0, 20);

  const handleLeaderboardTextChange = (field: "leaderboardTitle" | "leaderboardSubtitle", value: string) => {
    setGenerationHero({
      ...generationHero,
      [field]: value
    });
  };

  const handleAddAchievement = (newAch: any) => {
    setGenerationAchievements([...generationAchievements, newAch]);
    showToast("Prestasi baru berhasil ditambahkan! Klik SIMPAN di kanan atas untuk mengunci data.");
  };

  const handleUpdateAchievement = (updatedAch: any) => {
    setGenerationAchievements(
      generationAchievements.map(ach => (ach.id === updatedAch.id ? updatedAch : ach))
    );
  };

  const handleDeleteAchievement = (id: string) => {
    setGenerationAchievements(generationAchievements.filter(ach => ach.id !== id));
    showToast("Kartu prestasi dihapus.");
  };

  return (
    <section id="achievements" className="py-20 px-6 bg-[#07080A] border-b border-white/5 select-none scroll-mt-6">
      <div className="max-w-[1200px] mx-auto space-y-16">
        {/* Section Header */}
        <div className="text-center relative max-w-sm mx-auto">
          <h2 className="text-3xl font-extrabold text-white tracking-tight relative z-10 uppercase">
            PRESTASI ANGKATAN 21
          </h2>
          <div className="h-1.5 w-16 bg-[#FF7A00] mx-auto mt-3 rounded-full" />
        </div>

        {/* TOP SECTION: Leaderboard (Top 20) */}
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#0E1015] rounded-2xl p-6 sm:p-8 shadow-card border border-white/10"
          >
            <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-6">
              <div className="p-2.5 bg-white/5 text-[#FF7A00] border border-white/10 rounded-xl shrink-0">
                <Trophy size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <EditableText
                  value={generationHero.leaderboardTitle || "TOP 20 SISWA BERPRESTASI"}
                  onChange={(val) => handleLeaderboardTextChange("leaderboardTitle", val)}
                  as="h3"
                  className="font-extrabold text-lg text-white tracking-tight hover:text-[#FF7A00]/80 transition-colors cursor-pointer uppercase block"
                  editMode={editMode}
                />
                <EditableText
                  value={generationHero.leaderboardSubtitle || "Poin kumulatif angkatan 21"}
                  onChange={(val) => handleLeaderboardTextChange("leaderboardSubtitle", val)}
                  as="p"
                  className="text-xs text-gray-400 font-semibold uppercase hover:text-gray-300 transition-colors cursor-pointer block mt-0.5"
                  editMode={editMode}
                />
              </div>
            </div>

            {leaderboard.length === 0 ? (
              <p className="text-center text-sm py-8 text-gray-500 italic">
                Belum ada entri siswa berprestasi. Mulai tambahkan prestasi di bawah!
              </p>
            ) : (
              <div className="space-y-3.5 max-h-[305px] overflow-y-auto pr-1">
                {leaderboard.map((student, idx) => {
                  return (
                     <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.03, duration: 0.25 }}
                      viewport={{ once: true }}
                      key={idx}
                      className="flex items-center justify-between border-b border-white/5 pb-2.5 hover:bg-white/5 p-1.5 rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-8 flex items-center justify-center shrink-0">
                          {idx === 0 ? (
                            <Medal size={22} className="text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.5)]" />
                          ) : idx === 1 ? (
                            <Medal size={22} className="text-slate-300 drop-shadow-[0_0_6px_rgba(203,213,225,0.5)]" />
                          ) : idx === 2 ? (
                            <Medal size={22} className="text-amber-700 drop-shadow-[0_0_6px_rgba(180,83,9,0.5)]" />
                          ) : (
                            <span className="font-extrabold text-xs text-gray-500 uppercase tracking-wider">
                              {idx + 1}
                            </span>
                          )}
                        </div>
                        <div>
                          <span className="font-bold text-sm text-white tracking-wide uppercase">
                            {student.name}
                          </span>
                          <span className="ml-2 font-semibold text-xs text-gray-400 opacity-75 uppercase">
                            ({student.class})
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-xs font-semibold">
                        <span className="text-[#FF7A00] font-bold">
                          {student.totalPoints.toLocaleString()} poin
                        </span>
                        <span className="text-amber-500 bg-amber-950/40 px-2 py-0.5 rounded-full border border-amber-900/50 uppercase text-[10px] font-extrabold">
                          {student.trophyCount} piala
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </div>

        {/* BOTTOM SECTION: Achievement Cards Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-white uppercase tracking-wide flex items-center gap-2">
              <Award size={18} className="text-[#FF7A00]" />
              <span>DAFTAR DOKUMEN TINGKAT PRESTASI</span>
            </h3>

            {/* Admin Add Buttons */}
            {editMode && (
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-full font-bold shadow-md flex items-center gap-1.5 transition-all text-xs cursor-pointer transform hover:scale-105 active:scale-95"
                type="button"
              >
                <Plus size={14} />
                <span>TAMBAH KARTU</span>
              </button>
            )}
          </div>

          {generationAchievements.length === 0 ? (
            <div className="text-center py-20 bg-[#0E1015] rounded-2xl shadow-card border border-white/10 text-gray-400">
              Belum ada pencapaian prestasi tersemat.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              <AnimatePresence mode="popLayout">
                {generationAchievements.map((ach) => (
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
                      onPreview={setSelectedAchievement}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Multi-step Addition Form */}
      {showAddModal && (
        <AchievementForm
          onSave={handleAddAchievement}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {/* HIGH RES ACHIEVEMENT DETAIL POPUP MODAL */}
      <AnimatePresence>
        {selectedAchievement && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedAchievement(null)}
            className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex flex-col items-center justify-center p-4 cursor-zoom-out"
          >
            <button
              onClick={() => setSelectedAchievement(null)}
              className="absolute top-6 right-6 p-2.5 bg-white/15 hover:bg-white/25 text-white rounded-full transition-all cursor-pointer z-50"
            >
              <X size={20} />
            </button>

            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0E1015] border border-white/15 rounded-[1.75rem] max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl cursor-default scrollbar-thin"
            >
              {/* Media gallery picture frame */}
              <div className="aspect-[4/3] w-full bg-[#14161E] border-b border-white/10 relative overflow-hidden">
                <img
                  src={selectedAchievement.photo || "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=600&auto=format&fit=crop"}
                  alt={selectedAchievement.eventName}
                  className="w-full h-full object-cover"
                />
                
                {/* Badge Overlay */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="text-[10px] tracking-wider font-black px-3 py-1 bg-[#FF7A00] text-black rounded-full shadow-md uppercase">
                    {(() => {
                      const ranks: Record<string, string> = {
                        juara1: "Juara 1",
                        juara2: "Juara 2",
                        juara3: "Juara 3",
                        harapan1: "Harapan 1",
                        harapan2: "Harapan 2",
                        harapan3: "Harapan 3"
                      };
                      return ranks[selectedAchievement.rank] || selectedAchievement.rank;
                    })()}
                  </span>
                  <span className="text-[10px] tracking-wider font-black px-3 py-1 bg-white/15 text-white backdrop-blur-sm rounded-full shadow-md uppercase">
                    {(() => {
                      const levels: Record<string, string> = {
                        kota: "Tingkat Kota",
                        provinsi: "Tingkat Provinsi",
                        nasional: "Tingkat Nasional",
                        internasional: "Skala Internasional"
                      };
                      return levels[selectedAchievement.level] || selectedAchievement.level;
                    })()}
                  </span>
                </div>

                {/* Curated status badge */}
                {selectedAchievement.isCurated && (
                  <div className="absolute bottom-4 right-4 flex items-center gap-1.5 px-3 py-1 bg-amber-500 text-black text-[10px] font-black rounded-full shadow-md uppercase">
                    <Sparkles size={11} />
                    <span>KURASI PUSPRESNAS</span>
                  </div>
                )}
              </div>

              {/* Achievement detail specifications */}
              <div className="p-6 space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-black tracking-[0.2em] text-[#FF7A00] uppercase block">
                    Kategori & Nama Acara
                  </span>
                  <h3 className="text-xl font-extrabold text-white uppercase tracking-tight leading-6">
                    {selectedAchievement.eventName}
                  </h3>
                </div>

                {/* Achieved by Students list container */}
                <div className="border-t border-white/5 pt-4 space-y-2">
                  <span className="text-[10px] font-black tracking-[0.2em] text-[#FF7A00] uppercase block">
                    Siswa Berprestasi Yang Terlibat
                  </span>
                  
                  <div className="flex flex-col gap-2 max-h-36 overflow-y-auto pr-1">
                    {selectedAchievement.students.map((student: string, index: number) => (
                      <div key={index} className="flex items-center gap-3 bg-white/5 border border-white/5 p-2 rounded-xl">
                        <div className="w-5 h-5 rounded-full bg-[#FF7A00]/20 flex items-center justify-center text-[#FF7A00] font-black text-xs shrink-0">
                          {index + 1}
                        </div>
                        <span className="font-extrabold text-xs text-gray-200 tracking-wide uppercase leading-none">
                          {student}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 text-center text-[10px] text-gray-500 font-semibold uppercase">
                  Pusat Prestasi Peserta Didik — Angkatan 21
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

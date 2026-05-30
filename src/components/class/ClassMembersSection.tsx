import React, { useRef, useState } from "react";
import { useData } from "../../context/DataContext";
import { fileToBase64 } from "../../utils/imageUtils";
import { Plus, UserMinus, RefreshCw, X, Check, Image as ImageIcon, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { useAuth } from "../../context/AuthContext";

interface ClassMembersSectionProps {
  level: string;
  subclass: string;
}

const SILHOUETTE_SVG = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='%2314161E'/><circle cx='50' cy='38' r='18' fill='%23374151'/><path d='M22,76 C22,58 34,50 50,50 C66,50 78,58 78,76 Z' fill='%23374151'/></svg>";

export const ClassMembersSection: React.FC<ClassMembersSectionProps> = ({ level, subclass }) => {
  const { editMode: globalEditMode, classesData, updateClassData, showToast } = useData();
  const { canEditClass } = useAuth();

  const subclassDisplay = subclass.includes(".") ? subclass : `${level}.${subclass.replace(level, "")}`;
  const editMode = globalEditMode && canEditClass(subclassDisplay);

  const currentClassData = classesData[subclassDisplay];
  const members = currentClassData?.members || [];

  // Local dialog handles
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberPhoto, setNewMemberPhoto] = useState("");

  const addPhotoInputRef = useRef<HTMLInputElement>(null);
  const replacePhotoInputRef = useRef<HTMLInputElement>(null);

  // Selection overlay handle
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

  // Lightbox detail viewer state
  const [lightbox, setLightbox] = useState<{ url: string; title: string; subtitle: string } | null>(null);

  const handleAddMemberPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await fileToBase64(file);
        setNewMemberPhoto(base64);
        showToast("Pasfoto anggota berhasil dimuat!");
      } catch (err) {
        showToast("Gagal memproses pasfoto", "error");
      }
    }
  };

  const submitAddMember = () => {
    if (!newMemberName.trim()) {
      showToast("Harap masukkan nama lengkap anggota kelas", "error");
      return;
    }

    const newMemberObj = {
      id: "mem_" + Date.now(),
      name: newMemberName.trim().toUpperCase(),
      photo: newMemberPhoto || ""
    };

    updateClassData(subclassDisplay, {
      members: [...members, newMemberObj]
    });

    setNewMemberName("");
    setNewMemberPhoto("");
    setShowAddModal(false);
    showToast(`Anggota ${newMemberObj.name} berhasil ditambahkan! Klik SIMPAN jika sudah selesai.`);
  };

  const handleReplaceMemberPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedMemberId) return;
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await fileToBase64(file);
        updateClassData(subclassDisplay, {
          members: members.map(m => {
            if (m.id === selectedMemberId) {
              return { ...m, photo: base64 };
            }
            return m;
          })
        });
        showToast("Pasfoto anggota berhasil diganti!");
        setSelectedMemberId(null);
      } catch (err) {
        showToast("Gagal memperbarui pasfoto", "error");
      }
    }
  };

  const handleDeleteMember = (memberId: string, name: string) => {
    updateClassData(subclassDisplay, {
      members: members.filter(m => m.id !== memberId)
    });
    setSelectedMemberId(null);
    showToast(`Anggota kelas ${name} dihapus.`);
  };

  const handleMemberCardClick = (id: string, name: string, photo: string) => {
    if (!editMode) {
      // Guest view click: triggers high-contrast zoom lightbox!
      setLightbox({
        url: photo || SILHOUETTE_SVG,
        title: name,
        subtitle: "Anggota Kelas"
      });
      return;
    }
    setSelectedMemberId(selectedMemberId === id ? null : id);
  };

  return (
    <section id="members" className="py-20 px-6 bg-[#0E1015] border-t border-b border-white/5 shrink-0 scroll-mt-6 select-none">
      <div className="max-w-[1200px] mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center relative max-w-sm mx-auto">
          <h2 className="text-3xl font-extrabold text-white tracking-tight relative z-10 uppercase">
            ANGGOTA KELAS ({members.length})
          </h2>
          <div className="h-1.5 w-16 bg-[#FF7A00] mx-auto mt-3 rounded-full" />
        </div>

        {/* Members actions */}
        {editMode && (
          <div className="flex justify-end pr-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-full font-bold shadow flex items-center gap-1 cursor-pointer text-xs transform hover:scale-105 active:scale-95 transition-all"
              type="button"
            >
              <Plus size={14} />
              <span>TAMBAH ANGGOTA KELAS</span>
            </button>
          </div>
        )}

        {/* Member Grid layout list */}
        {members.length === 0 ? (
          <div className="text-center py-20 bg-[#14161E] rounded-2xl shadow-card border border-white/10 text-gray-400 font-semibold italic">
            Belum ada anggota yang terdaftar di kelas. Gunakan tombol Tambah Anggota di atas.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            <AnimatePresence mode="popLayout">
              {members.map((member, idx) => {
                const isSelected = selectedMemberId === member.id;
                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.25 }}
                    key={member.id}
                    onClick={() => handleMemberCardClick(member.id, member.name, member.photo)}
                    className={`bg-[#14161E] border border-white/5 rounded-2xl p-4 shadow-card flex flex-col items-center text-center gap-3 relative transition-all group ${
                      isSelected ? "ring-2 ring-[#FF7A00] bg-white/5" : "hover:-translate-y-1 hover:border-white/10"
                    }`}
                  >
                    {/* Portrait aspect ratio 3:4 avatar frame matching user reference photo */}
                    <div className="w-[105px] h-[140px] rounded-xl overflow-hidden border-2 border-white/10 bg-[#0E1015] relative shrink-0 aspect-[3/4]">
                      <img
                        src={member.photo || SILHOUETTE_SVG}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />

                      {/* Editing icon layer for individual card overlay */}
                      {editMode && (
                        <div className={`absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-2 transition-all ${
                          isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                        }`}>
                          <RefreshCw
                            size={14}
                            className="text-white hover:scale-125 cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedMemberId(member.id);
                              replacePhotoInputRef.current?.click();
                            }}
                            title="Ganti Foto"
                          />
                          <UserMinus
                            size={14}
                            className="text-red-400 hover:scale-125 cursor-pointer mt-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteMember(member.id, member.name);
                            }}
                            title="Hapus Anggota"
                          />
                        </div>
                      )}
                    </div>

                    {/* Member Name */}
                    <p className="font-extrabold text-xs text-gray-200 uppercase tracking-tight leading-4 line-clamp-2">
                      {member.name}
                    </p>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* Hidden replacement triggering handle */}
        <input
          type="file"
          ref={replacePhotoInputRef}
          onChange={handleReplaceMemberPhoto}
          accept="image/*"
          className="hidden"
        />

        {/* Modal: Tambah Anggota */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-[#0E1015] border border-white/10 text-white rounded-2xl w-full max-w-sm shadow-xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <h4 className="font-extrabold text-base text-white">Tambahkan Anggota Kelas</h4>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1 hover:bg-white/10 rounded-full text-gray-400"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Photo Upload area inside modal */}
              <div className="space-y-1 flex flex-col items-center">
                <span className="text-xs font-semibold text-gray-400 self-start">Foto Anggota (Opsional)</span>
                <div
                  onClick={() => addPhotoInputRef.current?.click()}
                  className="w-20 h-28 rounded-xl border-2 border-dashed border-[#FF7A00]/40 bg-[#14161E] hover:bg-[#1C1E26] cursor-pointer flex items-center justify-center overflow-hidden shrink-0"
                >
                  {newMemberPhoto ? (
                    <img src={newMemberPhoto} alt="Draft Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon size={18} className="text-[#FF7A00]" />
                  )}
                </div>
                <input
                  type="file"
                  ref={addPhotoInputRef}
                  onChange={handleAddMemberPhoto}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              {/* Full Name input area inside modal */}
              <div className="space-y-1">
                <span className="text-xs font-semibold text-gray-400 block">Nama Anggota Kelas</span>
                <input
                  type="text"
                  value={newMemberName}
                  onChange={e => setNewMemberName(e.target.value)}
                  placeholder="CONTOH: ADI WIGUNA"
                  className="w-full p-2.5 border border-white/10 bg-[#14161E] text-white focus:ring-1 focus:ring-[#FF7A00] focus:outline-none rounded-xl text-xs uppercase font-semibold"
                  autoFocus
                  onKeyDown={e => e.key === "Enter" && submitAddMember()}
                />
              </div>

              {/* Submitting commands */}
              <div className="flex gap-2 justify-end pt-2">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-white/10 rounded-full text-xs font-semibold text-gray-400 hover:bg-white/5 bg-[#14161E]"
                  type="button"
                >
                  BATAL
                </button>
                <button
                  onClick={submitAddMember}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-full text-xs font-bold shadow"
                  type="button"
                >
                  TAMBAH ANGGOTA
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FULLSCREEN LIGHTBOX FOR ROSTER MEMBERS */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex flex-col items-center justify-center p-4 cursor-zoom-out"
          >
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all cursor-pointer"
            >
              <X size={20} />
            </button>

            <motion.div
              initial={{ scale: 0.9, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 15 }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0E1015] border border-white/15 rounded-[1.5rem] p-4 max-w-sm w-full shadow-2xl space-y-4 text-center cursor-default"
            >
              {/* Premium 3:4 Lightbox frame */}
              <div className="aspect-[3/4] w-full rounded-xl overflow-hidden bg-[#14161E] border border-white/5 relative">
                <img
                  src={lightbox.url}
                  alt={lightbox.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Speaker signature info */}
              <div className="pb-2">
                <span className="text-[10px] font-black tracking-[0.2em] text-[#FF7A00] uppercase block mb-1">
                  {lightbox.subtitle}
                </span>
                <h4 className="text-lg font-black text-white uppercase tracking-tight leading-none">
                  {lightbox.title}
                </h4>
                <span className="text-[9px] text-gray-500 font-bold uppercase mt-1 block">
                  Keluarga Besar Angkatan 21
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

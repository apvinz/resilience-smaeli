import React, { useRef, useState } from "react";
import { useData } from "../../context/DataContext";
import { fileToBase64 } from "../../utils/imageUtils";
import { User, Camera, ShieldCheck, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { useAuth } from "../../context/AuthContext";

interface ClassStructureSectionProps {
  level: string;
  subclass: string;
}

// Beautiful inline Silhouette SVG for empty frame states (aligned with 3:4 passport aspect ratio)
const SILHOUETTE_SVG = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 75 100'><rect width='75' height='100' fill='%2314161E'/><circle cx='37.5' cy='38' r='18' fill='%23374151'/><path d='M12,82 C12,62 22,54 37.5,54 C53,54 63,62 63,82 Z' fill='%23374151'/></svg>";

export const ClassStructureSection: React.FC<ClassStructureSectionProps> = ({ level, subclass }) => {
  const { editMode: globalEditMode, classesData, updateClassData, showToast } = useData();
  const { canEditClass } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const subclassDisplay = subclass.includes(".") ? subclass : `${level}.${subclass.replace(level, "")}`;
  const editMode = globalEditMode && canEditClass(subclassDisplay);

  const currentClassData = classesData[subclassDisplay];
  const structure = currentClassData?.structure;

  // Selected item tracker
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [editingRoleName, setEditingRoleName] = useState<string | null>(null);
  const [tempName, setTempName] = useState("");

  // Lightbox detail viewer state
  const [lightbox, setLightbox] = useState<{ url: string; title: string; subtitle: string } | null>(null);

  const rolesList = [
    { key: "wali" as const, label: "Wali Kelas", size: 120 },
    { key: "ketua" as const, label: "Ketua Kelas", size: 100 },
    { key: "wakilKetua" as const, label: "Wakil Ketua Kelas", size: 100 },
    { key: "bendahara" as const, label: "Bendahara 1", size: 90 },
    { key: "wakilBendahara" as const, label: "Bendahara 2", size: 90 },
    { key: "sekretaris" as const, label: "Sekretaris 1", size: 90 },
    { key: "wakilSekretaris" as const, label: "Sekretaris 2", size: 90 }
  ];

  const handleItemClick = (roleKey: string, currentName: string) => {
    if (!editMode) {
      // Guest click opens a gorgeous zoom lightbox of the 3:4 photo
      const member = (structure as any)?.[roleKey] || { name: "", photo: "" };
      const roleLabel = rolesList.find(r => r.key === roleKey)?.label || "Pengurus Kelas";
      setLightbox({
        url: member.photo || SILHOUETTE_SVG,
        title: currentName || "Belum diisi",
        subtitle: roleLabel
      });
      return;
    }
    if (selectedRole === roleKey) {
      // Second single click opens name edit mode
      setEditingRoleName(roleKey);
      setTempName(currentName);
    } else {
      setSelectedRole(roleKey);
      setEditingRoleName(null);
    }
  };

  const handleImageDoubleClick = (roleKey: string) => {
    if (!editMode) return;
    setSelectedRole(roleKey);
    fileInputRef.current?.click();
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedRole || !structure) return;
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await fileToBase64(file);
        const updatedStructure = { ...structure };
        (updatedStructure as any)[selectedRole].photo = base64;

        updateClassData(subclassDisplay, {
          structure: updatedStructure
        });
        showToast("Foto personil diperbarui secara lokal! Tekan SIMPAN di navbar untuk menyimpan permanen.");
      } catch (err) {
        showToast("Gagal memproses unggahan foto", "error");
      }
    }
  };

  const saveRoleNameEdit = (roleKey: string) => {
    if (!structure) return;
    const updatedStructure = { ...structure };
    (updatedStructure as any)[roleKey].name = tempName;

    updateClassData(subclassDisplay, {
      structure: updatedStructure
    });
    setEditingRoleName(null);
    showToast("Nama pengurus telah disesuaikan!");
  };

  const renderMemberNode = (roleKey: "wali" | "ketua" | "wakilKetua" | "bendahara" | "wakilBendahara" | "sekretaris" | "wakilSekretaris", label: string, size: number) => {
    const member = structure?.[roleKey] || { name: "", photo: "" };
    const isSelected = selectedRole === roleKey;
    const isEditingName = editingRoleName === roleKey;

    // Height calculated exactly for premium 3:4 passport vertical frame layout
    const height = Math.round(size * 1.33);

    return (
      <div className="flex flex-col items-center select-none" key={roleKey}>
        {/* Frame container: Changed to 3:4 vertical rectangle matching uploaded photo */}
        <div
          onClick={() => handleItemClick(roleKey, member.name)}
          onDoubleClick={() => handleImageDoubleClick(roleKey)}
          style={{ width: size, height }}
          className={`rounded-[1.25rem] overflow-hidden border-4 bg-[#14161E] flex items-center justify-center relative cursor-pointer transition-all duration-300 ${
            isSelected
              ? "border-[#FF7A00] shadow-[0_0_20px_rgba(255,122,0,0.7)] scale-102"
              : "border-white/10 shadow-card hover:scale-[1.03] hover:border-white/20"
          }`}
          title={
            editMode
              ? isSelected
                ? "Click sekali lagi untuk ubah Nama, Double-click untuk ganti foto"
                : "Klik sekali untuk menyorot pengurus"
              : "Klik untuk melihat detail foto"
          }
        >
          <img
            src={member.photo || SILHOUETTE_SVG}
            alt={member.name || label}
            className="w-full h-full object-cover"
          />

          {editMode && (
            <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 flex flex-col justify-center items-center text-white p-1">
              <Camera size={18} className="text-[#FF7A00]" />
              <span className="text-[7.5px] font-black uppercase mt-1 tracking-wider text-center">DOUBLE CLICK GANTI FOTO</span>
            </div>
          )}
        </div>

        {/* Labels Block */}
        <div className="mt-3 text-center max-w-[150px]">
          <h5 className="font-extrabold text-[11px] text-[#FF7A00] uppercase tracking-wider">
            {label}
          </h5>

          {isEditingName ? (
            <div className="flex items-center gap-1 mt-1 justify-center">
              <input
                type="text"
                value={tempName}
                onChange={e => setTempName(e.target.value)}
                onBlur={() => saveRoleNameEdit(roleKey)}
                onKeyDown={e => {
                  if (e.key === "Enter") saveRoleNameEdit(roleKey);
                }}
                className="text-xs p-1 text-center border-b border-[#FF7A00] outline-none text-white bg-[#14161E] rounded flex-1"
                autoFocus
              />
              <button
                onClick={() => saveRoleNameEdit(roleKey)}
                className="p-1 bg-green-500 rounded text-white"
                type="button"
              >
                <Check size={10} />
              </button>
            </div>
          ) : (
            <p
              className={`font-semibold text-xs text-gray-200 tracking-tight leading-3 mt-1 uppercase ${
                editMode ? "underline decoration-dashed decoration-[#FF7A00] cursor-pointer" : ""
              }`}
            >
              {member.name || (editMode ? "MASUKKAN NAMA" : "Belum diisi")}
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <section id="structure" className="py-20 px-6 bg-[#07080A] border-b border-white/5 shrink-0 scroll-mt-10 select-none">
      <div className="max-w-[1200px] mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center relative max-w-sm mx-auto">
          <h2 className="text-3xl font-extrabold text-white tracking-tight relative z-10 uppercase">
            STRUKTUR KELAS {subclassDisplay}
          </h2>
          <div className="h-1.5 w-16 bg-[#FF7A00] mx-auto mt-3 rounded-full" />
        </div>

        {/* Dynamic Photo upload handles */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handlePhotoUpload}
          accept="image/*"
          className="hidden"
        />

        {/* Interactive hierarchy chart visualizer tree with clean, stable and flawless connect lines */}
        <div className="flex flex-col gap-12 max-w-4xl mx-auto items-center py-6 relative">
          
          {/* Row 1: Wali Kelas */}
          <div className="flex flex-col items-center relative z-20">
            {renderMemberNode("wali", "WALI KELAS", 120)}
            {/* vertical connector down from wali */}
            <div className="w-0.5 h-12 bg-gradient-to-b from-[#FF7A00]/40 to-[#FF7A00]/20 mt-4 hidden md:block" />
          </div>

          {/* Row 2: Ketua and Wakil Ketua - perfectly centered connector */}
          <div className="relative z-20 flex flex-col items-center w-full">
            {/* Horizontal bridge line spanning between Ketua and Wakil */}
            <div className="absolute top-0 left-[26%] right-[26%] h-0.5 bg-[#FF7A00]/20 hidden md:block" />
            
            <div className="grid grid-cols-2 gap-20 sm:gap-40 pt-6">
              <div className="flex flex-col items-center relative">
                {/* Vertical hook down to Ketua */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-[#FF7A00]/20 hidden md:block" />
                {renderMemberNode("ketua", "KETUA KELAS", 100)}
                {/* Vertical hook down towards row 3 */}
                <div className="w-0.5 h-12 bg-[#FF7A00]/20 mt-4 hidden md:block" />
              </div>
              <div className="flex flex-col items-center relative">
                {/* Vertical hook down to Wakil Ketua */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-[#FF7A00]/20 hidden md:block" />
                {renderMemberNode("wakilKetua", "WAKIL KETUA", 100)}
                {/* Vertical hook down towards row 3 */}
                <div className="w-0.5 h-12 bg-[#FF7A00]/20 mt-4 hidden md:block" />
              </div>
            </div>
          </div>

          {/* Row 3: Treasurer & Secretary line - perfectly mapped relative connectors */}
          <div className="relative z-20 flex flex-col items-center w-full">
            {/* Horizontal bridge line spanning columns */}
            <div className="absolute top-0 left-[14%] right-[14%] h-0.5 bg-[#FF7A00]/20 hidden md:block" />
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-14 pt-6">
              <div className="flex flex-col items-center relative">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-[#FF7A00]/20 hidden md:block" />
                {renderMemberNode("bendahara", "BENDAHARA 1", 90)}
              </div>
              <div className="flex flex-col items-center relative">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-[#FF7A00]/20 hidden md:block" />
                {renderMemberNode("wakilBendahara", "BENDAHARA 2", 90)}
              </div>
              <div className="flex flex-col items-center relative">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-[#FF7A00]/20 hidden md:block" />
                {renderMemberNode("sekretaris", "SEKRETARIS 1", 90)}
              </div>
              <div className="flex flex-col items-center relative">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-[#FF7A00]/20 hidden md:block" />
                {renderMemberNode("wakilSekretaris", "SEKRETARIS 2", 90)}
              </div>
            </div>
          </div>
        </div>

        {/* Context Hint */}
        {editMode ? (
          <p className="text-center text-[10px] text-gray-500 font-semibold uppercase">
            CMS MODE: Klik sekali untuk menyorot pengurus. Klik sekali lagi untuk edit nama, klik ganda di foto untuk mengganti foto.
          </p>
        ) : (
          <p className="text-center text-[10px] text-gray-500 font-semibold uppercase">
            Klik foto administrator kelas untuk detail tampilan pasfoto.
          </p>
        )}
      </div>

      {/* GORGEOUS DESIGNED LIGHTBOX MODAL */}
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

              {/* Title & metadata info */}
              <div className="pb-2">
                <span className="text-[10px] font-black tracking-[0.2em] text-[#FF7A00] uppercase block mb-1">
                  {lightbox.subtitle}
                </span>
                <h4 className="text-lg font-black text-white uppercase tracking-tight leading-none">
                  {lightbox.title}
                </h4>
                <span className="text-[9px] text-gray-500 font-bold uppercase mt-1 block">
                  ANGKATAN 21 {subclassDisplay}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};


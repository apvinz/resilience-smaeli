import React, { useRef, useState } from "react";
import { useData } from "../../context/DataContext";
import { fileToBase64 } from "../../utils/imageUtils";
import { Plus, Trash2, RefreshCw, Image as ImageIcon, Camera } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { useAuth } from "../../context/AuthContext";

export const DocumentationSection: React.FC = () => {
  const { editMode: globalEditMode, generationDocs, setGenerationDocs, showToast } = useData();
  const { canEditMainSettings } = useAuth();
  const editMode = globalEditMode && canEditMainSettings();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);

  // Keep track of which photo is currently selected for editing/deletion
  const [selectedPhotoId, setSelectedPhotoId] = useState<string | null>(null);

  const handleAddPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await fileToBase64(file);
        const newPhoto = {
          id: "photo_" + Date.now(),
          url: base64
        };
        setGenerationDocs([...generationDocs, newPhoto]);
        showToast("Foto dokumentasi ditambahkan! Klik SIMPAN jika sudah selesai.");
        if (fileInputRef.current) fileInputRef.current.value = "";
      } catch (err) {
        showToast("Gagal mengunggah foto dokumentasi", "error");
      }
    }
  };

  const handleReplacePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedPhotoId) return;
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await fileToBase64(file);
        setGenerationDocs(generationDocs.map(photo => {
          if (photo.id === selectedPhotoId) {
            return { ...photo, url: base64 };
          }
          return photo;
        }));
        showToast("Foto dokumentasi berhasil diganti!");
        setSelectedPhotoId(null);
        if (replaceInputRef.current) replaceInputRef.current.value = "";
      } catch (err) {
        showToast("Gagal mengganti foto", "error");
      }
    }
  };

  const handleDeletePhoto = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setGenerationDocs(generationDocs.filter(photo => photo.id !== id));
    showToast("Foto dokumentasi dihapus!");
    setSelectedPhotoId(null);
  };

  return (
    <section id="documentation" className="py-20 px-6 bg-[#0E1015] border-b border-white/5 select-none">
      <div className="max-w-[1200px] mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center relative max-w-sm mx-auto">
          <h2 className="text-3xl font-extrabold text-white tracking-tight relative z-10 uppercase">
            DOKUMENTASI ANGKATAN
          </h2>
          <div className="h-1.5 w-16 bg-[#FF7A00] mx-auto mt-3 rounded-full" />
        </div>

        {/* Guest fallback for empty states */}
        {generationDocs.length === 0 ? (
          <div className="text-center py-20 bg-[#14161E] rounded-2xl shadow-card border border-white/10 space-y-3">
            <div className="p-4 bg-white/5 rounded-full inline-block text-gray-400">
              <Camera size={40} strokeWidth={1.5} />
            </div>
            <p className="text-gray-300 font-semibold">Belum ada foto yang ditambahkan</p>
            {editMode && (
              <p className="text-xs text-gray-500">Silakan gunakan tombol tambah di bawah untuk mengunggah.</p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {generationDocs.map((photo, idx) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  key={photo.id}
                  onClick={() => {
                    if (editMode) {
                      setSelectedPhotoId(selectedPhotoId === photo.id ? null : photo.id);
                    }
                  }}
                  className={`relative aspect-[16/9] rounded-2xl overflow-hidden bg-white/5 shadow-card cursor-pointer group hover:shadow-hover-glow transition-all ${
                    selectedPhotoId === photo.id ? "ring-4 ring-[#FF7A00]" : ""
                  }`}
                >
                  <img
                    src={photo.url}
                    alt="Dokumentasi Angkatan"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Actions Overlay for Admin */}
                  {editMode && (
                    <div className={`absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-3 transition-opacity duration-200 ${
                      selectedPhotoId === photo.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    }`}>
                      <span className="text-[10px] font-bold tracking-wider text-gray-300 uppercase">AKSI DOKUMENTASI</span>
                      <div className="flex gap-2">
                        {/* Replace image button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPhotoId(photo.id);
                            replaceInputRef.current?.click();
                          }}
                          className="p-2 bg-[#FF7A00] text-white rounded-full hover:bg-[#E06600] transition-all transform hover:scale-110 shadow"
                          title="Ganti Foto"
                        >
                          <RefreshCw size={14} />
                        </button>

                        {/* Delete image button */}
                        <button
                          type="button"
                          onClick={(e) => handleDeletePhoto(photo.id, e)}
                          className="p-2 bg-[#EF4444] text-white rounded-full hover:bg-red-600 transition-all transform hover:scale-110 shadow"
                          title="Hapus Foto"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Hidden File Upload input for replacing */}
        <input
          type="file"
          ref={replaceInputRef}
          onChange={handleReplacePhoto}
          accept="image/*"
          className="hidden"
        />

        {/* Add photo controls shown for administrators in CMS Mode */}
        {editMode && (
          <div className="flex justify-center pt-4">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-3 bg-[#FF7A00] hover:bg-[#E06600] text-white font-bold rounded-full shadow-lg flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer text-sm"
              type="button"
            >
              <Plus size={18} />
              <span>UNGGAH DOKUMENTASI BARU</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAddPhoto}
              accept="image/*"
              className="hidden"
            />
          </div>
        )}
      </div>
    </section>
  );
};

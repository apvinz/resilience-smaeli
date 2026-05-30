import React, { useRef } from "react";
import { useData } from "../../context/DataContext";
import { fileToBase64 } from "../../utils/imageUtils";
import { Image } from "lucide-react";

interface EditableBackgroundProps {
  bgImage: string;
  onBgChange: (base64: string) => void;
  children: React.ReactNode;
  overlayClassName?: string;
  className?: string;
  editMode?: boolean;
}

export const EditableBackground: React.FC<EditableBackgroundProps> = ({
  bgImage,
  onBgChange,
  children,
  overlayClassName = "bg-black/55",
  className = "",
  editMode: editModeProp
}) => {
  const { editMode: contextEditMode, showToast } = useData();
  const editMode = editModeProp !== undefined ? editModeProp : contextEditMode;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await fileToBase64(file);
        onBgChange(base64);
        showToast("Background diperbarui! Klik SIMPAN di navbar untuk menyimpan permanen.");
      } catch (err) {
        showToast("Gagal memproses gambar latar belakang", "error");
      }
    }
  };

  return (
    <div
      className={`relative w-full overflow-hidden ${className}`}
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      {/* Background Dark Overlay for text readability */}
      <div className={`absolute inset-0 ${overlayClassName} z-0 transition-all`} />

      {/* Admin Ganti Background controls */}
      {editMode && (
        <div className="absolute top-20 right-6 z-30 select-none">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#FF7A00] hover:bg-[#E06600] text-white text-xs font-semibold rounded-full shadow-lg border border-white/20 transition-all transform hover:scale-105"
            type="button"
          >
            <Image size={14} />
            <span>GANTI BACKGROUND</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
        </div>
      )}

      {/* Render internal section content */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
};

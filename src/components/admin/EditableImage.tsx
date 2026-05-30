import React, { useRef } from "react";
import { useData } from "../../context/DataContext";
import { fileToBase64 } from "../../utils/imageUtils";

interface EditableImageProps {
  src: string;
  alt: string;
  onChange: (newBase64: string) => void;
  className?: string;
  containerClassName?: string;
  editMode?: boolean;
}

export const EditableImage: React.FC<EditableImageProps> = ({
  src,
  alt,
  onChange,
  className = "w-full h-full object-cover",
  containerClassName = "relative",
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
        onChange(base64);
        showToast("Gambar diperbarui! Klik SIMPAN di navbar untuk menyimpan perubahan.");
      } catch (err) {
        showToast("Gagal memproses gambar baru", "error");
      }
    }
  };

  return (
    <div
      className={`${containerClassName} group`}
      onDoubleClick={() => editMode && fileInputRef.current?.click()}
      title={editMode ? "Double-click untuk mengganti gambar ini" : undefined}
    >
      <img
        src={src || "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=600&auto=format&fit=crop"}
        alt={alt}
        className={`${className} ${
          editMode ? "border-2 border-dashed border-[#FF7A00] cursor-pointer hover:brightness-90 hover:scale-[1.02]" : ""
        } transition-all duration-200`}
      />
      {editMode && (
        <div className="absolute inset-x-0 bottom-0 bg-black/60 py-1 text-center text-[10px] text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-b-xl">
          DOUBLE CLICK TO EDIT
        </div>
      )}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
};

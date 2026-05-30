import React, { useRef } from "react";
import { useData } from "../../context/DataContext";
import { EditableBackground } from "../admin/EditableBackground";
import { EditableText } from "../admin/EditableText";
import { ChevronDown, Instagram, Image as ImageIcon } from "lucide-react";
import { motion } from "motion/react";
import { fileToBase64 } from "../../utils/imageUtils";

import { useAuth } from "../../context/AuthContext";

export const HeroSection: React.FC = () => {
  const {
    editMode: globalEditMode,
    generationBg,
    setGenerationBg,
    generationPortrait,
    setGenerationPortrait,
    generationHero,
    setGenerationHero,
    showToast
  } = useData();

  const { canEditMainSettings } = useAuth();
  const editMode = globalEditMode && canEditMainSettings();

  const portraitInputRef = useRef<HTMLInputElement>(null);

  const handleHeroTextChange = (field: "title" | "subtitle" | "info", value: string) => {
    setGenerationHero({
      ...generationHero,
      [field]: value
    });
  };

  const handlePortraitUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await fileToBase64(file);
        setGenerationPortrait(base64);
        showToast("Foto portrait berhasil diperbarui! Klik SIMPAN di navbar untuk menyimpan permanen.");
      } catch (err) {
        showToast("Gagal memproses foto", "error");
      }
    }
  };

  const handleScrollDown = () => {
    const el = document.getElementById("documentation");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <EditableBackground
      bgImage={generationBg}
      onBgChange={setGenerationBg}
      className="min-h-screen pt-20 flex items-center bg-[#07080A]"
      overlayClassName="bg-black/55 md:bg-gradient-to-r md:from-black/75 md:to-black/45"
      editMode={editMode}
    >
      <div className="max-w-[900px] mx-auto w-full px-6 pt-16 pb-28 md:pb-32 relative z-10 flex flex-col justify-center items-center text-center space-y-7">
        
        {/* Centered Hero Content: Text & Social Action Panels */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col justify-center items-center space-y-6 text-center w-full"
        >
          {/* Subtitle / Greeter */}
          <div className="flex flex-col items-center space-y-1 bg-[#0E1015]/60 hover:bg-[#0E1015] border border-white/5 hover:border-[#FF7A00]/20 transition-all px-4 py-1.5 rounded-full shadow-inner">
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#A0AEC0] uppercase block select-none">
              Website Resmi
            </span>
            <EditableText
              value={generationHero.subtitle}
              onChange={(val) => handleHeroTextChange("subtitle", val)}
              as="span"
              className="text-[#FF7A00] text-xs font-black tracking-widest block cursor-pointer uppercase hover:text-[#FFA040] transition-colors text-center"
              editMode={editMode}
            />
          </div>

          {/* Master Title Header with Premium Typographic Contrast */}
          <div className="space-y-2 w-full flex justify-center">
            <div className="text-3xl sm:text-4xl md:text-5xl lg:text-[2.75rem] font-black text-white tracking-tight leading-[1.15] block max-w-2xl text-center">
              <EditableText
                value={generationHero.title}
                onChange={(val) => handleHeroTextChange("title", val)}
                as="span"
                multiline={true}
                className="block cursor-pointer border-b border-transparent hover:border-white/20 transition-all font-sans text-center"
                editMode={editMode}
              />
            </div>
          </div>

          {/* Slogan Description / Info Box */}
          <div className="max-w-xl mx-auto flex justify-center">
            <EditableText
              value={generationHero.info}
              onChange={(val) => handleHeroTextChange("info", val)}
              as="p"
              multiline={true}
              className="text-[#A0AEC0] text-xs sm:text-sm md:text-base leading-relaxed font-normal block cursor-pointer border-b border-transparent hover:border-[#FF7A00]/20 transition-all text-center"
              editMode={editMode}
            />
          </div>

          {/* Static Social Media Media Accounts: Instagram only as requested */}
          <div className="flex flex-col items-center justify-center gap-2 pt-2">
            <span className="text-[9px] font-black tracking-[0.25em] text-gray-500 uppercase">
              FOLLOW OUR INSTAGRAM
            </span>
            <a
              href="https://www.instagram.com/re21lience.smaeli/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-white/10 text-white hover:text-white hover:border-[#FF7A00] bg-white/5 hover:bg-white/15 transition-all transform hover:scale-105 shadow-lg group"
              title="Instagram @re21lience.smaeli"
              id="social-ig"
            >
              <Instagram size={16} className="text-[#FF7A00] group-hover:animate-pulse" />
              <span className="text-xs font-black tracking-wider uppercase">@re21lience.smaeli</span>
            </a>
          </div>
        </motion.div>
      </div>

      {/* Center aligned subtle scroll indicator button */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center select-none">
        <button
          onClick={handleScrollDown}
          className="cursor-pointer text-white/40 hover:text-white/80 transition-colors flex flex-col items-center gap-1 focus:outline-none"
          type="button"
        >
          <span className="text-[9px] tracking-widest font-extrabold uppercase">LEBIH LANJUT</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          >
            <ChevronDown size={18} className="text-[#FF7A00]" />
          </motion.div>
        </button>
      </div>
    </EditableBackground>
  );
};

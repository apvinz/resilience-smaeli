import React from "react";
import { useData } from "../../context/DataContext";
import { useAuth } from "../../context/AuthContext";
import { EditableBackground } from "../admin/EditableBackground";
import { EditableText } from "../admin/EditableText";
import { ChevronDown, Instagram } from "lucide-react";
import { motion } from "motion/react";

interface ClassHeroSectionProps {
  level: string;
  subclass: string;
}

const CLASS_INSTAGRAM_HANDLES: Record<string, string> = {
  "X.1": "rivastra.smaeli",
  "X.2": "rea2tra.smaeli",
  "X.3": "rav3lyn.smaeli",
  "X.4": "rastavor4.smaeli",
};

export const ClassHeroSection: React.FC<ClassHeroSectionProps> = ({ level, subclass }) => {
  const { editMode: globalEditMode, classBgs, setClassBg, classesData, updateClassData } = useData();
  const { canEditClass } = useAuth();

  // Wait, let's normalize the dynamic access code exactly
  const subclassDisplay = subclass.includes(".") ? subclass : `${level}.${subclass.replace(level, "")}`;
  const editMode = globalEditMode && canEditClass(subclassDisplay);

  const currentClassData = classesData[subclassDisplay];
  const bgImage = classBgs[subclassDisplay] || "https://images.unsplash.com/photo-1498243691581-b145c3f54a5c?q=80&w=1600&auto=format&fit=crop";

  const handleTextChange = (field: "tagline" | "slogan", val: string) => {
    updateClassData(subclassDisplay, {
      [field]: val
    });
  };

  const handleScrollDown = () => {
    const el = document.getElementById("structure");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const instagramHandle = CLASS_INSTAGRAM_HANDLES[subclassDisplay] || CLASS_INSTAGRAM_HANDLES[`${level}.${subclass}`];

  return (
    <EditableBackground
      bgImage={bgImage}
      onBgChange={(base64) => setClassBg(subclassDisplay, base64)}
      className="h-[100vh]"
      editMode={editMode}
    >
      <div className="h-full max-w-[1000px] mx-auto px-6 pt-20 flex flex-col justify-center items-center text-center text-white relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-6 select-text"
        >
          {/* Welcome Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight uppercase">
            WELCOME TO CLASS {subclassDisplay}
          </h1>

          {/* Tagline/Codename */}
          <div>
            <EditableText
              value={currentClassData?.tagline || `(${subclassDisplay.replace(/\./g, "")}FORCE)`}
              onChange={(val) => handleTextChange("tagline", val)}
              as="h2"
              className="text-[#FF7A00] text-2xl font-black tracking-widest block uppercase hover:text-[#FFA040] transition-colors"
              editMode={editMode}
            />
          </div>

          {/* Slogan */}
          <div className="max-w-xl mx-auto border-t border-white/20 pt-6">
            <EditableText
              value={currentClassData?.slogan || "Sinergi bersama mengukir prestasi hebat."}
              onChange={(val) => handleTextChange("slogan", val)}
              as="p"
              multiline={true}
              className="text-gray-300 text-sm sm:text-base leading-relaxed font-semibold block"
              editMode={editMode}
            />
          </div>

          {/* Dynamic Instagram Link */}
          {instagramHandle && (
            <div className="pt-3 flex justify-center">
              <a
                href={`https://www.instagram.com/${instagramHandle}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4.5 py-2.5 bg-[#0E1015]/80 hover:bg-[#14161E] border border-white/10 hover:border-[#FF7A00] rounded-full text-xs text-white tracking-wider font-extrabold transition-all transform hover:scale-105 shadow-md group select-none"
              >
                <Instagram size={14} className="text-[#FF7A00] group-hover:animate-pulse" />
                <span>@{instagramHandle}</span>
              </a>
            </div>
          )}
        </motion.div>

        {/* Scroll helper down */}
        <button
          onClick={handleScrollDown}
          className="absolute bottom-8 cursor-pointer text-white/70 hover:text-white transition-colors flex flex-col items-center gap-1.5 focus:outline-none"
          type="button"
        >
          <span className="text-[10px] tracking-widest font-semibold uppercase">STRUKTUR KELAS</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          >
            <ChevronDown size={22} className="text-[#FF7A00]" />
          </motion.div>
        </button>
      </div>
    </EditableBackground>
  );
};

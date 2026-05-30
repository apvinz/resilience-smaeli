import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useData } from "../context/DataContext";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
import { ClassHeroSection } from "../components/class/ClassHeroSection";
import { ClassDocumentationSection } from "../components/class/ClassDocumentationSection";
import { ClassStructureSection } from "../components/class/ClassStructureSection";
import { ClassMembersSection } from "../components/class/ClassMembersSection";
import { CheckCircle, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export const ClassPage: React.FC = () => {
  const { level, subclass } = useParams<{ level: string; subclass: string }>();
  const navigate = useNavigate();
  const { classesData, toast, showToast } = useData();

  // Validate route parameters and restore scroll position to top
  useEffect(() => {
    if (!level || !subclass) {
      navigate("/generation");
    } else {
      window.scrollTo(0, 0);
    }
  }, [level, subclass, navigate]);

  if (!level || !subclass) return null;

  // Re-inject dot format e.g. "X1" -> "X.1", "XI3" -> "XI.3"
  let subclassDisplay = subclass;
  if (!subclassDisplay.includes(".")) {
    subclassDisplay = subclassDisplay.replace(/^([A-Z]+)(\d+)$/i, "$1.$2");
  }

  // Fallback check: if the class has no loaded schema, we default gracefully in DataContext
  const currentClassData = classesData[subclassDisplay];

  return (
    <div className="min-h-screen flex flex-col bg-[#07080A]">
      {/* Navbar with current subclass tracker specified */}
      <Navbar currentClassSubclass={subclassDisplay} />

      <main className="flex-1 pt-0">
        {/* Class Section 1: Hero view with custom backgrounds and slogans */}
        <ClassHeroSection level={level} subclass={subclassDisplay} />

        {/* Class Section 1.5: Class Documentation photos gallery */}
        <ClassDocumentationSection level={level} subclass={subclassDisplay} />

        {/* Class Section 2: Interactive top-down Leadership tree */}
        <ClassStructureSection level={level} subclass={subclassDisplay} />

        {/* Class Section 3: Profile cards grid of members lists */}
        <ClassMembersSection level={level} subclass={subclassDisplay} />
      </main>

      {/* Corporate dark footer */}
      <Footer />

      {/* Toast Notification HUD */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, x: 100, y: -20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 120, y: 0 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className={`fixed top-20 right-6 z-50 p-4 max-w-sm rounded-xl shadow-xl border flex items-center gap-3 select-none ${
              toast.type === "success"
                ? "bg-white border-green-200 text-green-900"
                : "bg-white border-red-200 text-red-900"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle size={20} className="text-[#10B981] shrink-0" />
            ) : (
              <AlertTriangle size={20} className="text-[#EF4444] shrink-0" />
            )}
            <div className="flex-1">
              <p className="text-xs font-bold uppercase text-gray-400">Notifikasi</p>
              <p className="text-xs font-semibold text-gray-800 leading-normal">{toast.message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

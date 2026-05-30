import React, { useEffect } from "react";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
import { HeroSection } from "../components/generation/HeroSection";
import { DocumentationSection } from "../components/generation/DocumentationSection";
import { ClassesSection } from "../components/generation/ClassesSection";
import { AchievementsSection } from "../components/generation/AchievementsSection";
import { useData } from "../context/DataContext";
import { Info, CheckCircle, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export const GenerationPage: React.FC = () => {
  const { toast, hideToast } = useData();

  // Restore scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#07080A]">
      {/* Navbar fixed top */}
      <Navbar />

      {/* Main scrolling sections wrapper */}
      <main className="flex-1 pt-0">
        {/* Section 1: Hero */}
        <section id="hero" className="w-full h-[100vh]">
          <HeroSection />
        </section>

        {/* Section 2: Documentation */}
        <DocumentationSection />

        {/* Section 3: Classes dropdown hierarchy */}
        <ClassesSection />

        {/* Section 4: Cumulative global achievements list & leaderboard */}
        <AchievementsSection />
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

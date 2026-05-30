import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { defaultData, ClassData, Achievement } from "../data/defaultData";
import { getItem, setItem, cleanSubclassCode } from "../utils/storage";
import { useAuth } from "./AuthContext";
import {
  fetchGlobalConfig,
  saveGlobalConfig,
  fetchClassConfig,
  saveClassConfig,
  subscribeGlobalConfig,
  subscribeClassConfig,
  GlobalConfig,
  ClassConfig,
} from "../services/firebaseService";

export interface ToastState {
  show: boolean;
  message: string;
  type: "success" | "error";
}

export interface DataContextType {
  editMode: boolean;
  setEditMode: (val: boolean) => void;
  logoSekolah: string;
  setLogoSekolah: (val: string) => void;
  logoAngkatan: string;
  setLogoAngkatan: (val: string) => void;
  generationBg: string;
  setGenerationBg: (val: string) => void;
  generationPortrait: string;
  setGenerationPortrait: (val: string) => void;
  generationHero: { title: string; subtitle: string; info: string; leaderboardTitle?: string; leaderboardSubtitle?: string };
  setGenerationHero: (val: { title: string; subtitle: string; info: string; leaderboardTitle?: string; leaderboardSubtitle?: string }) => void;
  generationDocs: { id: string; url: string; caption?: string }[];
  setGenerationDocs: (val: { id: string; url: string; caption?: string }[]) => void;
  generationAchievements: Achievement[];
  setGenerationAchievements: (val: Achievement[]) => void;
  classLogos: Record<string, string>;
  setClassLogo: (subclass: string, base64: string) => void;
  classBgs: Record<string, string>;
  setClassBg: (subclass: string, base64: string) => void;
  classesData: Record<string, ClassData>;
  updateClassData: (subclass: string, data: Partial<ClassData>) => void;
  saveChanges: () => void;
  discardChanges: () => void;
  toast: ToastState;
  showToast: (msg: string, type?: "success" | "error") => void;
  hideToast: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const DEFAULT_LOGO_SEKOLAH = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='48' fill='%232B7FFF'/><polygon points='50,18 78,35 78,65 50,82 22,65 22,35' fill='%23FFFFFF' opacity='0.2'/><path d='M50,25 L72,38 L72,62 L50,75 L28,62 L28,38 Z' fill='none' stroke='%23FFFFFF' stroke-width='4'/><path d='M50,32 L66,42 L58,58 L42,58 L34,42 Z' fill='%23F5A623'/><circle cx='50' cy='48' r='5' fill='%23FFFFFF'/></svg>";
const DEFAULT_LOGO_ANGKATAN = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='48' fill='%231A202C'/><circle cx='50' cy='50' r='43' fill='none' stroke='%23F5A623' stroke-width='2'/><text x='50' y='58' font-family='Plus Jakarta Sans, sans-serif' font-weight='800' font-size='22' fill='%23FFFFFF' text-anchor='middle'>R21</text><path d='M30,70 Q50,60 70,70' stroke='%232B7FFF' stroke-width='3' fill='none'/></svg>";
const DEFAULT_LOGO_CLASS = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='50' fill='%23EEF2F8'/><text x='50' y='58' font-family='sans-serif' font-weight='bold' font-size='24' fill='%232B7FFF' text-anchor='middle'>CLS</text></svg>";

function getAllSubclasses(): string[] {
  const all: string[] = [];
  Object.values(defaultData.classes).forEach((obj) => {
    all.push(...obj.subclasses);
  });
  return all;
}

function buildDefaultClassData(subclass: string): ClassData {
  if ((defaultData.classDataDefaults as any)[subclass]) {
    return { ...(defaultData.classDataDefaults as any)[subclass] };
  }
  const isAvailable = !subclass.startsWith("XI.") && !subclass.startsWith("XII.");
  return {
    tagline: subclass === "X.1" ? "(R1VASTRA)" : `(${subclass.replace(".", "")}FORCE)`,
    slogan: `Selamat datang di ruang belajar ${subclass}. Menjunjung tinggi kebersamaan, sinergi, dan prestasi hebat.`,
    isAvailable,
    structure: {
      wali: { name: "Wali Kelas", photo: "" },
      ketua: { name: "Ketua Kelas", photo: "" },
      wakilKetua: { name: "Wakil Ketua", photo: "" },
      bendahara: { name: "Bendahara", photo: "" },
      wakilBendahara: { name: "Wakil Bendahara", photo: "" },
      sekretaris: { name: "Sekretaris", photo: "" },
      wakilSekretaris: { name: "Wakil Sekretaris", photo: "" },
    },
    members: [
      { id: "1", name: "Siswa 1", photo: "" },
      { id: "2", name: "Siswa 2", photo: "" },
      { id: "3", name: "Siswa 3", photo: "" },
    ],
    achievements: [],
  };
}

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdmin } = useAuth();
  const [editModeState, setEditModeState] = useState(false);
  const editMode = editModeState && isAdmin;

  const setEditMode = (val: boolean) => {
    if (val && !isAdmin) { setEditModeState(false); return; }
    setEditModeState(val);
  };

  useEffect(() => {
    if (!isAdmin) setEditModeState(false);
  }, [isAdmin]);

  // ── State ──────────────────────────────────────────────────────────────────
  const [logoSekolah, setLogoSekolahState] = useState("");
  const [logoAngkatan, setLogoAngkatanState] = useState("");
  const [generationBg, setGenerationBgState] = useState("");
  const [generationPortrait, setGenerationPortraitState] = useState("");
  const [generationHero, setGenerationHeroState] = useState<{ title: string; subtitle: string; info: string; leaderboardTitle?: string; leaderboardSubtitle?: string }>({ title: "", subtitle: "", info: "" });
  const [generationDocs, setGenerationDocsState] = useState<{ id: string; url: string; caption?: string }[]>([]);
  const [generationAchievements, setGenerationAchievementsState] = useState<Achievement[]>([]);
  const [classLogos, setClassLogosState] = useState<Record<string, string>>({});
  const [classBgs, setClassBgsState] = useState<Record<string, string>>({});
  const [classesData, setClassesDataState] = useState<Record<string, ClassData>>({});
  const [toast, setToast] = useState<ToastState>({ show: false, message: "", type: "success" });

  // Track unsubscribe functions
  const unsubscribesRef = useRef<Array<() => void>>([]);

  const showToast = (message: string, type: "success" | "error" = "success") => setToast({ show: true, message, type });
  const hideToast = () => setToast((prev) => ({ ...prev, show: false }));

  useEffect(() => {
    if (toast.show) {
      const t = setTimeout(hideToast, 3000);
      return () => clearTimeout(t);
    }
  }, [toast.show]);

  // ── Apply global config to state ──────────────────────────────────────────
  const applyGlobalConfig = (cfg: GlobalConfig) => {
    setLogoSekolahState(cfg.logoSekolah || DEFAULT_LOGO_SEKOLAH);
    setLogoAngkatanState(cfg.logoAngkatan || DEFAULT_LOGO_ANGKATAN);
    setGenerationBgState(cfg.generationBg || "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1600&auto=format&fit=crop");
    setGenerationPortraitState(cfg.generationPortrait || "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800&auto=format&fit=crop");
    setGenerationHeroState(cfg.generationHero || { title: defaultData.generationHero.title, subtitle: defaultData.generationHero.subtitle, info: defaultData.generationHero.info });
    setGenerationDocsState(cfg.generationDocs || defaultData.documentation.photos);
    setGenerationAchievementsState(cfg.generationAchievements || defaultData.generationAchievements);
  };

  // ── Apply class config to state ───────────────────────────────────────────
  const applyClassConfig = (subclass: string, cfg: ClassConfig) => {
    if (cfg.logo) {
      setClassLogosState((prev) => ({ ...prev, [subclass]: cfg.logo! }));
    }
    if (cfg.bg) {
      setClassBgsState((prev) => ({ ...prev, [subclass]: cfg.bg! }));
    }
    const { logo: _l, bg: _b, ...classData } = cfg;
    setClassesDataState((prev) => ({ ...prev, [subclass]: classData }));
  };

  // ── Load from localStorage fallback ──────────────────────────────────────
  const loadLocalFallback = () => {
    setLogoSekolahState(getItem("logo_sekolah") || DEFAULT_LOGO_SEKOLAH);
    setLogoAngkatanState(getItem("logo_angkatan") || DEFAULT_LOGO_ANGKATAN);
    setGenerationBgState(getItem("bg_generation_hero") || "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1600&auto=format&fit=crop");
    setGenerationPortraitState(getItem("generation_portrait") || "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800&auto=format&fit=crop");
    setGenerationHeroState(getItem("generation_hero_text") || { title: defaultData.generationHero.title, subtitle: defaultData.generationHero.subtitle, info: defaultData.generationHero.info });
    setGenerationDocsState(getItem("generation_docs") || defaultData.documentation.photos);
    setGenerationAchievementsState(getItem("generation_achievements") || defaultData.generationAchievements);

    const allSubclasses = getAllSubclasses();
    const tempLogos: Record<string, string> = {};
    const tempBgs: Record<string, string> = {};
    const tempClassData: Record<string, ClassData> = {};

    allSubclasses.forEach((subclass) => {
      const stripped = cleanSubclassCode(subclass);
      tempLogos[subclass] = getItem(`logo_class_${stripped}`) || DEFAULT_LOGO_CLASS;
      tempBgs[subclass] = getItem(`bg_class_${stripped}_hero`) || "https://images.unsplash.com/photo-1498243691581-b145c3f54a5c?q=80&w=1600&auto=format&fit=crop";
      tempClassData[subclass] = getItem(`class_data_${stripped}`) || buildDefaultClassData(subclass);
    });

    setClassLogosState(tempLogos);
    setClassBgsState(tempBgs);
    setClassesDataState(tempClassData);
  };

  // ── Initialize: load from Firestore, subscribe to live updates ───────────
  useEffect(() => {
    // Clean up previous subscriptions
    unsubscribesRef.current.forEach((unsub) => unsub());
    unsubscribesRef.current = [];

    const allSubclasses = getAllSubclasses();

    // Set defaults immediately so page isn't blank
    loadLocalFallback();

    // Load global config from Firestore, then subscribe
    fetchGlobalConfig()
      .then((cfg) => {
        if (cfg) applyGlobalConfig(cfg);
      })
      .catch(() => {
        // Firestore not configured yet — localStorage fallback already applied
      });

    const unsubGlobal = subscribeGlobalConfig(applyGlobalConfig);
    unsubscribesRef.current.push(unsubGlobal);

    // Load + subscribe each class
    allSubclasses.forEach((subclass) => {
      fetchClassConfig(subclass)
        .then((cfg) => {
          if (cfg) applyClassConfig(subclass, cfg);
        })
        .catch(() => {});

      const unsubClass = subscribeClassConfig(subclass, (cfg) =>
        applyClassConfig(subclass, cfg)
      );
      unsubscribesRef.current.push(unsubClass);
    });

    return () => {
      unsubscribesRef.current.forEach((unsub) => unsub());
    };
  }, []);

  // ── Setters ───────────────────────────────────────────────────────────────
  const setLogoSekolah = (val: string) => setLogoSekolahState(val);
  const setLogoAngkatan = (val: string) => setLogoAngkatanState(val);
  const setGenerationBg = (val: string) => setGenerationBgState(val);
  const setGenerationPortrait = (val: string) => setGenerationPortraitState(val);
  const setGenerationHero = (val: { title: string; subtitle: string; info: string; leaderboardTitle?: string; leaderboardSubtitle?: string }) => setGenerationHeroState(val);
  const setGenerationDocs = (val: { id: string; url: string; caption?: string }[]) => setGenerationDocsState(val);
  const setGenerationAchievements = (val: Achievement[]) => setGenerationAchievementsState(val);
  const setClassLogo = (subclass: string, base64: string) => setClassLogosState((prev) => ({ ...prev, [subclass]: base64 }));
  const setClassBg = (subclass: string, base64: string) => setClassBgsState((prev) => ({ ...prev, [subclass]: base64 }));
  const updateClassData = (subclass: string, data: Partial<ClassData>) => {
    setClassesDataState((prev) => ({ ...prev, [subclass]: { ...prev[subclass], ...data } }));
  };

  // ── Save: write to Firestore (+ localStorage as backup) ──────────────────
  const saveChanges = async () => {
    try {
      // 1. Save global config to Firestore
      const globalConfig: GlobalConfig = {
        logoSekolah,
        logoAngkatan,
        generationBg,
        generationPortrait,
        generationHero,
        generationDocs,
        generationAchievements,
      };
      await saveGlobalConfig(globalConfig);

      // Also mirror to localStorage as offline backup
      setItem("logo_sekolah", logoSekolah);
      setItem("logo_angkatan", logoAngkatan);
      setItem("bg_generation_hero", generationBg);
      setItem("generation_portrait", generationPortrait);
      setItem("generation_hero_text", generationHero);
      setItem("generation_docs", generationDocs);
      setItem("generation_achievements", generationAchievements);

      // 2. Save each class to Firestore
      const allSubclasses = getAllSubclasses();
      await Promise.all(
        allSubclasses.map(async (subclass) => {
          const classConfig: ClassConfig = {
            ...classesData[subclass],
            logo: classLogos[subclass] || "",
            bg: classBgs[subclass] || "",
          };
          await saveClassConfig(subclass, classConfig);

          const stripped = cleanSubclassCode(subclass);
          setItem(`logo_class_${stripped}`, classLogos[subclass]);
          setItem(`bg_class_${stripped}_hero`, classBgs[subclass]);
          setItem(`class_data_${stripped}`, classesData[subclass]);
        })
      );

      setEditMode(false);
      showToast("Tersimpan! Perubahan sudah live untuk semua pengguna.", "success");
    } catch (e) {
      console.error(e);
      showToast("Gagal menyimpan ke server. Cek koneksi Firebase.", "error");
    }
  };

  // ── Discard: reload from Firestore ────────────────────────────────────────
  const discardChanges = async () => {
    try {
      const cfg = await fetchGlobalConfig();
      if (cfg) applyGlobalConfig(cfg);

      const allSubclasses = getAllSubclasses();
      await Promise.all(
        allSubclasses.map(async (subclass) => {
          const cls = await fetchClassConfig(subclass);
          if (cls) applyClassConfig(subclass, cls);
        })
      );
    } catch {
      loadLocalFallback();
    }
    setEditMode(false);
    showToast("Perubahan dibatalkan", "success");
  };

  return (
    <DataContext.Provider
      value={{
        editMode, setEditMode,
        logoSekolah, setLogoSekolah,
        logoAngkatan, setLogoAngkatan,
        generationBg, setGenerationBg,
        generationPortrait, setGenerationPortrait,
        generationHero, setGenerationHero,
        generationDocs, setGenerationDocs,
        generationAchievements, setGenerationAchievements,
        classLogos, setClassLogo,
        classBgs, setClassBg,
        classesData, updateClassData,
        saveChanges, discardChanges,
        toast, showToast, hideToast,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData must be used within a DataProvider");
  return context;
};

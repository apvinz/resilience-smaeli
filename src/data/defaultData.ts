export interface TextContent {
  title: string;
  subtitle: string;
  info: string;
  leaderboardTitle?: string;
  leaderboardSubtitle?: string;
}

export interface Member {
  id: string;
  name: string;
  photo: string; // Base64 or placeholder
}

export interface ClassStructureMember {
  name: string;
  photo: string;
}

export interface ClassStructure {
  wali: ClassStructureMember;
  ketua: ClassStructureMember;
  wakilKetua: ClassStructureMember;
  bendahara: ClassStructureMember;
  wakilBendahara: ClassStructureMember;
  sekretaris: ClassStructureMember;
  wakilSekretaris: ClassStructureMember;
}

export interface Achievement {
  id: string;
  eventName: string;
  rank: string; // "juara1", "juara2", etc.
  level: string; // "kota", "provinsi", "nasional", "internasional"
  isCurated: boolean;
  photo: string;
  students: string[]; // List of student names formatted: "NAMA (KELAS)"
}

export interface ClassData {
  tagline: string;
  slogan: string;
  structure: ClassStructure;
  members: Member[];
  achievements: Achievement[];
  isAvailable?: boolean;
  photos?: { id: string; url: string; caption?: string }[];
}

export interface DefaultData {
  credentials: {
    username: string;
    requiredRole: string; // "admin" or similar
    password: string;
  };
  generationHero: TextContent;
  documentation: {
    photos: { id: string; url: string; caption?: string }[];
  };
  classes: {
    [key: string]: {
      label: string;
      subclasses: string[];
    };
  };
  classDataDefaults: {
    [subclass: string]: ClassData;
  };
  generationAchievements: Achievement[];
}

export const defaultData = {
  credentials: {
    username: "admin21",
    password: "resilience21"
  },
  generationHero: {
    title: "WELCOME TO WEBSITE THE 21th GENERATION OF SMAELI",
    subtitle: "RE21LIENCE",
    info: "Kami adalah angkatan ke-21 dari SMA Negara Unggulan (SMAELI) yang menjunjung tinggi kebersamaan, integritas, dan tangguh menghadapi masa depan dengan semangat RE21LIENCE.",
    leaderboardTitle: "TOP 20 SISWA BERPRESTASI",
    leaderboardSubtitle: "Poin kumulatif angkatan 21"
  },
  documentation: {
    photos: [
      {
        id: "doc1",
        url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800&auto=format&fit=crop"
      },
      {
        id: "doc2",
        url: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=800&auto=format&fit=crop"
      },
      {
        id: "doc3",
        url: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=800&auto=format&fit=crop"
      }
    ]
  },
  classes: {
    X: {
      label: "X (10)",
      subclasses: ["X.1", "X.2", "X.3", "X.4"]
    },
    XI: {
      label: "XI (11)",
      subclasses: ["XI.1", "XI.2", "XI.3", "XI.4"]
    },
    XII: {
      label: "XII (12)",
      subclasses: ["XII.1", "XII.2", "XII.3", "XII.4"]
    }
  },
  classDataDefaults: {
    // We can pre-scaffold empty classData templates for subclasses
    "X.1": {
      tagline: "(R1VASTRA)",
      slogan: "Satu visi, satu karsa, kitalah pemenang utama.",
      structure: {
        wali: { name: "Dr. Sulistyo Raharjo", photo: "" },
        ketua: { name: "Aditya Pratama", photo: "" },
        wakilKetua: { name: "Anisa Rahmawati", photo: "" },
        bendahara: { name: "Budi Santoso", photo: "" },
        wakilBendahara: { name: "Citra Lestari", photo: "" },
        sekretaris: { name: "Dwi Prasetyo", photo: "" },
        wakilSekretaris: { name: "Eka Putri", photo: "" }
      },
      members: [
        { id: "m1", name: "Aditya Pratama", photo: "" },
        { id: "m2", name: "Anisa Rahmawati", photo: "" },
        { id: "m3", name: "Budi Santoso", photo: "" },
        { id: "m4", name: "Citra Lestari", photo: "" },
        { id: "m5", name: "Dwi Prasetyo", photo: "" },
        { id: "m6", name: "Eka Putri", photo: "" },
        { id: "m7", name: "Fajar Nugroho", photo: "" },
        { id: "m8", name: "Gita Amalia", photo: "" },
        { id: "m9", name: "Hadi Wijaya", photo: "" },
        { id: "m10", name: "Indah Permata", photo: "" }
      ],
      achievements: [
        {
          id: "ca1",
          eventName: "LOMBA DEBAT BAHASA INDONESIA SE-PROVINSI",
          rank: "juara1",
          level: "provinsi",
          isCurated: true,
          photo: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=600&auto=format&fit=crop",
          students: ["Aditya Pratama (X.1)", "Gita Amalia (X.1)"]
        }
      ]
    },
    "X.2": {
      tagline: "(CHEVR21ON)",
      slogan: "Sinergi cerdas menghasilkan prestasi tanpa batas.",
      structure: {
        wali: { name: "", photo: "" },
        ketua: { name: "", photo: "" },
        wakilKetua: { name: "", photo: "" },
        bendahara: { name: "", photo: "" },
        wakilBendahara: { name: "", photo: "" },
        sekretaris: { name: "", photo: "" },
        wakilSekretaris: { name: "", photo: "" }
      },
      members: [],
      achievements: []
    }
  },
  generationAchievements: [
    {
      id: "ga1",
      eventName: "OSN MATEMATIKA NASIONAL",
      rank: "juara1",
      level: "nasional",
      isCurated: true,
      photo: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=600&auto=format&fit=crop",
      students: ["MUHAMMAD ALPIN (X.2)"]
    },
    {
      id: "ga2",
      eventName: "FESTIVAL MUSIK NASIONAL",
      rank: "juara2",
      level: "nasional",
      isCurated: false,
      photo: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&auto=format&fit=crop",
      students: ["ADITYA PRATAMA (X.1)", "ANISA RAHMAWATI (X.1)"]
    },
    {
      id: "ga3",
      eventName: "INTERNATIONAL CHEMISTRY OLYMPIAD",
      rank: "juara3",
      level: "internasional",
      isCurated: true,
      photo: "https://images.unsplash.com/photo-1532187643603-ba119ca4109e?q=80&w=600&auto=format&fit=crop",
      students: ["MUHAMMAD ALPIN (X.2)"]
    }
  ]
};

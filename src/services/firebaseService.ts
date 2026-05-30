import {
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  Unsubscribe,
} from "firebase/firestore";
import { db } from "./firebase";
import { ClassData, Achievement } from "./data/defaultData";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface GlobalConfig {
  logoSekolah: string;
  logoAngkatan: string;
  generationBg: string;
  generationPortrait: string;
  generationHero: {
    title: string;
    subtitle: string;
    info: string;
    leaderboardTitle?: string;
    leaderboardSubtitle?: string;
  };
  generationDocs: { id: string; url: string; caption?: string }[];
  generationAchievements: Achievement[];
}

export interface ClassConfig extends ClassData {
  logo?: string;
  bg?: string;
}

// ─── Global Config ─────────────────────────────────────────────────────────

const GLOBAL_DOC = "global";

export async function fetchGlobalConfig(): Promise<GlobalConfig | null> {
  const snap = await getDoc(doc(db, "config", GLOBAL_DOC));
  return snap.exists() ? (snap.data() as GlobalConfig) : null;
}

export async function saveGlobalConfig(data: GlobalConfig): Promise<void> {
  await setDoc(doc(db, "config", GLOBAL_DOC), data, { merge: true });
}

export function subscribeGlobalConfig(
  callback: (data: GlobalConfig) => void
): Unsubscribe {
  return onSnapshot(doc(db, "config", GLOBAL_DOC), (snap) => {
    if (snap.exists()) {
      callback(snap.data() as GlobalConfig);
    }
  });
}

// ─── Class Config ───────────────────────────────────────────────────────────

function classDocId(subclass: string): string {
  // "X.1" → "X1", "XI.2" → "XI2"
  return subclass.replace(/\./g, "");
}

export async function fetchClassConfig(
  subclass: string
): Promise<ClassConfig | null> {
  const snap = await getDoc(doc(db, "classes", classDocId(subclass)));
  return snap.exists() ? (snap.data() as ClassConfig) : null;
}

export async function saveClassConfig(
  subclass: string,
  data: ClassConfig
): Promise<void> {
  await setDoc(doc(db, "classes", classDocId(subclass)), data, { merge: true });
}

export function subscribeClassConfig(
  subclass: string,
  callback: (data: ClassConfig) => void
): Unsubscribe {
  return onSnapshot(doc(db, "classes", classDocId(subclass)), (snap) => {
    if (snap.exists()) {
      callback(snap.data() as ClassConfig);
    }
  });
}

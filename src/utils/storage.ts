import { defaultData } from "../data/defaultData";

/**
 * Clean up subclass formats (e.g. "X.1" -> "X1", "XI.2" -> "XI2")
 */
export function cleanSubclassCode(subclass: string): string {
  return subclass.replace(/\./g, "");
}

/**
 * Resolves a tailored key name based on subclass identifiers.
 */
export function getClassKey(level: string, subclass: string, suffix: string): string {
  const cleanCode = cleanSubclassCode(subclass);
  return `${suffix}_class_${cleanCode}`;
}

export function getItem(key: string): any {
  try {
    const rawValue = localStorage.getItem(key);
    if (!rawValue) return null;
    return JSON.parse(rawValue);
  } catch (error) {
    console.error("Local storage read error for key: ", key, error);
    return null;
  }
}

export function setItem(key: string, value: any): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Local storage write error for key: ", key, error);
  }
}

export function removeItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error("Local storage removal error for index: ", key, error);
  }
}

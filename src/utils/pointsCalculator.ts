export function calculatePoints(
  level: "kota" | "provinsi" | "nasional" | "internasional" | string,
  rank: "harapan3" | "harapan2" | "harapan1" | "juara3" | "juara2" | "juara1" | string,
  isCurated: boolean
): number {
  const basePoints: Record<string, Record<string, number>> = {
    kota: {
      harapan3: 10,
      harapan2: 20,
      harapan1: 30,
      juara3: 50,
      juara2: 60,
      juara1: 80,
    },
    provinsi: {
      harapan3: 50,
      harapan2: 60,
      harapan1: 80,
      juara3: 100,
      juara2: 130,
      juara1: 150,
    },
    nasional: {
      harapan3: 100,
      harapan2: 130,
      harapan1: 150,
      juara3: 300,
      juara2: 350,
      juara1: 500,
    },
    internasional: {
      harapan3: 300,
      harapan2: 350,
      harapan1: 500,
      juara3: 1250,
      juara2: 3500,
      juara1: 5000,
    },
  };

  const lvl = level.toLowerCase();
  const rnk = rank.toLowerCase();

  const levelGroup = basePoints[lvl] || basePoints["kota"];
  const points = levelGroup[rnk] !== undefined ? levelGroup[rnk] : 10;

  return isCurated ? points : Math.round(points * 0.8);
}

interface LeaderboardEntry {
  name: string;
  class: string;
  totalPoints: number;
  trophyCount: number;
}

export function buildLeaderboard(achievements: any[]): LeaderboardEntry[] {
  if (!Array.isArray(achievements)) return [];

  // Map representation: full_string -> running total
  const statsMap: Record<string, { totalPoints: number; trophyCount: number }> = {};

  achievements.forEach((achievement) => {
    if (!achievement) return;
    const { level, rank, isCurated, students } = achievement;
    if (!Array.isArray(students)) return;

    // Calculate achievement points
    const points = calculatePoints(level, rank, isCurated);

    students.forEach((studentStr: string) => {
      if (!studentStr || typeof studentStr !== "string") return;
      const cleanStudent = studentStr.trim().toUpperCase();
      if (!cleanStudent) return;

      if (!statsMap[cleanStudent]) {
        statsMap[cleanStudent] = { totalPoints: 0, trophyCount: 0 };
      }

      statsMap[cleanStudent].totalPoints += points;
      statsMap[cleanStudent].trophyCount += 1;
    });
  });

  // Convert map to leaderboard objects
  const entryList: LeaderboardEntry[] = Object.keys(statsMap).map((key) => {
    // Parse "NAMA (KELAS)"
    let name = key;
    let className = "CMS";

    const match = key.match(/^(.+?)\s*\((.+?)\)$/);
    if (match) {
      name = match[1].trim();
      className = match[2].trim();
    }

    return {
      name,
      class: className,
      totalPoints: statsMap[key].totalPoints,
      trophyCount: statsMap[key].trophyCount,
    };
  });

  // Sort: descending by totalPoints, tie-breaker by trophyCount, then alphabetical by name
  return entryList.sort((a, b) => {
    if (b.totalPoints !== a.totalPoints) {
      return b.totalPoints - a.totalPoints;
    }
    if (b.trophyCount !== a.trophyCount) {
      return b.trophyCount - a.trophyCount;
    }
    return a.name.localeCompare(b.name);
  });
}

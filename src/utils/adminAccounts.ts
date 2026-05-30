export interface AdminAccount {
  username: string;
  password: string;
  role: "main" | string; // "main" for primary admin, subclass display name (e.g. "X.1") for class admin
  label: string;
}

export const ADMIN_ACCOUNTS: AdminAccount[] = [
  {
    username: "admin21",
    password: "resilience21",
    role: "main",
    label: "Admin Utama (Seisi Web)"
  },
  {
    username: "adminx1",
    password: "rvast",
    role: "X.1",
    label: "Admin Kelas X.1"
  },
  {
    username: "adminx2",
    password: "rxtwo",
    role: "X.2",
    label: "Admin Kelas X.2"
  },
  {
    username: "adminx3",
    password: "rxthr",
    role: "X.3",
    label: "Admin Kelas X.3"
  },
  {
    username: "adminx4",
    password: "rxfou",
    role: "X.4",
    label: "Admin Kelas X.4"
  },
  {
    username: "adminxi1",
    password: "rxion",
    role: "XI.1",
    label: "Admin Kelas XI.1"
  },
  {
    username: "adminxi2",
    password: "rxiit",
    role: "XI.2",
    label: "Admin Kelas XI.2"
  },
  {
    username: "adminxi3",
    password: "rxiid",
    role: "XI.3",
    label: "Admin Kelas XI.3"
  },
  {
    username: "adminxi4",
    password: "rxiif",
    role: "XI.4",
    label: "Admin Kelas XI.4"
  },
  {
    username: "adminxii1",
    password: "rxiii",
    role: "XII.1",
    label: "Admin Kelas XII.1"
  },
  {
    username: "adminxii2",
    password: "rxiie",
    role: "XII.2",
    label: "Admin Kelas XII.2"
  },
  {
    username: "adminxii3",
    password: "rxilg",
    role: "XII.3",
    label: "Admin Kelas XII.3"
  },
  {
    username: "adminxii4",
    password: "rxiim",
    role: "XII.4",
    label: "Admin Kelas XII.4"
  }
];

export function findAdminByUsername(username: string): AdminAccount | undefined {
  const cleanUsername = username.trim().toLowerCase();
  return ADMIN_ACCOUNTS.find(acc => acc.username.toLowerCase() === cleanUsername);
}

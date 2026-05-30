import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Shield, KeyRound, User, ChevronRight, Eye, EyeOff, Info } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ADMIN_ACCOUNTS } from "../utils/adminAccounts";

export const LoginPage: React.FC = () => {
  const { login, loginAsGuest } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRoleInfo, setShowRoleInfo] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !password.trim()) {
      setError("Username dan password tidak boleh kosong");
      return;
    }

    const success = login(username.trim(), password.trim());
    if (success) {
      navigate("/generation");
    } else {
      setError("Username atau password salah!");
    }
  };

  const handleGuestLogin = () => {
    loginAsGuest();
    navigate("/generation");
  };

  return (
    <div className="min-h-screen py-12 px-6 bg-[#07080A] relative overflow-y-auto flex flex-col items-center justify-center select-none">
      {/* Dynamic ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-[#FF7A00]/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md bg-[#0E1015] border border-white/10 rounded-3xl p-8 shadow-2xl relative z-10 space-y-8"
      >
        {/* Page Titles */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 bg-[#FF7A00]/10 text-[#FF7A00] border border-[#FF7A00]/20 rounded-full flex items-center justify-center mx-auto mb-1">
            <Shield size={26} strokeWidth={1.8} />
          </div>

          <h1 className="text-lg sm:text-xl font-black tracking-tight text-white uppercase leading-tight">
            LOGIN SEBAGAI ADMIN ATAU SEBAGAI PENGUNJUNG WEB
          </h1>
          <p className="text-xs text-gray-400 max-w-xs mx-auto leading-relaxed">
            RESILIENCE WEB PORTAL
          </p>
        </div>

        {/* Login Credentials inputs Form */}
        <form onSubmit={handleAdminLogin} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-500/10 text-red-500 rounded-xl text-xs font-semibold uppercase text-center border border-red-500/20">
              {error}
            </div>
          )}

          {/* Username */}
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold uppercase text-gray-400 tracking-wider block">
              Username Admin
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500 pointer-events-none">
                <User size={16} />
              </span>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Masukkan username"
                className="w-full text-xs p-3.5 pl-11 border border-white/10 bg-[#14161E] rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#FF7A00] focus:border-[#FF7A00] text-white transition-colors font-semibold"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold uppercase text-gray-400 tracking-wider block">
              Password Admin
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500 pointer-events-none">
                <KeyRound size={16} />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Masukkan password admin"
                className="w-full text-xs p-3.5 pl-11 pr-11 border border-white/10 bg-[#14161E] rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#FF7A00] focus:border-[#FF7A00] text-white transition-colors font-semibold"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-500 hover:text-white transition-colors focus:outline-none"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Login actions buttons */}
          <div className="pt-4 space-y-3">
            <button
              type="submit"
              className="w-full py-3.5 bg-[#FF7A00] hover:bg-[#E06600] text-white font-black rounded-full transition-all text-xs tracking-wider uppercase shadow-lg flex items-center justify-center gap-1 cursor-pointer transform hover:scale-[1.01] active:scale-[0.99]"
            >
              <span>MASUK SEBAGAI ADMIN</span>
              <ChevronRight size={14} />
            </button>

            <button
              type="button"
              onClick={handleGuestLogin}
              className="w-full py-3.5 bg-[#14161E] border border-white/10 text-white hover:border-white/25 font-black rounded-full transition-all text-xs tracking-wider uppercase flex items-center justify-center gap-1 cursor-pointer transform hover:scale-[1.01] active:scale-[0.99]"
            >
              <span>MASUK SEBAGAI PENGUNJUNG WEB (GUEST)</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

import React, { useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { fileToBase64 } from "../../utils/imageUtils";
import { Menu, X, LogOut, Edit, Check, RotateCcw, ArrowLeft } from "lucide-react";

const DEFAULT_LOGO_CLASS = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='50' fill='%23EEF2F8'/><text x='50' y='58' font-family='sans-serif' font-weight='bold' font-size='24' fill='%232B7FFF' text-anchor='middle'>CLS</text></svg>";

interface NavbarProps {
  currentClassSubclass?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ currentClassSubclass }) => {
  const { role, isAdmin, logout, canEditMainSettings, canEditClass } = useAuth();
  const {
    editMode,
    setEditMode,
    logoSekolah,
    setLogoSekolah,
    logoAngkatan,
    setLogoAngkatan,
    classLogos,
    setClassLogo,
    saveChanges,
    discardChanges,
    showToast
  } = useData();

  const isSchoolLogoEditable = editMode && canEditMainSettings();
  const isAngkatanLogoEditable = editMode && canEditMainSettings();
  const isClassLogoEditable = !!(editMode && currentClassSubclass && canEditClass(currentClassSubclass));

  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Hidden file inputs
  const sekolahInputRef = useRef<HTMLInputElement>(null);
  const angkatanInputRef = useRef<HTMLInputElement>(null);
  const classInputRef = useRef<HTMLInputElement>(null);

  const handleSekolahLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await fileToBase64(file);
        setLogoSekolah(base64);
        showToast("Logo Sekolah berhasil diperbarui secara lokal. Klik SIMPAN untuk menyimpan permanen.");
      } catch (err) {
        showToast("Gagal memproses gambar logo sekolah", "error");
      }
    }
  };

  const handleAngkatanLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await fileToBase64(file);
        setLogoAngkatan(base64);
        showToast("Logo Angkatan berhasil diperbarui secara lokal. Klik SIMPAN untuk menyimpan permanen.");
      } catch (err) {
        showToast("Gagal memproses gambar logo angkatan", "error");
      }
    }
  };

  const handleClassLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!currentClassSubclass) return;
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await fileToBase64(file);
        setClassLogo(currentClassSubclass, base64);
        showToast(`Logo Kelas ${currentClassSubclass} diperbarui secara lokal. Klik SIMPAN untuk menyimpan.`);
      } catch (err) {
        showToast("Gagal memproses gambar logo kelas", "error");
      }
    }
  };

  const handleScrollToSection = (elementId: string) => {
    setMobileMenuOpen(false);
    if (location.pathname !== "/generation") {
      navigate("/generation");
      setTimeout(() => {
        const el = document.getElementById(elementId);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 300);
    } else {
      const el = document.getElementById(elementId);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const userHasLeftPage = currentClassSubclass !== undefined;

  return (
    <nav className="fixed top-0 left-0 right-0 h-20 bg-transparent z-50 transition-all duration-300">
      <div className="max-w-[1200px] mx-auto h-full px-6 flex items-center justify-between">
        {/* Left Side: School Logo and Title or Back Button */}
        <div className="flex items-center gap-3">
          {/* Back button shown on class pages */}
          {userHasLeftPage && (
            <button
              onClick={() => navigate("/generation")}
              className="p-1 px-3 rounded-full hover:bg-white/10 text-[#FF7A00] flex items-center gap-1.5 transition-colors text-sm font-semibold mr-2"
              title="Kembali ke Informasi Angkatan"
            >
              <ArrowLeft size={16} />
              <span className="hidden sm:inline">Kembali</span>
            </button>
          )}

          {/* School logo */}
          <div className="relative group">
            <img
              src={logoSekolah}
              alt="Logo Sekolah"
              className={`w-16 h-16 sm:w-18 sm:h-18 rounded-full object-cover border-2 ${
                isSchoolLogoEditable ? "border-[#FF7A00] border-dashed cursor-pointer hover:scale-105" : "border-white/10"
              } transition-all`}
              onDoubleClick={() => isSchoolLogoEditable && sekolahInputRef.current?.click()}
              title={isSchoolLogoEditable ? "Double-click untuk ganti logo sekolah" : "SMAELI Logo"}
            />
            {isSchoolLogoEditable && (
              <span className="absolute -bottom-1 -right-1 bg-[#FF7A00] text-white text-[9px] font-bold p-0.5 px-1 rounded-full scale-75 select-none pointer-events-none">
                EDIT
              </span>
            )}
            <input
              type="file"
              ref={sekolahInputRef}
              onChange={handleSekolahLogoUpload}
              accept="image/*"
              className="hidden"
            />
          </div>

          <span className="font-black text-white tracking-widest text-[#FF7A00] text-sm sm:text-base select-none uppercase">
            RE21LIENCE
          </span>
        </div>

        {/* Center: Scroll menu items for Generation Page */}
        <div className="hidden md:flex items-center gap-6">
          {!userHasLeftPage ? (
            <>
              <button
                onClick={() => handleScrollToSection("hero")}
                className="text-sm font-semibold text-gray-300 hover:text-[#FF7A00] transition-colors"
              >
                Hero
              </button>
              <button
                onClick={() => handleScrollToSection("documentation")}
                className="text-sm font-semibold text-gray-300 hover:text-[#FF7A00] transition-colors"
              >
                Dokumentasi
              </button>
              <button
                onClick={() => handleScrollToSection("classes")}
                className="text-sm font-semibold text-gray-300 hover:text-[#FF7A00] transition-colors"
              >
                Kelas
              </button>
              <button
                onClick={() => handleScrollToSection("achievements")}
                className="text-sm font-semibold text-gray-300 hover:text-[#FF7A00] transition-colors"
              >
                Prestasi
              </button>
            </>
          ) : (
            <span className="text-[#FF7A00] font-extrabold tracking-wider text-xs bg-white/5 border border-white/10 px-4 py-1.5 rounded-full uppercase">
              RUANG KELAS {currentClassSubclass}
            </span>
          )}
        </div>

        {/* Right Side: Class logos, Edit states, Action Buttons */}
        <div className="flex items-center gap-4">
          {/* Class logos (shown on class layouts) */}
          {userHasLeftPage && (
            <div className="flex items-center gap-2.5 border-r border-white/10 pr-3.5 select-none">
              {/* Logo Angkatan */}
              <div className="relative group">
                <img
                  src={logoAngkatan}
                  alt="Logo Angkatan"
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 ${
                    isAngkatanLogoEditable ? "border-[#FF7A00] border-dashed cursor-pointer hover:scale-105" : "border-white/10"
                  } transition-all`}
                  onDoubleClick={() => isAngkatanLogoEditable && angkatanInputRef.current?.click()}
                  title={isAngkatanLogoEditable ? "Double-click untuk ganti logo angkatan" : "Logo Angkatan"}
                />
                <input
                  type="file"
                  ref={angkatanInputRef}
                  onChange={handleAngkatanLogoUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              {/* Logo Kelas specific */}
              <div className="relative group">
                <img
                  src={classLogos[currentClassSubclass] || DEFAULT_LOGO_CLASS}
                  alt="Logo Kelas"
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 ${
                    isClassLogoEditable ? "border-[#FF7A00] border-dashed cursor-pointer hover:scale-105" : "border-white/10"
                  } transition-all`}
                  onDoubleClick={() => isClassLogoEditable && classInputRef.current?.click()}
                  title={isClassLogoEditable ? "Double-click untuk ganti logo kelas" : "Logo Kelas"}
                />
                <input
                  type="file"
                  ref={classInputRef}
                  onChange={handleClassLogoUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </div>
          )}

          {/* Logo Angkatan also shown in root Navbar if not ClassPage to fulfill right logo requirement */}
          {!userHasLeftPage && (
            <div className="hidden sm:block relative">
              <img
                src={logoAngkatan}
                alt="Logo Angkatan"
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 ${
                  isAngkatanLogoEditable ? "border-[#FF7A00] border-dashed cursor-pointer hover:scale-105" : "border-white/10"
                } transition-all`}
                onDoubleClick={() => isAngkatanLogoEditable && angkatanInputRef.current?.click()}
                title={isAngkatanLogoEditable ? "Double-click untuk ganti logo angkatan" : "Logo Angkatan"}
              />
              <input
                type="file"
                ref={angkatanInputRef}
                onChange={handleAngkatanLogoUpload}
                accept="image/*"
                className="hidden"
              />
            </div>
          )}

          {/* Admin Command bar */}
          {isAdmin && (
            <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 p-1 rounded-full text-xs">
              {!editMode ? (
                <button
                  onClick={() => setEditMode(true)}
                  className="px-3 py-1.5 bg-[#FF7A00] hover:bg-[#E06600] text-white font-semibold rounded-full flex items-center gap-1 transition-all"
                >
                  <Edit size={13} />
                  <span>EDIT</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={saveChanges}
                    className="px-3 py-1.5 bg-[#10B981] hover:bg-[#059669] text-white font-bold rounded-full flex items-center gap-0.5 transition-all"
                  >
                    <Check size={13} />
                    <span>SIMPAN</span>
                  </button>
                  <button
                    onClick={discardChanges}
                    className="px-2 py-1.5 text-gray-400 hover:text-white font-semibold rounded-full flex items-center gap-0.5 transition-all"
                    title="Batal & Muat Ulang"
                  >
                    <RotateCcw size={13} />
                    <span className="hidden sm:inline">BATAL</span>
                  </button>
                </>
              )}
            </div>
          )}

          {/* User Signout */}
          {role && (
            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="p-1.5 hover:bg-white/10 text-gray-400 hover:text-[#EF4444] rounded-full transition-all"
              title="Keluar Sesi"
            >
              <LogOut size={18} />
            </button>
          )}

          {/* Hamburger button on Mobile */}
          <button
            onClick={() => setMobileMenuOpen(prev => !prev)}
            className="p-1.5 md:hidden hover:bg-white/10 text-white rounded-full transition-all"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 right-0 bg-[#0E1015]/95 backdrop-blur-xl border-b border-white/10 shadow-lg py-4 px-6 flex flex-col gap-3 z-40 transition-transform">
          {!userHasLeftPage ? (
            <>
              <button
                onClick={() => handleScrollToSection("hero")}
                className="text-left py-2 text-sm font-semibold text-gray-300 hover:text-[#FF7A00]"
              >
                Hero
              </button>
              <button
                onClick={() => handleScrollToSection("documentation")}
                className="text-left py-2 text-sm font-semibold text-gray-300 hover:text-[#FF7A00]"
              >
                Dokumentasi
              </button>
              <button
                onClick={() => handleScrollToSection("classes")}
                className="text-left py-2 text-sm font-semibold text-gray-300 hover:text-[#FF7A00]"
              >
                Kelas
              </button>
              <button
                onClick={() => handleScrollToSection("achievements")}
                className="text-left py-2 text-sm font-semibold text-gray-300 hover:text-[#FF7A00]"
              >
                Prestasi
              </button>
            </>
          ) : (
            <span className="text-[#FF7A00] font-bold text-xs py-1">
              KELAS: {currentClassSubclass}
            </span>
          )}

          {role && (
            <div className="border-t border-white/10 pt-2 flex justify-between items-center text-xs text-gray-400">
              <span>Masuk sebagai: <b className="text-[#FF7A00] uppercase">{role}</b></span>
              <button
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="text-[#EF4444] font-semibold flex items-center gap-1"
              >
                <LogOut size={12} />
                <span>Keluar</span>
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

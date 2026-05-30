import React, { useState } from "react";
import { useData } from "../../context/DataContext";
import { fileToBase64 } from "../../utils/imageUtils";
import { X, ArrowRight, ArrowLeft, Upload, Check } from "lucide-react";

interface AchievementFormProps {
  onSave: (achievement: {
    id: string;
    eventName: string;
    rank: string;
    level: string;
    isCurated: boolean;
    photo: string;
    students: string[];
  }) => void;
  onClose: () => void;
  defaultClassName?: string;
}

export const AchievementForm: React.FC<AchievementFormProps> = ({ onSave, onClose }) => {
  const { showToast } = useData();
  const [step, setStep] = useState(1);

  // Form State
  const [photo, setPhoto] = useState<string>("");
  const [isCurated, setIsCurated] = useState<boolean>(true);
  const [eventName, setEventName] = useState<string>("");
  const [rank, setRank] = useState<string>("juara1");
  const [level, setLevel] = useState<string>("nasional");
  const [studentsInput, setStudentsInput] = useState<string>("");

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await fileToBase64(file);
        setPhoto(base64);
        showToast("Foto prestasi berhasil diunggah!");
      } catch (err) {
        showToast("Gagal memproses gambar prestasi", "error");
      }
    }
  };

  const handleNext = () => {
    if (step === 1 && !photo) {
      showToast("Harap unggah foto piagam/foto prestasi terlebih dahulu", "error");
      return;
    }
    if (step === 3 && !eventName.trim()) {
      showToast("Harap masukkan nama perlombaan/event", "error");
      return;
    }
    setStep(prev => prev + 1);
  };

  const handlePrev = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = () => {
    const rawLines = studentsInput.split("\n");
    const parsedStudents = rawLines
      .map(line => line.trim())
      .filter(line => line.length > 0 && line.includes("(") && line.includes(")"));

    if (parsedStudents.length === 0) {
      showToast("Harap masukkan minimal satu siswa dengan format NAMA (KELAS) - misalnya: ADI WICAKSANA (X.1)", "error");
      return;
    }

    onSave({
      id: "ach_" + Date.now(),
      eventName: eventName.trim().toUpperCase(),
      rank,
      level,
      isCurated,
      photo,
      students: parsedStudents
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#0E1015] border border-white/10 text-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden flex flex-col transition-all duration-300 transform scale-100">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#0E1015]">
          <div>
            <h3 className="font-extrabold text-lg text-white">Tambah Prestasi Baru</h3>
            <p className="text-xs text-gray-400 font-semibold uppercase">Langkah {step} dari 5</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 px-2.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 flex-1 min-h-[300px] flex flex-col justify-center bg-[#0E1015]">
          {/* Step 1: Upload Photo */}
          {step === 1 && (
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-center text-white">
                LANGKAH 1: UNGGAH FOTO PRESTASI
              </label>
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-xl p-8 hover:border-[#FF7A00] transition-colors cursor-pointer bg-[#14161E] relative min-h-[200px]">
                {photo ? (
                  <div className="w-full flex flex-col items-center gap-3">
                    <img src={photo} alt="Preview" className="h-32 object-contain rounded-lg border border-white/10 shadow-sm" />
                    <button
                      type="button"
                      onClick={() => setPhoto("")}
                      className="text-xs text-[#EF4444] font-semibold border border-red-500/20 rounded-full px-3 py-1 bg-[#1A1114] hover:bg-red-950/40"
                    >
                      Hapus Foto
                    </button>
                  </div>
                ) : (
                  <div className="text-center space-y-2">
                    <div className="mx-auto w-10 h-10 rounded-full bg-[#FF7A00]/10 text-[#FF7A00] flex items-center justify-center border border-[#FF7A00]/20">
                      <Upload size={20} />
                    </div>
                    <p className="text-xs text-gray-300 font-semibold">Klik untuk memilih file foto</p>
                    <p className="text-[10px] text-gray-400">Rasio ideal 4:3 (JPEG, PNG, WEBP)</p>
                  </div>
                )}
                {!photo && (
                  <input
                    type="file"
                    onChange={handlePhotoUpload}
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                )}
              </div>
            </div>
          )}

          {/* Step 2: Puspresnas Curation */}
          {step === 2 && (
            <div className="space-y-4 text-center bg-[#0E1015]">
              <label className="block text-sm font-semibold text-white">
                LANGKAH 2: KURASI PUSPRESNAS
              </label>
              <p className="text-xs text-gray-400 max-w-sm mx-auto font-medium">
                Centang opsi ini jika event perlombaan ini diselenggarakan oleh Pusat Prestasi Nasional (Puspresnas) Kementerian Pendidikan.
              </p>
              <div className="flex justify-center gap-4 py-4">
                <button
                  type="button"
                  onClick={() => setIsCurated(true)}
                  className={`px-5 py-3.5 rounded-xl font-semibold border text-sm transition-all flex items-center gap-2 ${
                    isCurated
                      ? "bg-[#FF7A00]/10 border-[#FF7A00] text-[#FF7A00]"
                      : "bg-[#14161E] border-white/10 text-gray-300 hover:bg-[#1C1E26]"
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                  <span>TERKURASI PUSPRESNAS (Poin 100%)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsCurated(false)}
                  className={`px-5 py-3.5 rounded-xl font-semibold border text-sm transition-all flex items-center gap-2 ${
                    !isCurated
                      ? "bg-white/5 border-white/20 text-white"
                      : "bg-[#14161E] border-white/10 text-gray-300 hover:bg-[#1C1E26]"
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-gray-500" />
                  <span>UMUM / TIDAK TERKURASI (Poin 80%)</span>
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Event Name */}
          {step === 3 && (
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-white">
                LANGKAH 3: NAMA PERLOMBAAN / EVENT
              </label>
              <input
                type="text"
                value={eventName}
                onChange={e => setEventName(e.target.value)}
                placeholder="CONTOH: OSN MATEMATIKA JAWA BARAT"
                className="w-full p-3 border border-white/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#FF7A00] focus:border-[#FF7A00] bg-[#14161E] text-white uppercase text-sm font-semibold"
                autoFocus
              />
            </div>
          )}

          {/* Step 4: Rank + Level dropdown selection */}
          {step === 4 && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2">
                <label className="block text-sm font-semibold text-white text-center mb-1">
                  LANGKAH 4: JUARA DAN TINGKAT PRESTASI
                </label>
              </div>
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-gray-300">Pilih Juara</span>
                <select
                  value={rank}
                  onChange={e => setRank(e.target.value)}
                  className="w-full p-2.5 border border-white/10 rounded-xl text-sm focus:border-[#FF7A00] focus:outline-none focus:ring-1 focus:ring-[#FF7A00] bg-[#14161E] text-white font-semibold"
                >
                  <option value="juara1">Juara 1</option>
                  <option value="juara2">Juara 2</option>
                  <option value="juara3">Juara 3</option>
                  <option value="harapan1">Harapan 1</option>
                  <option value="harapan2">Harapan 2</option>
                  <option value="harapan3">Harapan 3</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-gray-300">Tingkat Perlombaan</span>
                <select
                  value={level}
                  onChange={e => setLevel(e.target.value)}
                  className="w-full p-2.5 border border-white/10 rounded-xl text-sm focus:border-[#FF7A00] focus:outline-none focus:ring-1 focus:ring-[#FF7A00] bg-[#14161E] text-white font-semibold"
                >
                  <option value="kota">Kota</option>
                  <option value="provinsi">Provinsi</option>
                  <option value="nasional">Nasional</option>
                  <option value="internasional">Internasional</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 5: Students list with newline format */}
          {step === 5 && (
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-white">
                LANGKAH 5: DAFTAR NAMA SISWA PEMENANG
              </label>
              <p className="text-[10px] text-gray-400">
                Format: 1 siswa per baris dengan format: <b>NAMA SISWA (KELAS)</b>. Contoh:<br />
                RISKI SETIAWAN (X.1)<br />
                BELLA PUTRI (X.1)
              </p>
              <textarea
                value={studentsInput}
                onChange={e => setStudentsInput(e.target.value)}
                placeholder="NAMA SISWA (KELAS)&#10;Contoh: RISKI SETIAWAN (X.1)"
                rows={4}
                className="w-full p-3 border border-white/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#FF7A00] focus:border-[#FF7A00] bg-[#14161E] text-xs font-mono uppercase text-white"
                autoFocus
              />
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="px-6 py-4 bg-[#14161E] border-t border-white/10 flex justify-between items-center select-none">
          {step > 1 ? (
            <button
              onClick={handlePrev}
              className="flex items-center gap-1.5 px-4 py-2 border border-white/10 text-gray-300 rounded-full hover:bg-white/5 text-xs font-semibold transition-colors"
              type="button"
            >
              <ArrowLeft size={14} />
              <span>KEMBALI</span>
            </button>
          ) : (
            <div />
          )}

          {step < 5 ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-[#FF7A00] hover:bg-[#E06600] text-white rounded-full text-xs font-semibold shadow-sm transition-colors"
              type="button"
            >
              <span>LANJUT</span>
              <ArrowRight size={14} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="flex items-center gap-1.5 px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-full text-xs font-extrabold shadow-sm transition-colors"
              type="button"
            >
              <Check size={14} />
              <span>TAMBAH</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

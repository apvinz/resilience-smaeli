import React, { useRef, useState } from "react";
import { useData } from "../../context/DataContext";
import { fileToBase64 } from "../../utils/imageUtils";
import { Award, Check, Trash2, Edit2 } from "lucide-react";

interface AchievementCardProps {
  achievement: {
    id: string;
    eventName: string;
    rank: string;
    level: string;
    isCurated: boolean;
    photo: string;
    students: string[];
  };
  onUpdate: (updated: any) => void;
  onDelete: () => void;
  onPreview?: (achievement: any) => void;
}

export const AchievementCard: React.FC<AchievementCardProps> = ({
  achievement,
  onUpdate,
  onDelete,
  onPreview
}) => {
  const { editMode, showToast } = useData();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Card specific inline editor fields
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempText, setTempText] = useState("");

  const handleCardClick = () => {
    if (!editMode && onPreview) {
      onPreview(achievement);
    }
  };

  const handlePhotoDoubleClick = async (e: React.MouseEvent) => {
    if (!editMode) return;
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await fileToBase64(file);
        onUpdate({ ...achievement, photo: base64 });
        showToast("Foto kartu prestasi diperbarui!");
      } catch (err) {
        showToast("Gagal mengubah foto prestasi", "error");
      }
    }
  };

  const startEditing = (field: string, currentVal: string) => {
    if (!editMode) return;
    setEditingField(field);
    setTempText(currentVal);
  };

  const saveInlineField = () => {
    if (editingField === "eventName") {
      onUpdate({ ...achievement, eventName: tempText.trim().toUpperCase() });
    } else if (editingField === "students") {
      const list = tempText.split("\n").map(l => l.trim()).filter(Boolean);
      onUpdate({ ...achievement, students: list });
    }
    setEditingField(null);
    showToast("Data kartu disesuaikan!");
  };

  const toggleCuratedState = () => {
    if (!editMode) return;
    onUpdate({ ...achievement, isCurated: !achievement.isCurated });
    showToast(`Kurasi Puspresnas diubah menjadi: ${!achievement.isCurated ? "YA" : "TIDAK"}`);
  };

  const handleBadgeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [newRank, newLevel] = e.target.value.split(":");
    onUpdate({ ...achievement, rank: newRank, level: newLevel });
    showToast("Badge prestasi disesuaikan!");
    setEditingField(null);
  };

  const displayRankName = (r: string) => {
    const ranks: Record<string, string> = {
      juara1: "Juara 1",
      juara2: "Juara 2",
      juara3: "Juara 3",
      harapan1: "Harapan 1",
      harapan2: "Harapan 2",
      harapan3: "Harapan 3"
    };
    return ranks[r] || r;
  };

  const displayLevelName = (l: string) => {
    const levels: Record<string, string> = {
      kota: "Kota",
      provinsi: "Provinsi",
      nasional: "Nasional",
      internasional: "Internasional"
    };
    return levels[l] || l;
  };

  return (
    <div
      onClick={handleCardClick}
      className={`bg-[#0E1015] border border-white/10 rounded-2xl p-4 shadow-card flex flex-col gap-3 group relative transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[#FF7A00]/5 hover:shadow-lg ${
        editMode 
          ? "ring-2 ring-white/10 hover:ring-[#FF7A00]" 
          : "cursor-pointer hover:border-[#FF7A00]/40"
      }`}
    >
      {/* Photo Wrapper */}
      <div
        className="w-full aspect-[3/4] rounded-xl overflow-hidden bg-white/5 relative cursor-pointer group/photo"
        onDoubleClick={handlePhotoDoubleClick}
        title={editMode ? "Klik ganda untuk ganti gambar" : undefined}
      >
        <img
          src={achievement.photo || "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=600&auto=format&fit=crop"}
          alt={achievement.eventName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {editMode && (
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/photo:opacity-100 flex flex-col items-center justify-center text-[10px] text-white font-medium transition-opacity pointer-events-none text-center p-2 uppercase">
            <span>Klik ganda</span>
            <span>Ganti Gambar</span>
          </div>
        )}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handlePhotoUpload}
          accept="image/*"
          className="hidden"
        />
      </div>

      {/* Badges row */}
      <div className="flex flex-wrap gap-1.5 items-center">
        {/* Juara & Tingkat dropdown select if editing rank level */}
        {editMode && editingField === "badge" ? (
          <select
            defaultValue={`${achievement.rank}:${achievement.level}`}
            onChange={handleBadgeChange}
            onBlur={() => setEditingField(null)}
            className="text-[10px] p-1 font-semibold border border-white/10 rounded bg-[#14161E] text-white focus:outline-none focus:ring-1 focus:ring-[#FF7A00]"
            autoFocus
          >
            <option value="juara1:kota">Juara 1 (Kota)</option>
            <option value="juara1:provinsi">Juara 1 (Provinsi)</option>
            <option value="juara1:nasional">Juara 1 (Nasional)</option>
            <option value="juara1:internasional">Juara 1 (Internasional)</option>

            <option value="juara2:kota">Juara 2 (Kota)</option>
            <option value="juara2:provinsi">Juara 2 (Provinsi)</option>
            <option value="juara2:nasional">Juara 2 (Nasional)</option>
            <option value="juara2:internasional">Juara 2 (Internasional)</option>

            <option value="juara3:kota">Juara 3 (Kota)</option>
            <option value="juara3:provinsi">Juara 3 (Provinsi)</option>
            <option value="juara3:nasional">Juara 3 (Nasional)</option>
            <option value="juara3:internasional">Juara 3 (Internasional)</option>

            <option value="harapan1:kota">Harapan 1 (Kota)</option>
            <option value="harapan1:provinsi">Harapan 1 (Provinsi)</option>
            <option value="harapan1:nasional">Harapan 1 (Nasional)</option>
            <option value="harapan1:internasional">Harapan 1 (Internasional)</option>
            <option value="harapan2:kota">Harapan 2 (Kota)</option>
            <option value="harapan2:provinsi">Harapan 2 (Provinsi)</option>
            <option value="harapan2:nasional">Harapan 2 (Nasional)</option>
            <option value="harapan2:internasional">Harapan 2 (Internasional)</option>

            <option value="harapan3:kota">Harapan 3 (Kota)</option>
            <option value="harapan3:provinsi">Harapan 3 (Provinsi)</option>
            <option value="harapan3:nasional">Harapan 3 (Nasional)</option>
            <option value="harapan3:internasional">Harapan 3 (Internasional)</option>
          </select>
        ) : (
          <button
            type="button"
            onClick={() => startEditing("badge", "")}
            className="text-[10px] tracking-wide font-extrabold uppercase rounded-full px-2.5 py-1 bg-[#FF7A00]/10 text-[#FF7A00] flex items-center gap-0.5"
            disabled={!editMode}
            title={editMode ? "Klik untuk ubah Juara/Tingkat" : undefined}
          >
            <Award size={10} />
            <span>{displayRankName(achievement.rank)} - {displayLevelName(achievement.level)}</span>
          </button>
        )}

        {/* Curation Badge */}
        <button
          type="button"
          onClick={toggleCuratedState}
          className={`text-[9px] tracking-wider font-extrabold uppercase rounded-full px-2 py-1 ${
            achievement.isCurated
              ? "bg-amber-500/15 text-amber-500"
              : "bg-white/5 text-gray-400"
          }`}
          disabled={!editMode}
          title={editMode ? "Klik untuk toggle status kurasi" : "Curation status"}
        >
          {achievement.isCurated ? "TERKURASI PUSPRESNAS" : "UMUM"}
        </button>
      </div>

      {/* Event Name */}
      {editMode && editingField === "eventName" ? (
        <div className="flex items-center gap-1">
          <input
            type="text"
            value={tempText}
            onChange={e => setTempText(e.target.value)}
            className="w-full p-1 text-xs border border-white/10 bg-[#14161E] text-white rounded uppercase font-semibold focus:outline-none focus:ring-1 focus:ring-[#FF7A00]"
            autoFocus
            onKeyDown={e => e.key === "Enter" && saveInlineField()}
          />
          <button
            onClick={saveInlineField}
            className="p-1 text-white bg-green-500 rounded"
            type="button"
          >
            <Check size={12} />
          </button>
        </div>
      ) : (
        <h4
          onClick={() => startEditing("eventName", achievement.eventName)}
          className={`font-extrabold text-xs text-white uppercase tracking-tight line-clamp-2 ${
            editMode ? "underline decoration-dashed decoration-[#FF7A00] cursor-pointer" : ""
          }`}
        >
          {achievement.eventName}
        </h4>
      )}

      {/* Members list */}
      <div className="border-t border-white/5 pt-2 flex-grow">
        {editMode && editingField === "students" ? (
          <div className="space-y-1">
            <span className="text-[9px] text-gray-500">1 siswa per baris: NAMA (KELAS)</span>
            <textarea
              value={tempText}
              onChange={e => setTempText(e.target.value)}
              className="w-full font-mono text-[10px] p-1 border border-white/10 rounded bg-[#14161E] text-white focus:outline-none focus:ring-1 focus:ring-[#FF7A00] uppercase"
              rows={3}
              placeholder="CONTOH (KELAS)"
              autoFocus
            />
            <button
              onClick={saveInlineField}
              className="px-2 py-0.5 text-[10px] text-white bg-green-500 rounded font-semibold w-full"
              type="button"
            >
              Simpan Daftar
            </button>
          </div>
        ) : (
          <div
            onClick={() => startEditing("students", achievement.students.join("\n"))}
            className={`space-y-1 cursor-pointer ${
              editMode ? "bg-white/5 p-1 rounded border border-dashed border-[#FF7A00]/20" : ""
            }`}
            title={editMode ? "Ubah nama pemenang" : undefined}
          >
            {achievement.students.map((student, idx) => (
              <p key={idx} className="text-[11px] text-gray-300 uppercase font-black tracking-wide">
                {student}
              </p>
            ))}
          </div>
        )}
      </div>

      {/* Admin actions (Hapus Button overlay) */}
      {editMode && (
        <div className="absolute top-2 left-2 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={onDelete}
            className="bg-[#EF4444] text-white p-1.5 rounded-full hover:bg-red-600 transition-transform shadow-md duration-200"
            title="Keluar / Hapus kartu ini"
          >
            <Trash2 size={13} />
          </button>
        </div>
      )}
    </div>
  );
};

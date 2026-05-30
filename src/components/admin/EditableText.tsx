import React, { useState, useEffect } from "react";
import { useData } from "../../context/DataContext";

interface EditableTextProps {
  value: string;
  onChange: (newValue: string) => void;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";
  multiline?: boolean;
  editMode?: boolean;
}

export const EditableText: React.FC<EditableTextProps> = ({
  value,
  onChange,
  className = "",
  as = "span",
  multiline = false,
  editMode: editModeProp
}) => {
  const { editMode: contextEditMode } = useData();
  const editMode = editModeProp !== undefined ? editModeProp : contextEditMode;
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  useEffect(() => {
    setTempValue(value);
  }, [value]);

  const handleBlur = () => {
    setIsEditing(false);
    if (tempValue.trim() !== value.trim()) {
      onChange(tempValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !multiline) {
      setIsEditing(false);
      if (tempValue.trim() !== value.trim()) {
        onChange(tempValue);
      }
    } else if (e.key === "Escape") {
      setTempValue(value);
      setIsEditing(false);
    }
  };

  if (editMode && isEditing) {
    if (multiline) {
      return (
        <textarea
          value={tempValue}
          onChange={e => setTempValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={`w-full p-2 bg-[#14161E] text-white border-2 border-[#FF7A00] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#FF7A00] resize-y ${className}`}
          autoFocus
        />
      );
    } else {
      return (
        <input
          type="text"
          value={tempValue}
          onChange={e => setTempValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={`w-full p-1 bg-[#14161E] text-white border-2 border-[#FF7A00] rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF7A00] ${className}`}
          autoFocus
        />
      );
    }
  }

  const Tag = as;

  return (
    <Tag
      onDoubleClick={() => editMode && setIsEditing(true)}
      className={`${className} ${
        editMode
          ? "hover:outline-none hover:border-b hover:border-dashed hover:border-[#FF7A00] hover:bg-amber-500/10 cursor-text select-text"
          : ""
      }`}
      title={editMode ? "Double-click untuk mengubah teks ini" : undefined}
    >
      {value || (editMode ? "[Klik ganda untuk mengetik]" : "")}
    </Tag>
  );
};

import React from "react";
import { Mail, Phone, Instagram } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#07080A] text-white py-12 px-6 border-t border-white/5">
      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left Side: Copyright */}
        <div className="text-center md:text-left">
          <h4 className="font-extrabold text-lg tracking-wider text-[#FF7A00] mb-1">
            ANGKATAN 21 SMAELI
          </h4>
          <p className="text-gray-500 text-xs font-medium">
            &copy; 2026. All Rights Reserved. Apvinz&reg;
          </p>
        </div>

        {/* Right Side: Contact info row */}
        <div className="flex flex-col sm:flex-row items-center gap-6 text-sm">
          {/* Email link */}
          <a
            href="mailto:alp991468@gmail.com"
            className="flex items-center gap-2 text-gray-400 hover:text-[#FF7A00] transition-colors font-medium text-xs sm:text-sm"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Mail size={16} className="text-[#FF7A00]" />
            <span>alp991468@gmail.com</span>
          </a>

          {/* WhatsApp link */}
          <a
            href="https://wa.me/6289528201156"
            className="flex items-center gap-2 text-gray-400 hover:text-[#FF7A00] transition-colors font-medium text-xs sm:text-sm"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Phone size={16} className="text-[#FF7A00]" />
            <span>+62 895-2820-1156</span>
          </a>

          {/* Instagram link */}
          <a
            href="https://instagram.com/apvinz"
            className="flex items-center gap-2 text-gray-400 hover:text-[#FF7A00] transition-colors font-medium text-xs sm:text-sm"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Instagram size={16} className="text-[#FF7A00]" />
            <span>@apvinz</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

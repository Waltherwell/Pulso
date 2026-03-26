import React from "react";

export function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] flex items-end sm:items-center sm:justify-center">
      <div className="w-full sm:max-w-md bg-white rounded-t-[28px] sm:rounded-[28px] shadow-2xl p-5 sm:p-6 animate-[fadeIn_.18s_ease]">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#0F3D3E]/50">
              PULSO
            </p>
            <h3 className="text-lg font-semibold text-[#1E1E1E] mt-1">
              {title}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-2xl bg-[#F4EFE8] text-[#0F3D3E] text-lg font-semibold"
          >
            ×
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}
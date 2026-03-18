export function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-[28px] bg-white shadow-2xl overflow-hidden border border-black/5">
        <div className="px-5 py-4 border-b border-[#0F3D3E]/8 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[#1E1E1E]">{title}</h3>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-2xl bg-[#F4EFE8] text-[#0F3D3E] font-semibold"
          >
            ×
          </button>
        </div>

        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
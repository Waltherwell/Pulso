export function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-[11px] uppercase tracking-[0.16em] text-[#0F3D3E]/55 mb-2">
        {label}
      </span>
      {children}
    </label>
  );
}
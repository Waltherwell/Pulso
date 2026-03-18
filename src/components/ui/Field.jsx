export function Field({ label, children }) {
  return (
    <div>
      <label className="text-xs font-medium uppercase tracking-[0.16em] text-[#0F3D3E]/55">
        {label}
      </label>
      <div className="mt-2">{children}</div>
    </div>
  );
}
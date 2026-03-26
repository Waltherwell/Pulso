export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}) {
  return (
    <div className="rounded-3xl bg-white border border-[#0F3D3E]/10 p-6 text-center shadow-sm">
      <div className="w-14 h-14 mx-auto rounded-2xl bg-[#F4EFE8] border border-[#0F3D3E]/10 flex items-center justify-center text-[#0F3D3E] text-lg font-semibold">
        +
      </div>

      <h3 className="text-base font-semibold text-[#0F3D3E] mt-4">
        {title}
      </h3>

      <p className="text-sm text-[#0F3D3E]/65 mt-2 leading-6 max-w-[280px] mx-auto">
        {description}
      </p>

      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="mt-5 rounded-2xl bg-[#0F3D3E] text-white px-5 py-3 text-sm font-semibold shadow-sm"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
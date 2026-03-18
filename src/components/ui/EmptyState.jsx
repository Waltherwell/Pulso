export function EmptyState({ title, description, actionLabel, onAction }) {
  return (
    <div className="rounded-3xl bg-[#F4EFE8] p-6 text-center">
      <div className="w-14 h-14 rounded-3xl bg-white flex items-center justify-center mx-auto text-[#0F3D3E] text-xl shadow-sm">
        ✦
      </div>

      <h3 className="text-lg font-semibold text-[#1E1E1E] mt-4">{title}</h3>
      <p className="text-sm text-[#1E1E1E]/65 leading-6 mt-2">{description}</p>

      {actionLabel ? (
        <button
          onClick={onAction}
          className="mt-5 rounded-2xl bg-[#0F3D3E] text-white px-4 py-3 text-sm font-semibold"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
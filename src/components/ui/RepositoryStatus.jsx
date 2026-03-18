export function RepositoryStatus({ repository, syncMessage, onReset }) {
  return (
    <div className="mb-4 rounded-3xl bg-white border border-[#0F3D3E]/10 px-4 py-3 shadow-sm flex items-center justify-between gap-3">
      <div>
        <p className="text-[11px] uppercase tracking-[0.18em] text-[#0F3D3E]/55">
          Camada de dados
        </p>
        <p className="text-sm font-medium text-[#1E1E1E] mt-1">
          {repository.name}
        </p>
        <p className="text-xs text-[#1E1E1E]/55 mt-1">{syncMessage}</p>
      </div>

      <button
        onClick={onReset}
        className="rounded-2xl bg-[#F4EFE8] px-3 py-2 text-xs font-semibold text-[#0F3D3E]"
      >
        Limpar base
      </button>
    </div>
  );
}
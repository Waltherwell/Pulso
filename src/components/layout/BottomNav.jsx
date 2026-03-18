import { cx } from "../../utils/cx";

export function BottomNav({ active, onNavigate }) {
  const items = ["Dashboard", "Clientes", "Agenda", "Vendas"];

  return (
    <div className="px-4 pb-4 pt-2 border-t border-[#0F3D3E]/8 bg-white">
      <div className="grid grid-cols-4 gap-2 rounded-3xl bg-[#F4EFE8] p-2">
        {items.map((item) => {
          const isActive = item === active;

          return (
            <button
              key={item}
              onClick={() => onNavigate(item)}
              className={cx(
                "rounded-2xl px-2 py-3 text-[11px] font-medium transition",
                isActive
                  ? "bg-[#0F3D3E] text-white shadow-sm"
                  : "text-[#0F3D3E]/70"
              )}
            >
              {item}
            </button>
          );
        })}
      </div>
    </div>
  );
}
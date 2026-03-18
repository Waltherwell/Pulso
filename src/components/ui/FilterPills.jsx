import { cx } from "../../utils/cx";

export function FilterPills({ items, active, onChange }) {
  return (
    <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
      {items.map((item) => (
        <button
          key={item}
          onClick={() => onChange(item)}
          className={cx(
            "px-3.5 py-2 rounded-full text-xs font-medium whitespace-nowrap",
            item === active
              ? "bg-[#0F3D3E] text-white"
              : "bg-[#F4EFE8] text-[#0F3D3E]"
          )}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
import { cx } from "../../utils/cx";

export function PulsoMark({ dark = false }) {
  return (
    <div
      className={cx(
        "relative w-11 h-11 rounded-2xl flex items-center justify-center",
        dark ? "bg-white/10" : "bg-[#0F3D3E]"
      )}
    >
      <div className="relative w-6 h-8">
        <div className="absolute left-0 top-0 w-3 h-8 rounded-l-full rounded-r-[10px] bg-white" />
        <div className="absolute right-0 top-0 w-4 h-5 border-[6px] border-white rounded-full" />
        <div className="absolute right-[2px] top-[6px] w-2.5 h-2.5 rounded-full bg-[#2ECF8F] border-2 border-[#0F3D3E]" />
      </div>
    </div>
  );
}
import { cx } from "../../utils/cx";

export function Select(props) {
  return (
    <select
      {...props}
      className={cx(
        "w-full rounded-2xl bg-[#F4EFE8] px-4 py-3 text-sm text-[#1E1E1E] outline-none border border-transparent focus:border-[#0F3D3E]/20",
        props.className
      )}
    />
  );
}
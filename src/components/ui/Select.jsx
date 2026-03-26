import React from "react";
import { cx } from "../../utils/cx";

export const Select = React.forwardRef(function Select(
  { className, children, ...props },
  ref
) {
  return (
    <select
      ref={ref}
      {...props}
      className={cx(
        "w-full rounded-2xl bg-[#F4EFE8] border border-[#0F3D3E]/10 px-4 py-3.5 text-sm text-[#0F3D3E] outline-none focus:border-[#0F3D3E]/30 focus:bg-white transition",
        className
      )}
    >
      {children}
    </select>
  );
});
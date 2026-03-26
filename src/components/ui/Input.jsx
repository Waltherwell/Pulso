import React from "react";
import { cx } from "../../utils/cx";

export const Input = React.forwardRef(function Input(
  { className, ...props },
  ref
) {
  return (
    <input
      ref={ref}
      {...props}
      className={cx(
        "w-full rounded-2xl bg-[#F4EFE8] border border-[#0F3D3E]/10 px-4 py-3.5 text-sm text-[#0F3D3E] placeholder:text-[#0F3D3E]/40 outline-none focus:border-[#0F3D3E]/30 focus:bg-white transition",
        className
      )}
    />
  );
});
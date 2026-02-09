
import React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-[#D4D8D0] bg-[#F0F2EE] px-3 py-2 text-sm text-[#2C3E2E] placeholder:text-[#6B7C6B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B9E7D] focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 transition-all",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = "Input";

export { Input };


import React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-[#E2D7C3] bg-[#FFFBF3] px-3 py-2 text-sm text-[#2A2420] placeholder:text-[#6F655A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D8401F] focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 transition-all",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = "Input";

export { Input };

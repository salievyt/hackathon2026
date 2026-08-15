import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "dark" | "neutral";
}

export function Badge({ className, variant = "primary", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center text-eyebrow rounded-pill px-3 py-2",
        {
          "bg-primary-soft text-primary": variant === "primary",
          "bg-[rgba(67,83,254,0.14)] text-primary-on-dark": variant === "dark",
          "bg-canvas-muted text-ink-muted": variant === "neutral",
        },
        className
      )}
      {...props}
    />
  );
}

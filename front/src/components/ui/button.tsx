import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "secondary-dark" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center transition-all duration-[160ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-3 active:scale-[0.97]",
          {
            // Primary
            "bg-primary text-on-primary text-body-strong rounded-pill px-6 py-3 min-h-[48px] hover:bg-primary-hover active:bg-primary-active": variant === "primary",
            // Secondary
            "bg-transparent text-ink border border-border-strong text-body-strong rounded-pill px-6 py-3 min-h-[48px] hover:border-primary hover:text-primary": variant === "secondary",
            // Secondary Dark
            "bg-transparent text-on-dark border border-border-on-dark text-body-strong rounded-pill px-6 py-3 min-h-[48px] hover:border-primary hover:text-primary": variant === "secondary-dark",
            // Icon
            "w-[44px] h-[44px] rounded-full bg-canvas-muted text-ink hover:bg-canvas-soft": variant === "icon",
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };

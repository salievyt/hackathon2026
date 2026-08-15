import * as React from "react";
import { cn } from "@/lib/utils";

// Showcase Card
export function ShowcaseCard({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("bg-canvas border border-border rounded-xl p-8", className)} {...props}>
      {children}
    </div>
  );
}

// Feature Card
export function FeatureCard({
  icon: Icon,
  title,
  description,
  className
}: {
  icon: React.ElementType;
  title: React.ReactNode;
  description: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("bg-canvas-soft border-none rounded-lg p-8", className)}>
      <div className="w-12 h-12 rounded-md bg-primary-soft text-primary flex items-center justify-center mb-6">
        <Icon size={24} />
      </div>
      <h3 className="text-heading mb-3 text-ink">{title}</h3>
      <p className="text-body text-ink-muted">{description}</p>
    </div>
  );
}

// Metric Card
export function MetricCard({ number, label, className }: { number: string; label: string; className?: string }) {
  return (
    <div className={cn("bg-ink text-on-dark rounded-xl p-8", className)}>
      <div className="text-[48px] font-bold leading-none tracking-[-2px] font-sans mb-2 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-primary inline-block shrink-0"></span>
        {number}
      </div>
      <div className="text-label text-on-dark-muted uppercase tracking-wide">{label}</div>
    </div>
  );
}

// Code Card
export function CodeCard({ children, className }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("bg-surface-dark text-on-dark rounded-xl p-6 border border-border-on-dark border-t-[2px] border-t-primary text-code", className)}>
      {children}
    </div>
  );
}

// Glass Card
export function GlassCard({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("bg-[rgba(255,255,255,0.72)] backdrop-blur-[20px] saturate-180 border border-[rgba(255,255,255,0.45)] rounded-xl", className)}
      {...props}
    >
      {children}
    </div>
  );
}

import { cn } from "@/lib/utils";

export function SectionHeader({
  eyebrow,
  title,
  description,
  isDark = false,
  className
}: {
  eyebrow: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  isDark?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("mb-[56px]", className)}>
      <div className="text-eyebrow text-primary mb-6">{eyebrow}</div>
      <h2 className={cn("text-display-lg max-w-[800px] mb-6", isDark ? "text-on-dark" : "text-ink")}>
        {title}
      </h2>
      {description && (
        <p className={cn("text-lead max-w-[680px]", isDark ? "text-on-dark-muted" : "text-ink-muted")}>
          {description}
        </p>
      )}
    </div>
  );
}

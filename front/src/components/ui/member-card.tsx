import Image from "next/image";
import { cn } from "@/lib/utils";
import type { MemberItem } from "@/lib/api";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function MemberAvatar({ member }: { member: MemberItem }) {
  const className = "w-24 h-24 rounded-full object-cover mb-5 mx-auto";

  if (!member.avatar) {
    return (
      <div className="w-24 h-24 rounded-full bg-primary-soft text-primary flex items-center justify-center text-display-md font-bold mb-5 mx-auto">
        {initials(member.name)}
      </div>
    );
  }

  return (
    <Image
      src={member.avatar}
      alt={member.name}
      width={400}
      height={400}
      unoptimized
      className={className}
    />
  );
}

export function MemberCard({
  member,
  dark = false,
}: {
  member: MemberItem;
  dark?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-xl p-8 text-center",
        dark
          ? "bg-surface-dark-2 border border-border-on-dark"
          : "bg-canvas-soft border-none"
      )}
    >
      <MemberAvatar member={member} />
      <h3 className={cn("text-heading mb-2", dark ? "text-on-dark" : "text-ink")}>
        {member.name}
      </h3>
      <p className={cn("text-body", dark ? "text-on-dark-muted" : "text-ink-muted")}>
        {member.role}
      </p>
      {member.company && (
        <p
          className={cn(
            "text-caption mt-2 font-mono uppercase tracking-widest",
            dark ? "text-on-dark-muted" : "text-ink-muted"
          )}
        >
          {member.company}
        </p>
      )}
    </div>
  );
}

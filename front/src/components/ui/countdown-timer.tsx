"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { DEFAULT_EVENT_START } from "@/lib/config";
import { fetchConfigClient } from "@/lib/api";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function getTimeLeft(deadline: number): TimeLeft {
  const diff = Math.max(0, deadline - Date.now());
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor(diff / 3_600_000) % 24,
    minutes: Math.floor(diff / 60_000) % 60,
    seconds: Math.floor(diff / 1_000) % 60,
  };
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}

export function CountdownTimer() {
  const t = useTranslations("Timer");
  const [deadline, setDeadline] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    let cancelled = false;

    const resolveDeadline = async () => {
      let target = Date.parse(DEFAULT_EVENT_START);
      const config = await fetchConfigClient();
      if (config?.event_start) {
        target = Date.parse(config.event_start);
      }
      if (!cancelled) {
        setDeadline(target);
      }
    };

    resolveDeadline();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (deadline === null) {
      return;
    }
    const tick = () => setTimeLeft(getTimeLeft(deadline));
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [deadline]);

  if (!timeLeft) {
    return null;
  }

  const units = [
    { label: t("days"), value: pad(timeLeft.days) },
    { label: t("hours"), value: pad(timeLeft.hours) },
    { label: t("minutes"), value: pad(timeLeft.minutes) },
    { label: t("seconds"), value: pad(timeLeft.seconds) },
  ];

  return (
    <div className="mt-16 w-full max-w-[720px] mx-auto">
      <p className="text-eyebrow text-primary text-center mb-4">
        [{t("eyebrow")}]
      </p>
      <div className="bg-surface-dark rounded-2xl border border-border-on-dark px-6 py-8 grid grid-cols-4 gap-4">
        {units.map((unit, index) => (
          <div key={unit.label} className="relative text-center">
            {index > 0 && (
              <span className="absolute left-[-12px] top-1/2 -translate-y-1/2 text-border-on-dark select-none">
                :
              </span>
            )}
            <div className="text-display-md text-on-dark font-bold tabular-nums">
              {unit.value}
            </div>
            <div className="text-caption text-on-dark-muted uppercase tracking-widest mt-1">
              {unit.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

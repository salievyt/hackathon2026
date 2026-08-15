"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";

const STORAGE_KEY = "cookie-consent";

export function CookieBanner() {
  const t = useTranslations("Cookie");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(!localStorage.getItem(STORAGE_KEY));
  }, []);

  const decide = (choice: "accepted" | "declined") => {
    localStorage.setItem(STORAGE_KEY, choice);
    setVisible(false);
  };

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[min(92vw,520px)] bg-surface-dark text-on-dark border border-border-on-dark rounded-xl p-6 shadow-floating">
      <p className="text-body text-on-dark mb-5">{t("text")}</p>
      <div className="flex items-center gap-3 flex-wrap">
        <Button variant="primary" onClick={() => decide("accepted")}>
          {t("accept")}
        </Button>
        <Button variant="secondary-dark" onClick={() => decide("declined")}>
          {t("decline")}
        </Button>
      </div>
      <Link
        href="/privacy"
        className="inline-block mt-4 text-caption text-on-dark-muted hover:text-on-dark underline underline-offset-4 transition-colors"
      >
        {t("privacy")}
      </Link>
    </div>
  );
}

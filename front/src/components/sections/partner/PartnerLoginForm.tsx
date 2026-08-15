"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { Button } from "@/components/ui/button";

export function PartnerLoginForm() {
  const t = useTranslations("PartnerAuth");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    try {
      const response = await fetch("/api/partner/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        router.push("/partners/dashboard");
      } else {
        setError(t("error"));
      }
    } catch (err) {
      console.error(err);
      setError(t("error"));
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-md border border-border bg-canvas-soft text-ink text-body focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors";

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-canvas-soft border border-border rounded-2xl p-8 shadow-soft max-w-[420px] mx-auto"
    >
      <div className="space-y-5 mb-8">
        <div>
          <label className="block text-label text-ink mb-2" htmlFor="email">
            {t("email")}
          </label>
          <input required type="email" id="email" name="email" className={inputClass} autoComplete="email" />
        </div>
        <div>
          <label className="block text-label text-ink mb-2" htmlFor="password">
            {t("password")}
          </label>
          <input required type="password" id="password" name="password" className={inputClass} autoComplete="current-password" />
        </div>
      </div>

      <Button variant="primary" type="submit" className="w-full text-label text-on-dark" disabled={loading}>
        {loading ? "..." : t("submit")}
      </Button>

      {error && <p className="mt-4 text-body-strong text-error">{error}</p>}
    </form>
  );
}

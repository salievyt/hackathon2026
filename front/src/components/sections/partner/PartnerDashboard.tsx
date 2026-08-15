"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import type { PartnerMe } from "@/lib/api";

type State =
  | { kind: "loading" }
  | { kind: "unauthorized" }
  | { kind: "ready"; me: PartnerMe };

export function PartnerDashboard() {
  const t = useTranslations("PartnerDashboard");
  const locale = useLocale();
  const router = useRouter();
  const [state, setState] = useState<State>({ kind: "loading" });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const load = useCallback(async () => {
    setState({ kind: "loading" });
    try {
      const res = await fetch(`/api/partner/me?locale=${locale}`);
      if (res.status === 401) {
        setState({ kind: "unauthorized" });
        return;
      }
      const me = (await res.json()) as PartnerMe;
      setState({ kind: "ready", me });
    } catch (error) {
      console.error(error);
      setState({ kind: "unauthorized" });
    }
  }, [locale]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    const formData = new FormData(e.currentTarget);
    formData.delete("logo");
    if (e.currentTarget.logo?.files?.[0]) {
      formData.set("logo", e.currentTarget.logo.files[0]);
    }

    try {
      const res = await fetch(`/api/partner/me?locale=${locale}`, {
        method: "PATCH",
        body: formData,
      });
      if (res.ok) {
        const me = (await res.json()) as PartnerMe;
        setState({ kind: "ready", me });
        setSaved(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/partner/logout", { method: "POST" });
    router.push("/partners/login");
  };

  if (state.kind === "loading") {
    return <p className="text-center text-body text-ink-muted py-24">…</p>;
  }

  if (state.kind === "unauthorized") {
    return (
      <div className="text-center py-24">
        <h2 className="text-display-md mb-4">{t("notAuthenticated")}</h2>
        <Link href="/partners/login">
          <Button variant="primary" className="text-label text-on-dark">
            {t("goToLogin")}
          </Button>
        </Link>
      </div>
    );
  }

  const { me } = state;
  const inputClass =
    "w-full px-4 py-3 rounded-md border border-border bg-canvas-soft text-ink text-body focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors";

  return (
    <div className="max-w-[980px] mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-12">
        <div>
          <div className="text-eyebrow text-primary mb-3">[{t("eyebrow")}]</div>
          <h2 className="text-display-md mb-1">{me.name}</h2>
          <p className="text-body text-ink-muted">{me.email}</p>
        </div>
        <Button variant="secondary" className="text-label" onClick={handleLogout}>
          {t("logout")}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-canvas-soft border border-border rounded-xl p-6">
          <div className="text-display-md text-primary mb-1">
            {me.participant_count}+
          </div>
          <div className="text-caption text-ink-muted">{t("participantsLabel")}</div>
        </div>
        <div className="bg-canvas-soft border border-border rounded-xl p-6">
          <div className="text-display-md text-primary mb-1">
            {me.lead ? me.lead.status : "—"}
          </div>
          <div className="text-caption text-ink-muted">{t("leadLabel")}</div>
          {me.lead && (
            <p className="text-caption text-ink-muted mt-2">
              {me.lead.company}
              {me.lead.package ? ` · ${me.lead.package}` : ""}
            </p>
          )}
        </div>
        <div className="bg-canvas-soft border border-border rounded-xl p-6">
          <div className="text-display-md text-primary mb-1">
            {me.partner ? me.partner.name : "—"}
          </div>
          <div className="text-caption text-ink-muted">{t("cardLabel")}</div>
        </div>
      </div>

      <form
        onSubmit={handleSave}
        className="bg-canvas-soft border border-border rounded-2xl p-8 shadow-soft"
      >
        <h3 className="text-heading mb-6">{t("editTitle")}</h3>
        <div className="space-y-5">
          <div>
            <label className="block text-label text-ink mb-2" htmlFor="name">
              {t("companyLabel")}
            </label>
            <input
              type="text"
              id="name"
              name="name"
              defaultValue={me.partner?.name ?? ""}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-label text-ink mb-2" htmlFor="url">
              {t("urlLabel")}
            </label>
            <input
              type="url"
              id="url"
              name="url"
              defaultValue={me.partner?.url ?? ""}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-label text-ink mb-2" htmlFor="order">
              {t("orderLabel")}
            </label>
            <input
              type="number"
              id="order"
              name="order"
              defaultValue={me.partner?.order ?? 0}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-label text-ink mb-2" htmlFor="logo">
              {t("logoLabel")}
            </label>
            {me.partner?.logo && (
              <div className="mb-3">
                <Image
                  src={me.partner.logo}
                  alt={me.partner.name}
                  width={400}
                  height={160}
                  unoptimized
                  className="h-12 w-auto object-contain"
                />
              </div>
            )}
            <input
              type="file"
              id="logo"
              name="logo"
              accept="image/*"
              className={inputClass}
            />
          </div>
        </div>

        <div className="mt-8 flex items-center gap-4">
          <Button variant="primary" type="submit" className="text-label text-on-dark" disabled={saving}>
            {saving ? "..." : t("save")}
          </Button>
          {saved && <span className="text-body-strong text-success">{t("saved")}</span>}
        </div>
      </form>
    </div>
  );
}

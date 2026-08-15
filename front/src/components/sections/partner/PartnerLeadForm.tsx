"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import type { PartnerPackageItem } from "@/lib/api";

export function PartnerLeadForm({ packages }: { packages: PartnerPackageItem[] }) {
  const t = useTranslations("PartnersPage");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setStatus("idle");

    const formData = new FormData(e.currentTarget);
    const data = {
      company: formData.get("company"),
      contact_name: formData.get("contact_name"),
      contact_email: formData.get("contact_email"),
      contact_phone: formData.get("contact_phone") ?? "",
      package: formData.get("package") ? Number(formData.get("package")) : null,
      message: formData.get("message") ?? "",
    };

    try {
      const response = await fetch("/api/partner-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      setStatus(response.ok ? "success" : "error");
    } catch (error) {
      console.error(error);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-md border border-border bg-canvas-soft text-ink text-body focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors";

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-canvas-soft border border-border rounded-2xl p-8 shadow-soft"
    >
      <div className="space-y-5 mb-8">
        <div>
          <label className="block text-label text-ink mb-2" htmlFor="company">
            {t("applyCompany")}
          </label>
          <input required type="text" id="company" name="company" className={inputClass} />
        </div>
        <div>
          <label className="block text-label text-ink mb-2" htmlFor="contact_name">
            {t("applyName")}
          </label>
          <input required type="text" id="contact_name" name="contact_name" className={inputClass} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-label text-ink mb-2" htmlFor="contact_email">
              {t("applyEmail")}
            </label>
            <input required type="email" id="contact_email" name="contact_email" className={inputClass} />
          </div>
          <div>
            <label className="block text-label text-ink mb-2" htmlFor="contact_phone">
              {t("applyPhone")}
            </label>
            <input type="tel" id="contact_phone" name="contact_phone" className={inputClass} />
          </div>
        </div>
        <div>
          <label className="block text-label text-ink mb-2" htmlFor="package">
            {t("applyPackage")}
          </label>
          <select id="package" name="package" className={inputClass}>
            <option value="">{t("applyAnyPackage")}</option>
            {packages.map((pkg) => (
              <option key={pkg.id} value={pkg.id}>
                {pkg.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-label text-ink mb-2" htmlFor="message">
            {t("applyMessage")}
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            className={inputClass}
          />
        </div>
      </div>

      <Button variant="primary" type="submit" className="w-full text-label text-on-dark" disabled={loading}>
        {loading ? "..." : t("applySubmit")}
      </Button>

      {status === "success" && (
        <p className="mt-4 text-body-strong text-success">{t("applySuccess")}</p>
      )}
      {status === "error" && (
        <p className="mt-4 text-body-strong text-error">{t("applyError")}</p>
      )}
    </form>
  );
}

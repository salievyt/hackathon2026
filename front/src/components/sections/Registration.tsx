"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useTranslations } from 'next-intl';

export function RegistrationSection() {
  const t = useTranslations('Registration');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      telegram: formData.get("telegram"),
      role: formData.get("role"),
    };

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSuccess(true);
      } else {
        const payload = await response.json();
        setError(t(payload.error?.telegram ? 'telegramError' : 'submitError'));
      }
    } catch (error) {
      setError(t("submitError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="register" className="bg-primary py-[160px] px-8 text-on-primary">
      <div className="max-w-[760px] mx-auto text-center">
        <div className="text-eyebrow text-primary-soft mb-6">[{t('eyebrow')}]</div>
        <h2 className="text-display-lg mb-6 text-on-primary">{t('title')}</h2>
        <p className="text-lead text-primary-subtle mb-12">{t('description')}</p>

        {success ? (
          <div className="bg-surface-elevated text-ink p-8 rounded-xl max-w-[448px] mx-auto">
            <h3 className="text-heading text-success mb-2">✓ {t('success')}</h3>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-surface text-ink p-8 rounded-xl max-w-[448px] mx-auto text-left shadow-soft">
            <div className="space-y-6 mb-8">
              <div>
                <label className="block text-label text-ink mb-2" htmlFor="name">{t('name')}</label>
                <input required type="text" id="name" name="name" className="w-full px-4 py-3 rounded-md border border-border bg-canvas-soft text-ink text-body focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" />
              </div>
              <div>
                <label className="block text-label text-ink mb-2" htmlFor="telegram">{t('telegram')}</label>
                <input required type="text" autoCapitalize="none" spellCheck={false} maxLength={100} placeholder="@username / https://t.me/username" id="telegram" name="telegram" className="w-full px-4 py-3 rounded-md border border-border bg-canvas-soft text-ink text-body focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" />
              </div>
              <div>
                <label className="block text-label text-ink mb-2" htmlFor="email">{t('email')}</label>
                <input required type="email" id="email" name="email" className="w-full px-4 py-3 rounded-md border border-border bg-canvas-soft text-ink text-body focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" />
              </div>
              <div>
                <label className="block text-label text-ink mb-2" htmlFor="role">{t('role')}</label>
                <select required id="role" name="role" className="w-full px-4 py-3 rounded-md border border-border bg-canvas-soft text-ink text-body focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors">
                  <option value="developer">{t('roleDeveloper')}</option>
                  <option value="designer">{t('roleDesigner')}</option>
                  <option value="product">{t('roleProduct')}</option>
                  <option value="student">{t('roleStudent')}</option>
                </select>
              </div>
            </div>
            {error && <p role="alert" className="mb-4">{error}</p>}
            <Button variant="primary" type="submit" className="w-full text-label text-on-dark" disabled={loading}>
              {loading ? "..." : t('submit')}
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}

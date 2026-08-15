import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PartnerLeadForm } from "@/components/sections/partner/PartnerLeadForm";
import { fetchPartnerSection } from "@/lib/api";
import type { PartnerPackageItem } from "@/lib/api";

export default async function PartnersPage() {
  const t = await getTranslations("PartnersPage");
  const locale = await getLocale();
  const section = await fetchPartnerSection(locale);

  const description = section?.description ?? t("fallbackDescription");
  const contactName = section?.contact_name ?? "";
  const contactEmail = section?.contact_email ?? "";
  const contactPhone = section?.contact_phone ?? "";
  const advantages = section?.advantages ?? [];
  const packages = section?.packages ?? [];
  const assets = section?.assets ?? [];

  return (
    <>
      <Navbar />
      <main className="bg-canvas">
        <section className="bg-surface-dark text-on-dark px-8 pt-24 pb-20">
          <div className="max-w-[1280px] mx-auto">
            <div className="text-eyebrow text-primary-on-dark mb-6">
              [{t("eyebrow")}]
            </div>
            <h1 className="text-display-xl mb-4">{t("title")}</h1>
            <p className="text-lead text-on-dark-muted max-w-[680px] mb-8">
              {description}
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <a href="#apply">
                <span className="inline-flex items-center px-6 py-3 rounded-md bg-primary text-on-dark text-label hover:bg-primary-hover transition-colors">
                  {t("applyCta")}
                </span>
              </a>
              <Link href="/partners/login">
                <span className="inline-flex items-center px-6 py-3 rounded-md border border-border-on-dark text-on-dark text-label hover:border-on-dark transition-colors">
                  {t("loginCta")}
                </span>
              </Link>
            </div>
          </div>
        </section>

        <section className="px-8 py-24">
          <div className="max-w-[1280px] mx-auto">
            <div className="text-eyebrow text-primary mb-4">[benefits]</div>
            <h2 className="text-display-lg text-ink mb-16">{t("advantagesTitle")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {advantages.map((advantage) => (
                <div
                  key={advantage.id}
                  className="bg-canvas-soft border border-border rounded-xl p-6"
                >
                  <div className="text-heading text-ink mb-3">{advantage.title}</div>
                  <p className="text-body text-ink-muted">{advantage.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-canvas-soft px-8 py-24">
          <div className="max-w-[1280px] mx-auto">
            <div className="text-eyebrow text-primary mb-4">[packages]</div>
            <h2 className="text-display-lg text-ink mb-4">{t("packagesTitle")}</h2>
            <p className="text-lead text-ink-muted max-w-[640px] mb-16">
              {t("packagesSubtitle")}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {packages.map((pkg: PartnerPackageItem) => (
                <div
                  key={pkg.id}
                  className="bg-canvas border border-border rounded-2xl p-8 shadow-soft"
                >
                  <div className="text-eyebrow text-primary mb-3">0{pkg.order + 1}</div>
                  <h3 className="text-heading text-ink mb-3">{pkg.label}</h3>
                  <p className="text-body text-ink-muted mb-6">{pkg.description}</p>
                  <ul className="space-y-3">
                    {pkg.perks.map((perk, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="shrink-0 w-5 h-5 rounded-full bg-primary-soft text-primary text-xs flex items-center justify-center font-bold">
                          ✓
                        </span>
                        <span className="text-body text-ink">{perk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {assets.length > 0 && (
          <section className="px-8 py-24">
            <div className="max-w-[1280px] mx-auto">
              <div className="text-eyebrow text-primary mb-4">[assets]</div>
              <h2 className="text-display-lg text-ink mb-4">{t("assetsTitle")}</h2>
              <p className="text-lead text-ink-muted max-w-[640px] mb-16">
                {t("assetsSubtitle")}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {assets.map((asset) => (
                  <a
                    key={asset.id}
                    href={asset.file}
                    download
                    target="_blank"
                    rel="noreferrer"
                    className="bg-canvas-soft border border-border rounded-xl p-6 flex items-center justify-between hover:border-primary transition-colors"
                  >
                    <span className="text-label text-ink">{asset.title}</span>
                    <span className="text-primary font-mono">↓</span>
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="px-8 py-24">
          <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div id="apply">
              <div className="text-eyebrow text-primary mb-4">[apply]</div>
              <h2 className="text-display-lg text-ink mb-4">{t("applyTitle")}</h2>
              <p className="text-lead text-ink-muted mb-8">{t("applySubtitle")}</p>
              <div className="bg-canvas-soft border border-border rounded-xl p-6 space-y-3">
                <div className="text-label text-ink">{contactName}</div>
                <div>
                  <a href={`mailto:${contactEmail}`} className="text-body text-primary hover:underline">
                    {contactEmail}
                  </a>
                </div>
                {contactPhone && <div className="text-body text-ink-muted">{contactPhone}</div>}
              </div>
            </div>
            <PartnerLeadForm packages={packages} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

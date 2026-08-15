import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { fetchBrandBook } from "@/lib/api";
import type { BrandColorItem, BrandTypeItem, BrandRuleItem } from "@/lib/api";

function isLightColor(hex: string): boolean {
  const value = hex.replace("#", "");
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return 0.299 * r + 0.587 * g + 0.114 * b > 160;
}

function ColorSwatch({ color }: { color: BrandColorItem }) {
  const light = isLightColor(color.hex);
  return (
    <div className="rounded-xl overflow-hidden border border-border bg-canvas-soft">
      <div
        className="h-36 flex items-end p-4"
        style={{ backgroundColor: color.hex }}
      >
        <span
          className="text-caption font-mono font-semibold"
          style={{ color: light ? "#0B0D17" : "#FFFFFF" }}
        >
          {color.hex}
        </span>
      </div>
      <div className="p-4">
        <div className="text-label text-ink mb-1">{color.label}</div>
        <div className="text-caption text-ink-muted">{color.usage}</div>
      </div>
    </div>
  );
}

function TypeSpecimen({ entry, mono }: { entry: BrandTypeItem; mono: string }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-10 py-8 border-b border-border-on-dark last:border-0">
      <div
        className={`w-full md:w-64 shrink-0 text-on-dark leading-none ${
          entry.mono ? mono : ""
        }`}
        style={{
          fontSize: entry.size,
          fontWeight: entry.weight,
          letterSpacing: entry.tracking,
        }}
      >
        Aa
      </div>
      <div className="flex-1">
        <div className="text-label text-on-dark">{entry.label}</div>
        <div className="text-caption text-on-dark-muted font-mono mt-2">
          {entry.size} / {entry.weight} / {entry.tracking}
        </div>
      </div>
    </div>
  );
}

function RuleCard({ rule, index }: { rule: BrandRuleItem; index: number }) {
  const isDo = rule.kind === "do";
  return (
    <div
      className={`flex items-start gap-4 p-6 rounded-xl border ${
        isDo ? "bg-primary-subtle border-primary" : "bg-canvas-soft border-border"
      }`}
    >
      <span
        className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${
          isDo ? "bg-primary text-on-primary" : "bg-ink-muted text-on-dark"
        }`}
      >
        {isDo ? "✓" : "✕"}
      </span>
      <p className="text-body text-ink">{rule.text}</p>
    </div>
  );
}

export default async function BrandBookPage() {
  const t = await getTranslations("BrandBook");
  const locale = await getLocale();
  const brand = await fetchBrandBook(locale);

  const name = brand?.name ?? t("fallbackName");
  const tagline = brand?.tagline ?? t("fallbackTagline");
  const description = brand?.description ?? t("fallbackDescription");
  const logo = brand?.logo ?? null;
  const fontFamily = brand?.font_family ?? "Inter";
  const fontMono = brand?.font_mono ?? "JetBrains Mono";
  const colors = brand?.colors ?? [];
  const typeScale = brand?.type_scale ?? [];
  const doRules = (brand?.rules ?? []).filter((rule) => rule.kind === "do");
  const dontRules = (brand?.rules ?? []).filter((rule) => rule.kind === "dont");

  return (
    <>
      <Navbar />
      <main className="bg-canvas">
        <section className="bg-surface-dark text-on-dark px-8 pt-24 pb-20">
          <div className="max-w-[1280px] mx-auto">
            <div className="text-eyebrow text-primary-on-dark mb-6">
              [{t("eyebrow")}]
            </div>
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-12">
              <div>
                <h1 className="text-display-xl mb-4">{name}</h1>
                <p className="text-lead text-on-dark-muted max-w-[560px]">
                  {tagline}
                </p>
                <p className="text-body text-on-dark-muted max-w-[640px] mt-6">
                  {description}
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 mt-8 text-label text-primary-on-dark hover:text-on-dark transition-colors"
                >
                  <span aria-hidden>←</span>
                  {t("backHome")}
                </Link>
              </div>
              {logo ? (
                <Image
                  src={logo}
                  alt={name}
                  width={200}
                  height={72}
                  className="w-auto h-16 shrink-0"
                  unoptimized
                />
              ) : (
                <Image
                  src="/logo.svg"
                  alt={name}
                  width={200}
                  height={72}
                  className="w-auto h-16 shrink-0"
                />
              )}
            </div>
          </div>
        </section>

        <section className="px-8 py-24">
          <div className="max-w-[1280px] mx-auto">
            <div className="text-eyebrow text-primary mb-4">[colors]</div>
            <h2 className="text-display-lg text-ink mb-4">{t("colorsTitle")}</h2>
            <p className="text-lead text-ink-muted max-w-[640px] mb-16">
              {t("colorsSubtitle")}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {colors.map((color) => (
                <ColorSwatch key={color.id} color={color} />
              ))}
            </div>
          </div>
        </section>

        <section className="bg-surface-dark text-on-dark px-8 py-24">
          <div className="max-w-[1280px] mx-auto">
            <div className="text-eyebrow text-primary-on-dark mb-4">
              [typography]
            </div>
            <h2 className="text-display-lg mb-4">{t("typographyTitle")}</h2>
            <p className="text-lead text-on-dark-muted max-w-[640px] mb-16">
              {t("typographySubtitle")}
            </p>

            <div className="flex flex-wrap gap-8 mb-16">
              <div className="rounded-xl border border-border-on-dark px-6 py-4">
                <div className="text-caption text-on-dark-muted mb-2">
                  {t("primaryFontLabel")}
                </div>
                <div className="text-heading font-mono">{fontFamily}</div>
              </div>
              <div className="rounded-xl border border-border-on-dark px-6 py-4">
                <div className="text-caption text-on-dark-muted mb-2">
                  {t("monoFontLabel")}
                </div>
                <div className="text-heading font-mono">{fontMono}</div>
              </div>
            </div>

            <div className="text-eyebrow text-on-dark-muted mb-4">
              [{t("scaleLabel")}]
            </div>
            <div>
              {typeScale.map((entry) => (
                <TypeSpecimen key={entry.id} entry={entry} mono="font-mono" />
              ))}
            </div>
          </div>
        </section>

        <section className="px-8 py-24">
          <div className="max-w-[1280px] mx-auto">
            <div className="text-eyebrow text-primary mb-4">[rules]</div>
            <h2 className="text-display-lg text-ink mb-4">{t("rulesTitle")}</h2>
            <p className="text-lead text-ink-muted max-w-[640px] mb-16">
              {t("rulesSubtitle")}
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="text-label text-success mb-4">{t("doLabel")}</div>
                {doRules.map((rule, index) => (
                  <RuleCard key={rule.id} rule={rule} index={index} />
                ))}
              </div>
              <div className="space-y-4">
                <div className="text-label text-error mb-4">{t("dontLabel")}</div>
                {dontRules.map((rule, index) => (
                  <RuleCard key={rule.id} rule={rule} index={index} />
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

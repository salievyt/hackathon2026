import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";

export type LegalSection = "Terms" | "Privacy" | "Conduct";

const SECTION_COUNT: Record<LegalSection, number> = {
  Terms: 7,
  Privacy: 7,
  Conduct: 6,
};

export async function LegalContent({ section }: { section: LegalSection }) {
  const t = await getTranslations(section);
  const count = SECTION_COUNT[section];

  return (
    <main className="bg-canvas min-h-[70vh] pt-36 pb-28 px-8">
      <div className="max-w-[760px] mx-auto">
        <div className="text-eyebrow text-primary mb-4">[{t("eyebrow")}]</div>
        <h1 className="text-display-lg text-ink mb-3">{t("title")}</h1>
        <p className="text-caption text-ink-muted mb-12">{t("updated")}</p>

        {Array.from({ length: count }, (_, i) => (
          <div key={i} className="mb-10">
            <h2 className="text-heading text-ink mb-3">{t(`s${i + 1}Heading`)}</h2>
            <p className="text-body text-ink-muted">{t(`s${i + 1}Body`)}</p>
          </div>
        ))}

        <Link
          href="/"
          className="inline-block text-label text-primary hover:text-primary-hover hover:underline transition-colors"
        >
          {t("back")}
        </Link>
      </div>
    </main>
  );
}

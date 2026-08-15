import { getLocale, getTranslations } from "next-intl/server";
import { fetchFaq } from "@/lib/api";
import { FaqAccordion } from "@/components/ui/faq-accordion";

const FALLBACK_FAQ_COUNT = 6;

export async function FaqSection() {
  const t = await getTranslations("Faq");
  const locale = await getLocale();
  const items = (await fetchFaq(locale)) ?? [];

  const fallback = Array.from({ length: FALLBACK_FAQ_COUNT }, (_, i) => ({
    question: t(`q${i + 1}q`),
    answer: t(`q${i + 1}a`),
  }));

  return (
    <section id="faq" className="bg-canvas py-[120px] px-8">
      <div className="max-w-[800px] mx-auto">
        <div className="text-center mb-[56px]">
          <div className="text-eyebrow text-primary mb-6">[{t("eyebrow")}]</div>
          <h2 className="text-display-lg text-ink mb-6">{t("title")}</h2>
          <p className="text-lead text-ink-muted max-w-[680px] mx-auto">
            {t("description")}
          </p>
        </div>

        <FaqAccordion items={items.length > 0 ? items : fallback} />
      </div>
    </section>
  );
}

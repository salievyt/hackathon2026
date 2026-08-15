import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { SectionHeader } from "@/components/ui/section-header";
import { fetchPartners, type PartnerItem } from "@/lib/api";

function PartnerLogos({
  partners,
  duplicate = false,
}: {
  partners: PartnerItem[];
  duplicate?: boolean;
}) {
  return (
    <div
      aria-hidden={duplicate || undefined}
      className={
        "flex items-center gap-6 pr-6" + (duplicate ? " marquee-duplicate" : "")
      }
    >
      {partners.map((partner) => (
        <a
          key={partner.id}
          href={partner.url || "#"}
          target={partner.url ? "_blank" : undefined}
          rel="noreferrer"
          className="bg-canvas border border-border rounded-xl h-24 px-10 flex items-center justify-center hover:border-primary transition-colors"
        >
          <Image
            src={partner.logo}
            alt={partner.name}
            width={400}
            height={160}
            unoptimized
            className="h-10 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity"
          />
        </a>
      ))}
    </div>
  );
}

export async function PartnersSection() {
  const t = await getTranslations("Partners");
  const locale = await getLocale();
  const partners = (await fetchPartners(locale)) ?? [];

  if (partners.length === 0) {
    return null;
  }

  return (
    <section id="partners" className="bg-canvas-soft py-[120px] px-8 overflow-hidden">
      <div className="max-w-[1280px] mx-auto">
        <SectionHeader
          eyebrow={`[${t("eyebrow")}]`}
          title={t("title")}
          description={t("description")}
        />
      </div>

      <div className="marquee-mask space-y-6">
        <div className="marquee-row overflow-hidden">
          <div className="marquee-track">
            <PartnerLogos partners={partners} />
            <PartnerLogos partners={partners} duplicate />
          </div>
        </div>
        <div className="marquee-row marquee-row-reverse overflow-hidden">
          <div className="marquee-track">
            <PartnerLogos partners={[...partners].reverse()} />
            <PartnerLogos partners={[...partners].reverse()} duplicate />
          </div>
        </div>
      </div>
    </section>
  );
}

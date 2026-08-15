import { getLocale, getTranslations } from "next-intl/server";
import { SectionHeader } from "@/components/ui/section-header";
import { MemberCard } from "@/components/ui/member-card";
import { fetchJury } from "@/lib/api";

export async function JurySection() {
  const t = await getTranslations("Jury");
  const locale = await getLocale();
  const jury = (await fetchJury(locale)) ?? [];

  return (
    <section id="jury" className="bg-surface-dark py-[160px] px-8 text-on-dark">
      <div className="max-w-[1280px] mx-auto">
        <SectionHeader
          eyebrow={`[${t("eyebrow")}]`}
          title={t("title")}
          description={t("description")}
          isDark
        />

        {jury.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {jury.map((member) => (
              <MemberCard key={member.id} member={member} dark />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

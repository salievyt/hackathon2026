import { getLocale, getTranslations } from "next-intl/server";
import { SectionHeader } from "@/components/ui/section-header";
import { MemberCard } from "@/components/ui/member-card";
import { fetchMentors } from "@/lib/api";

export async function MentorsSection() {
  const t = await getTranslations("Mentors");
  const locale = await getLocale();
  const mentors = (await fetchMentors(locale)) ?? [];

  return (
    <section id="mentors" className="bg-canvas py-[120px] px-8">
      <div className="max-w-[1280px] mx-auto">
        <SectionHeader
          eyebrow={`[${t("eyebrow")}]`}
          title={t("title")}
          description={t("description")}
        />

        {mentors.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {mentors.map((member) => (
              <MemberCard key={member.id} member={member} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

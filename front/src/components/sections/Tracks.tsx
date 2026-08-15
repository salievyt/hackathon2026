import { getLocale, getTranslations } from "next-intl/server";
import { SectionHeader } from "@/components/ui/section-header";
import { ShowcaseCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { fetchTracks } from "@/lib/api";

export async function TracksSection() {
  const t = await getTranslations("Tracks");
  const locale = await getLocale();
  const tracks = (await fetchTracks(locale)) ?? [];

  return (
    <section id="tracks" className="bg-surface-dark py-[160px] px-8 text-on-dark">
      <div className="max-w-[1280px] mx-auto">
        <SectionHeader eyebrow={`[${t("eyebrow")}]`} title={t("title")} isDark />

        {tracks.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tracks.map((track, index) => (
              <ShowcaseCard
                key={track.id}
                className="bg-surface-dark-2 border-border-on-dark text-on-dark"
              >
                <Badge variant="primary" className="mb-6">
                  {String(index + 1).padStart(2, "0")}
                </Badge>
                <h3 className="text-heading mb-4 text-on-dark">{track.name}</h3>
                <p className="text-body text-on-dark-muted">{track.description}</p>
              </ShowcaseCard>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

import { MetricCard } from "@/components/ui/card";
import { BACKEND_URL } from "@/lib/config";

export async function StatsSection({ t }: { t: any }) {
  let count = 0;
  try {
    const res = await fetch(`${BACKEND_URL}/api/participants/count/`, { next: { revalidate: 10 } });
    if (res.ok) {
      const data = await res.json();
      count = data.count || 0;
    }
  } catch (e) {
    console.error("Failed to fetch participant count", e);
  }

  return (
    <section className="bg-canvas-soft py-[120px] px-8">
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard number={t('hours')} label={t('hoursLabel')} />
        <MetricCard number={`${count}+`} label={t('participantsLabel')} />
        <MetricCard number={t('mentors')} label={t('mentorsLabel')} />
        <MetricCard number={t('prize')} label={t('prizeLabel')} />
      </div>
    </section>
  );
}

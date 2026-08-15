import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { VisualProof } from "@/components/ui/visual-proof";
import { CountdownTimer } from "@/components/ui/countdown-timer";

export function HeroSection({ t }: { t: any }) {
  return (
    <section className="bg-canvas min-h-[760px] pt-[96px] pb-[120px] px-8 flex flex-col justify-center items-center text-center">
      <div className="max-w-[1280px] mx-auto w-full flex flex-col items-center">
        <div className="text-eyebrow text-primary mb-6">[HACKATHON 2026]</div>
        <h1 className="text-hero-display text-ink max-w-[920px] mb-6">
          {t('title')}
        </h1>
        <p className="text-lead text-ink-muted max-w-[680px] mb-8">
          {t('description')}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 mt-8">
          <Link href="#register">
            <Button variant="primary" className="w-full sm:w-auto text-label text-on-dark">
              {t('cta')}
            </Button>
          </Link>
          <Link href="#about">
            <Button variant="secondary-dark" className="w-full sm:w-auto">
              {t('secondaryCta')}
            </Button>
          </Link>
        </div>
        
        {/* Countdown */}
        <CountdownTimer />

        {/* Product / Project Visual Proof */}
        <VisualProof />
      </div>
    </section>
  );
}

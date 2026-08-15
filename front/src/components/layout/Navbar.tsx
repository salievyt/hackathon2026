import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useTranslations } from 'next-intl';

export function Navbar() {
  const t = useTranslations('Nav');

  return (
    <header className="sticky top-0 z-50 bg-[rgba(255,255,255,0.72)] backdrop-blur-[20px] saturate-180 border-b border-[rgba(0,0,0,0.06)] h-[72px] px-8 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-3">
        {/* We invert the SVG to dark because SVG fill is #FFFFFE, but background is light canvas */}
        <Image src="/logo.svg" alt="Hackathon Logo" width={32} height={32} className="invert opacity-90" />
        <span className="text-body-strong text-ink hidden sm:inline-block">Hackathon 2026</span>
      </Link>
      
      <nav className="hidden md:flex items-center gap-8">
        <Link href="#about" className="text-label text-ink-muted hover:text-ink transition-colors">{t('about')}</Link>
        <Link href="#tracks" className="text-label text-ink-muted hover:text-ink transition-colors">{t('tracks')}</Link>
        <Link href="#prizes" className="text-label text-ink-muted hover:text-ink transition-colors">{t('prizes')}</Link>
        <Link href="#faq" className="text-label text-ink-muted hover:text-ink transition-colors">{t('faq')}</Link>
        <Link href="/partners" className="text-label text-ink-muted hover:text-ink transition-colors">{t('partners')}</Link>
      </nav>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex gap-2 mr-2">
          <Link href="/" locale="en" className="text-caption text-ink-muted hover:text-ink">EN</Link>
          <span className="text-ink-muted">/</span>
          <Link href="/" locale="ru" className="text-caption text-ink-muted hover:text-ink">RU</Link>
          <span className="text-ink-muted">/</span>
          <Link href="/" locale="ky" className="text-caption text-ink-muted hover:text-ink">KY</Link>
        </div>
        <Link href="#register">
          <Button variant="primary" className="py-2.5 px-5 min-h-0 text-label text-on-dark">
            {t('cta')}
          </Button>
        </Link>
      </div>
    </header>
  );
}

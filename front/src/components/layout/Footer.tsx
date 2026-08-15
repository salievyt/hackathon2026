import { Link } from "@/i18n/routing";
import { useTranslations } from 'next-intl';
import Image from "next/image";

export function Footer() {
  const t = useTranslations('Footer');

  return (
    <footer className="relative bg-surface-dark text-on-dark py-16 px-8 overflow-hidden">
      <div className="relative max-w-[1280px] mx-auto mb-16">
        <Image
          src="/MadeByDeo.svg"
          alt=""
          aria-hidden
          width={632}
          height={128}
          className="w-[min(95vw,760px)] h-auto mx-auto"
        />
      </div>

      <div className="relative max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <Image src="/logo.svg" alt="" width={36} height={40} className="h-[28px] w-auto" />
            <span className="text-body-strong">Hackathon 2026</span>
          </div>
          <p className="text-on-dark-muted text-body max-w-[384px]">
            {t('tagline')}
          </p>
        </div>
        
        <div>
          <div className="text-label mb-6 text-on-dark">{t('navigation')}</div>
          <ul className="space-y-4">
            <li><Link href="#about" className="text-body text-on-dark-muted hover:text-on-dark transition-colors">{t('about')}</Link></li>
            <li><Link href="#tracks" className="text-body text-on-dark-muted hover:text-on-dark transition-colors">{t('tracks')}</Link></li>
            <li><Link href="#prizes" className="text-body text-on-dark-muted hover:text-on-dark transition-colors">{t('prizes')}</Link></li>
            <li><Link href="#faq" className="text-body text-on-dark-muted hover:text-on-dark transition-colors">{t('faq')}</Link></li>
            <li><Link href="/partners" className="text-body text-on-dark-muted hover:text-on-dark transition-colors">{t('partners')}</Link></li>
          </ul>
        </div>
        
        <div>
          <div className="text-label mb-6 text-on-dark">{t('legal')}</div>
          <ul className="space-y-4">
            <li><Link href="/brandbook" className="text-body text-on-dark-muted hover:text-on-dark transition-colors">{t('brandbook')}</Link></li>
            <li><Link href="/terms" className="text-body text-on-dark-muted hover:text-on-dark transition-colors">{t('terms')}</Link></li>
            <li><Link href="/privacy" className="text-body text-on-dark-muted hover:text-on-dark transition-colors">{t('privacy')}</Link></li>
            <li><Link href="/conduct" className="text-body text-on-dark-muted hover:text-on-dark transition-colors">{t('conduct')}</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="relative max-w-[1280px] mx-auto mt-16 pt-8 border-t border-border-on-dark flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-caption text-on-dark-muted">
          {t('rights')}
        </div>
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-full border border-border-on-dark text-on-dark text-caption font-mono flex items-center justify-center">
            16+
          </span>
          <span className="text-caption text-on-dark-muted">
            {t('ageRestriction')}
          </span>
        </div>
        <div className="text-caption text-on-dark-muted font-mono uppercase tracking-widest">
          // ELECTRIC BLUE SYSTEM
        </div>
      </div>
    </footer>
  );
}

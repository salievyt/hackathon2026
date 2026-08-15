import { useTranslations } from 'next-intl';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/sections/Hero';
import { StatsSection } from '@/components/sections/Stats';
import { AboutSection } from '@/components/sections/About';
import { TracksSection } from '@/components/sections/Tracks';
import { MentorsSection } from '@/components/sections/Mentors';
import { JurySection } from '@/components/sections/Jury';
import { PartnersSection } from '@/components/sections/Partners';
import { FaqSection } from '@/components/sections/Faq';
import { RegistrationSection } from '@/components/sections/Registration';

export default function Home() {
  const tHero = useTranslations('Hero');
  const tStats = useTranslations('Stats');
  const tAbout = useTranslations('About');
  const tParticipants = useTranslations('Participants');

  return (
    <>
      <Navbar />
      <main>
        <HeroSection t={tHero} />
        <StatsSection t={tStats} />
        <AboutSection tAbout={tAbout} tParticipants={tParticipants} />
        <TracksSection />
        <MentorsSection />
        <JurySection />
        <PartnersSection />
        <FaqSection />
        <RegistrationSection />
      </main>
      <Footer />
    </>
  );
}

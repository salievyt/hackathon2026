import {getTranslations} from 'next-intl/server';
import {eventCopy, languages, origin, type Locale} from '@/lib/search';
import {fetchConfig} from '@/lib/api';
import {DEFAULT_EVENT_START} from '@/lib/config';

type Props = {params: Promise<{locale: Locale}>};
export async function generateMetadata({params}: Props) {
  const {locale} = await params;
  const copy = eventCopy[locale];
  if (!copy) return {};
  const url = origin + '/' + locale;
  return {...copy, alternates: {canonical: url, languages: languages()}, openGraph: {...copy, url, siteName: 'EVO FLARE'}};
}
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

export default async function Home({params}: Props) {
  const {locale} = await params;
  const copy = eventCopy[locale];
  if (!copy) return null;
  const start = (await fetchConfig())?.event_start ?? DEFAULT_EVENT_START;
  const date = new Intl.DateTimeFormat(locale, {dateStyle: 'long', timeStyle: 'short', timeZone: 'Asia/Bishkek'}).format(new Date(start));
  const url = origin + '/' + locale;
  const event = {
    '@context': 'https://schema.org', '@type': 'Event', '@id': origin + '/#event',
    name: copy.title, description: copy.description, url, startDate: start,
    endDate: new Date(Date.parse(start) + 72 * 3600000).toISOString(),
    location: {'@type': 'Place', name: 'Osh', address: {'@type': 'PostalAddress', addressLocality: 'Osh', addressCountry: 'KG'}},
    offers: {'@type': 'Offer', name: {ru:'Участие одной команды', ky:'Бир команда үчүн', en:'Team entry'}[locale], price: 2000, priceCurrency: 'KGS', url: url + '#register'},
  };
  const tHero = await getTranslations('Hero');
  const tStats = await getTranslations('Stats');
  const tAbout = await getTranslations('About');
  const tParticipants = await getTranslations('Participants');

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(event).replace(/</g, "\\u003c")}} />
      <Navbar />
      <main>
        <HeroSection t={tHero} title={copy.title} description={copy.description} date={date} start={start} />
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

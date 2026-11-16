export const origin = 'https://evoflare.deo-core.codes';
export const eventCopy = {
  ru: {title: 'Хакатон в Оше 2026 — EVO FLARE', description: 'Соберите команду и создайте проект за 72 часа в Оше. Участие стоит 2 000 сомов с команды. Можно подать заявку и одному.'},
  ky: {title: 'Оштогу хакатон 2026 — EVO FLARE', description: 'Команда чогултуп, Ошто 72 саатта долбоор түзүңүз. Катышуу акысы бир командага 2 000 сом. Жалгыз да катталсаңыз болот.'},
  en: {title: 'Osh Hackathon 2026 — EVO FLARE', description: 'Build a project in 72 hours with your team in Osh, Kyrgyzstan. Entry costs 2,000 KGS per team. You can also apply on your own.'},
};
export type Locale = keyof typeof eventCopy;
export function languages(path = '') {
  return Object.fromEntries(Object.keys(eventCopy).map(lang => [lang, origin + '/' + lang + path]));
}

import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';
import { BACKEND_URL } from '@/lib/config';

function deepMerge<T>(base: T, override: T): T {
  const out: Record<string, unknown> = { ...(base as object) };
  for (const key of Object.keys(override as object)) {
    const ov = (override as Record<string, unknown>)[key];
    const bv = out[key];
    const isObject = (v: unknown) =>
      typeof v === 'object' && v !== null && !Array.isArray(v);
    out[key] = isObject(ov) && isObject(bv) ? deepMerge(bv, ov) : ov;
  }
  return out as T;
}

async function loadMessages(locale: string) {
  const localMessages = (await import(`../messages/${locale}.json`)).default;
  try {
    const res = await fetch(`${BACKEND_URL}/api/i18n/${locale}/`, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const data = await res.json();
      if (data.messages) {
        return deepMerge(localMessages, data.messages);
      }
    }
  } catch (error) {
    console.error(`[i18n] Failed to load "${locale}" messages from backend, using local fallback`, error);
  }
  return localMessages;
}

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: await loadMessages(locale),
  };
});

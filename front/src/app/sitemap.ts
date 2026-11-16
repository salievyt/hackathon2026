import type {MetadataRoute} from 'next';
import {languages} from '@/lib/search';

export default function sitemap(): MetadataRoute.Sitemap {
  return ['', '/partners', '/brandbook', '/terms', '/privacy', '/conduct'].flatMap(path => {
    const urls = languages(path);
    return Object.values(urls).map(url => ({url, alternates: {languages: urls}}));
  });
}

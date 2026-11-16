import type {MetadataRoute} from 'next';
import {origin} from '@/lib/search';

export default function robots(): MetadataRoute.Robots {
  return {rules: {userAgent: '*', allow: '/', disallow: ['/admin/', '/api/', '/*/partners/dashboard', '/*/partners/login']}, sitemap: origin + '/sitemap.xml'};
}

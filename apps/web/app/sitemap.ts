import { MetadataRoute } from 'next';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const SITE_URL = 'https://www.lifeterrain.in'; // Ensure this matches your production URL

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static Routes
  const routes = [
    '',
    '/about',
    '/contact',
    '/courses',
    '/gallery',
    '/login',
    '/privacy-policy',
    '/terms',
    '/refund'
  ].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Dynamic Course Routes
  let courseRoutes: MetadataRoute.Sitemap = [];
  try {
    const q = query(collection(db, 'courses'), where('published', '==', true));
    const snap = await getDocs(q);
    
    courseRoutes = snap.docs.map((doc) => {
      const data = doc.data();
      return {
        url: `${SITE_URL}/courses/${data.slug}`,
        lastModified: data.updatedAt?.toDate() || new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
      };
    });
  } catch (error) {
    console.error("Failed to fetch courses for sitemap", error);
  }

  return [...routes, ...courseRoutes];
}

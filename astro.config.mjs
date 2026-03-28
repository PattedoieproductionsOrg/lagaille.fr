// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const SITE = 'https://lagaille.fr';

// Récupère les slugs des articles depuis l'API Wispra au build
async function getBlogArticleUrls() {
    try {
        const res = await fetch(
            'https://api.wispra.fr/blog/public/pk_blog_58f4f075dfb6482c876a1650bda4ef89/articles',
            { headers: { 'Content-Type': 'application/json' } }
        );
        if (!res.ok) return [];
        const data = await res.json();
        return data.articles.map((a) => `${SITE}/blog/${a.slug}`);
    } catch {
        return [];
    }
}

const blogUrls = await getBlogArticleUrls();

// https://astro.build/config
export default defineConfig({
    site: SITE,
    base: '/',
    integrations: [
        sitemap({
            customPages: blogUrls,
        }),
    ],
});

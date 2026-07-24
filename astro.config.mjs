// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const SITE = 'https://lagaille.fr';

// Récupère les articles (slug + date de MAJ) depuis l'API Wispra au build,
// pour renseigner <lastmod> dans le sitemap. Les pages d'articles sont déjà
// prérendues via getStaticPaths → PAS besoin de customPages (cela créait des
// doublons non-canoniques sans slash final dans le sitemap).
async function getBlogArticles() {
    try {
        const res = await fetch(
            'https://api.wispra.fr/blog/public/pk_blog_58f4f075dfb6482c876a1650bda4ef89/articles',
            { headers: { 'Content-Type': 'application/json' } }
        );
        if (!res.ok) return [];
        const data = await res.json();
        return data.articles || [];
    } catch {
        return [];
    }
}

const articles = await getBlogArticles();
const lastmodBySlug = new Map(
    articles.map((a) => [a.slug, a.updatedAt || a.publishedDate])
);
const buildDate = new Date().toISOString();

// https://astro.build/config
export default defineConfig({
    site: SITE,
    base: '/',
    integrations: [
        sitemap({
            serialize(item) {
                const match = item.url.match(/\/blog\/([^/]+)\/?$/);
                if (match && lastmodBySlug.has(match[1])) {
                    // Page d'article
                    const lm = lastmodBySlug.get(match[1]);
                    item.lastmod = new Date(lm).toISOString();
                    item.changefreq = 'monthly';
                    item.priority = 0.6;
                } else if (item.url.replace(/\/$/, '') === SITE) {
                    // Accueil
                    item.lastmod = buildDate;
                    item.changefreq = 'weekly';
                    item.priority = 1.0;
                } else {
                    // Blog (listing), FAQ
                    item.lastmod = buildDate;
                    item.changefreq = 'weekly';
                    item.priority = 0.8;
                }
                return item;
            },
        }),
    ],
});

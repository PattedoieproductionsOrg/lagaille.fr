// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
    site: 'https://lpernelle-woosmap.github.io',
    base: '/pattedoie',
    vite: {
        server: {
            allowedHosts: ['pattedoie-showcase.loca.lt'],
        },
    },
});

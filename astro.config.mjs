import { defineConfig, sharpImageService } from 'astro/config';
import mdx from "@astrojs/mdx";

import AutoImport from 'astro-auto-import';
import MDXCodeBlocks, { mdxCodeBlockAutoImport } from 'astro-mdx-code-blocks';

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
    site: "https://yonic-corner-legacy.netlify.app",
    scopedStyleStrategy: "class",
    experimental: {
        assets: true
    },
    image: {
        service: sharpImageService(),
    },
    integrations: [
        AutoImport({
            imports: [
                '@lib/components/bubbles/TextBubble.astro'
            ]
        }),
        mdx(), 
        sitemap(),
    ],
    vite: {
        build: {
            target: "es6"
        }
    },
});
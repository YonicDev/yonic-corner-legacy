import { defineConfig } from 'astro/config';
import mdx from "@astrojs/mdx";

import AutoImport from 'astro-auto-import';
import MDXCodeBlocks, { mdxCodeBlockAutoImport } from 'astro-mdx-code-blocks';

import readingTime from './src/remark/reading-time.mjs';

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
    site: "http://legacy.yonic.blog",
    scopedStyleStrategy: "class",
    markdown: {
        remarkPlugins: [readingTime],
    },
    integrations: [
        AutoImport({
            imports: [
                mdxCodeBlockAutoImport("@lib/components/CodeBlock.astro"),
                '@lib/components/biyonic/Paragraph.astro',
                '@lib/components/biyonic/ListItem.astro',
                '@lib/components/biyonic/Code.astro',
                '@lib/components/bubbles/TextBubble.astro',
                '@lib/components/Figure.astro',
                '@lib/components/ImageGrid.astro',
                '@lib/components/Chara.astro',
                '@lib/components/PlayerLink.astro',
                '@lib/components/Anchor.astro',
                '@lib/components/VersionBranch.astro',
                '@lib/components/Ruby.astro',
                {
                    'astro:assets': ['Image', 'Picture']
                },
            ]
        }),
        MDXCodeBlocks(),
        mdx(), 
        sitemap(),
    ],
    vite: {
        build: {
            target: "es6",
            assetsInlineLimit: 0,
            rollupOptions: {
                external: function(id) {
                    return /^@lib\/components\/modern/.test(id);
                }
            }
        },
        resolve: {
            preserveSymlinks: true
        }
    },
});
import RSSFeed from "@lib/components/feed/RSSFeed.astro";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { APIRoute } from "astro";

export const GET: APIRoute = async ({request, locals}) => {
    const container = await AstroContainer.create({
        renderers: [
            {
                name: "@astrojs/mdx",
                serverEntrypoint: "astro/jsx/server.js",
            },
        ],
    });

    const xmlString = await container.renderToString(RSSFeed, { request, locals, props: { full: true } });
    return new Response(xmlString.replace("<!DOCTYPE html>", ""), {
        headers: {
            'Content-Type': "application/rss+xml; charset=utf-8",
        }
    });
}
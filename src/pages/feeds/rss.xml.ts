import RSSFeed from "@lib/components/feed/RSSFeed.astro";
import { getContainerRenderer as MDXContainerRenderer } from "@astrojs/mdx"
import { loadRenderers } from "astro/virtual-modules/container.js"; // Why no "astro:container"?
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { APIRoute } from "astro";

export const GET: APIRoute = async ({request, locals}) => {
    const renderers = await loadRenderers([ MDXContainerRenderer()]);
    const container = await AstroContainer.create({renderers});

    const xmlString = await container.renderToString(RSSFeed, { request, locals });
    return new Response(xmlString.replace("<!DOCTYPE html>", ""), {
        headers: {
            'Content-Type': "application/rss+xml; charset=utf-8",
        }
    });
}
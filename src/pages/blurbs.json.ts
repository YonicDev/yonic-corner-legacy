import type { APIRoute } from "astro";
import { getEntry } from "astro:content";

import type { TimedBlurb } from "@lib/content/config";

export const GET: APIRoute = async () => {
    const categories = ["common", "legacy"] as const;
    const blurbs: TimedBlurb[] = (await Promise.all(categories.map(async (category) => {
        const list = await getEntry("blurb", category);
        return list.data.timed as TimedBlurb[];
    }))).flat();

    if(!blurbs)
        return new Response("No legacy blurbs!", {status: 404});
    return new Response(JSON.stringify(blurbs))
}
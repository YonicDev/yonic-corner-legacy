import { HIDE_DRAFTS_IN_DEVELOPMENT } from "@lib/settings";
import { type CollectionEntry } from "astro:content";

export function filterPosts(post: CollectionEntry<"blog">) {
    return post.data.legacy !== false && (!HIDE_DRAFTS_IN_DEVELOPMENT && import.meta.env.DEV || !post.data.draft)
}

export function sortPosts(a: CollectionEntry<"blog">, b: CollectionEntry<"blog">) {
    const aPub = a.data.pubDate.getTime();
    const bPub = b.data.pubDate.getTime();
    const aEdt = a.data.updatedDate?.getTime() ?? 0;
    const bEdt = b.data.updatedDate?.getTime() ?? 0;
    return Math.max(bPub, bEdt) - Math.max(aEdt, aPub) || a.id.localeCompare(b.id);
}

export function shuffle<T>(arr: Array<T>): Array<T> {
    const array = structuredClone(arr);
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    return array;
}

/**
 * Checks whether it's being rendered the web feed.
 * @param referencePath Path to use as reference for rendering (should be `Astro.url`)
 * @returns A boolean with value true the page is being rendered for the web feed.
 */
export function isRenderingFeed(referencePath: URL) {
    return /^\/feeds\//.test(referencePath.pathname) 
}


export function hasSuitableSource(source: CollectionEntry<"music">["data"]["sources"][number]) {
    const validFormats = ["audio/mpeg", "audio/mp3","audio/wav"];
    if(source.type === "iarchive")
        return true;
	if(source.type === "youtube" || source.src === '')
		return false;
	return new URL(source.src).protocol === "http:" && validFormats.indexOf(source.type) >= 0;
}
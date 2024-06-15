import type { ImageOutputFormat } from "astro";
import crypto from "node:crypto";

const { IMGPROXY_HOST, IMGPROXY_KEY, IMGPROXY_SALT } = import.meta.env;

const salt = Buffer.from(IMGPROXY_SALT, "hex").toString();

export function getSignedUrl(href: string): string {
    try {
        const url = new URL(href);
        const signature = crypto.createHmac("sha256", Buffer.from(IMGPROXY_KEY, "hex")).update(url.pathname.slice(1)).digest("base64url");
        const result = new URL(`${IMGPROXY_HOST}/${signature}${url.pathname.slice(salt.length+1)}`, url.origin)
        return result.href;
    } catch (e) {
        console.error(e);
        return href;
    }
}

export function getRemoteImage(options: {src: string, width: number, format: ImageOutputFormat, quality: number}) {
    const { src, width, format, quality } = options;
    const encodedURL = Buffer.from(src).toString("base64url");
    const imageSrc = getSignedUrl(`${IMGPROXY_HOST}/${salt}/s:${width}/q:${quality}/${encodedURL}.${format}`);
    return imageSrc;
}

export function getBorderImage(src: string) {
    const encodedURL = Buffer.from(src).toString("base64url");
    const imageSrc = getSignedUrl(`${IMGPROXY_HOST}/${salt}/s:1:1/${encodedURL}.gif`);
    return imageSrc;
}
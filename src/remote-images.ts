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

export function getRemoteSizedImage(options: {src: string, width: number, height: number, format: ImageOutputFormat, quality: number}) {
    const { src, width, height, format, quality } = options;
    const encodedURL = Buffer.from(src).toString("base64url");
    const imageSrc = getSignedUrl(`${IMGPROXY_HOST}/${salt}/rs:fill:${Math.round(width)}:${Math.round(height)}/q:${quality}/${encodedURL}.${format}`);
    return imageSrc;
}

export function getBorderImage(src: string) {
    return getRemoteSizedImage({src, width: 1, height: 1, format: "gif", quality: 1}); 
}

export function getRemoteHeroImage(options: {src: string}) {
    const { src } = options;
    return getRemoteSizedImage({src, width: 150, height: 100, format: "jpg", quality: 90}); 
}

export function getRemoteCover(options: {src: string}) {
    const { src } = options;
    return getRemoteSizedImage({src, width: 454, height: 303, format: "jpg", quality: 90});
}

export function getRemoteAlbumCover(options: {src: string, small?: boolean}) {
    const { src, small = false } = options;
    const size = small? 24 : 48;
    return getRemoteSizedImage({src, width: size, height: size, format: "jpg", quality: 80});
}

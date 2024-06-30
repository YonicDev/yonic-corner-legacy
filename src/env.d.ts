/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface Category {
    title: string,
    description: string,
    order: number,
    baseColor: string,
    emphasisColor: string,
}

declare interface ImportMetaEnv {
    BLOG_IMAGE_ROOT: string,
    BLOG_MUSIC_COVER_ROOT: string,
    BLOG_STATIC_ROOT: string,
    IMGPROXY_HOST: string,
    IMGPROXY_KEY: string,
    IMGPROXY_SALT: string,
}
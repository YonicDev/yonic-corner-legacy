import { z, defineCollection, reference } from 'astro:content';

import { CATEGORY_IDS } from '@lib/settings';

const audioTypes = ["audio/aac","audio/mpeg","audio/mp3","audio/ogg","audio/x-wav","audio/webm","audio/3gpp"] as const;

const blogCollection = defineCollection({
    schema: ({image}) => z.object({
        title: z.string(),
        description: z.string(),
        category: z.enum(CATEGORY_IDS).optional().default("misc"),
        tags: z.array(z.string()).optional().default([]),
        hero: z.object({
            modern: image().or(z.string()),
            legacy: image().refine(({width, height}) => (Math.abs(width/height - 1.5) <= 0.01), "Legacy hero images must be of 3:2 aspect ratio.").or(z.string()),
      }).partial().strict().optional(),
        heroPosition: z.union([
            z.literal("top"),
            z.literal("center"),
            z.literal("bottom")
        ]).optional(),
        draft: z.boolean().optional().default(false),
        legacy: z.boolean().or(z.literal("only")).default(true),
        pubDate: z
            .string()
            .or(z.date())
            .transform((val) => new Date(val)),
        updatedDate: z
            .string()
            .or(z.date())
            .optional()
            .transform((str) => (str ? new Date(str) : undefined)),
        series: z.object({
            id: reference("series"),
            order: z.number().int()
        }).strict().optional(),
        asianText: z.boolean().default(false),
        readingTime: z.object({
            text: z.number().int(),
            video: z.number().int().default(0)
        }).optional() // Filled in the reading time Remark plugin
    }).strict(),
});

const seriesCollection = defineCollection({
    type: "data",
    schema: ({image}) => z.object({
        title: z.string(),
        hero: z.object({
            modern: image().or(z.string()),
            legacy: image().refine(({width, height}) => (Math.abs(width/height - 1.5) <= 0.01), "Legacy hero images must be of 2:3 aspect ratio." ).or(z.string()),
        }).partial().strict().optional(),
        description: z.string()
    }).strict()
});

const blurbSchema = z.object({
    base: z.array(z.string()),
    timed: z.array(z.object({
        text: z.string(),
        dateRange: z.object({
            from: z.string(),
            to: z.string(),
            useYear: z.boolean().default(false)
        }).optional(),
        singleDate: z.object({
            date: z.string(),
            useYear: z.boolean().default(false)
        }).optional()
    }).strict())
}).strict();

const blurbCollection = defineCollection({
    type: "data",
    schema: blurbSchema
})

const musicCollection = defineCollection({
    type: "data",
    schema: z.object({
        title: z.string(),
        author: z.string().optional(),
        album: z.string().optional(),
        cover: z.string().optional(),
        duration: z.number().refine(n => n > 0, "Duration must be greater than 0")
            .or(z.string().regex(/^\d+:\d{1,2}$/, "Duration must be set to 'minutes:seconds'"))
            .optional(),
        sources: z.array(z.object({
            src: z.string().regex(/^@:(.+)*(?:[\?])*/i).or(z.string().url()).or(z.literal("")),
            type: z.enum(audioTypes, {invalid_type_error: "Music sources with an URL source must have a compatible audio MIME type."})
        }).strict().or(z.object({
            src: z.string(),
            type: z.literal("youtube", {invalid_type_error: "Music sources with a non-URL source must have their type set to 'youtube' or 'iarchive'."}),
        }).strict()).or(z.object({
            type: z.literal("iarchive"),
            src: z.string().regex(/^.+\/.+\..+$/, "iarchive sources must supply an Internet Archive valid url: {itemID}/{filename}")
        }).strict()))
    }).strict()
})

export type TimedBlurb = z.infer<typeof blurbSchema>["timed"][number];

export const collections = {
    blog: blogCollection,
    series: seriesCollection,
    blurb: blurbCollection,
    music: musicCollection
};
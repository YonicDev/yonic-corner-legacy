import { z, defineCollection, reference } from 'astro:content';
import type { ZodNever, Primitive, ZodLiteral, } from 'astro/zod';

import { CATEGORY_IDS } from '@lib/settings';

type MappedZodLiterals<T extends readonly Primitive[]> = {
    -readonly [K in keyof T]: ZodLiteral<T[K]>;
};

function createUnionSchema<T extends readonly []>(values: T): ZodNever;
function createUnionSchema<T extends readonly [Primitive]>(
    values: T
): ZodLiteral<T[0]>;
function createUnionSchema<
    T extends readonly [Primitive, Primitive, ...Primitive[]]
>(values: T, params?: z.RawCreateParams): z.ZodUnion<MappedZodLiterals<T>>;
function createUnionSchema<T extends readonly Primitive[]>(values: T, params?: z.RawCreateParams) {
    if (values.length > 1) {
        return createManyUnion(
            values as typeof values & [Primitive, Primitive, ...Primitive[]]
        );
    } else if (values.length === 1) {
        return z.literal(values[0]);
    } else if (values.length === 0) {
        return z.never();
    }
    throw new Error("Array must have a length");
}

function createManyUnion<
    A extends Readonly<[Primitive, Primitive, ...Primitive[]]>
>(literals: A) {
    return z.union(
        literals.map((value) => z.literal(value)) as MappedZodLiterals<A>
    );
}

const audioTypes = ["audio/aac","audio/mpeg","audio/mp3","audio/ogg","audio/x-wav","audio/webm","audio/3gpp"] as const;

const blogCollection = defineCollection({
    schema: ({image}) => z.object({
        title: z.string(),
        description: z.string(),
        category: createUnionSchema(CATEGORY_IDS).optional().default("misc"),
        tags: z.array(z.string()).optional().default([]),
        hero: z.object({
            modern: image(),
            legacy: image().refine(({width, height}) => (Math.abs(width/height - 1.5) <= 0.01), "Legacy hero images must be of 3:2 aspect ratio."),
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
            modern: image(),
            legacy: image().refine(({width, height}) => (Math.abs(width/height - 1.5) <= 0.01), "Legacy hero images must be of 2:3 aspect ratio." ),
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
            src: z.string().url().or(z.literal("")),
            type: createUnionSchema(audioTypes, {invalid_type_error: "Music sources with an URL source must have a compatible audio MIME type."})
        }).strict().or(z.object({
            src: z.string(),
            type: z.literal("youtube", {invalid_type_error: "Music sources with a non-URL source must have their type set to 'youtube' or 'iarchive'."}),
        }).strict()).or(z.object({
            type: z.literal("iarchive"),
            src: z.object({
                item: z.string(),
                file: z.string()
            }, {invalid_type_error: "iarchive sources must supply an Internet Archive item name and file name"}).strict()
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
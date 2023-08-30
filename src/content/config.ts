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
>(values: T): z.ZodUnion<MappedZodLiterals<T>>;
function createUnionSchema<T extends readonly Primitive[]>(values: T) {
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

const blogCollection = defineCollection({
    schema: z.object({
        title: z.string(),
        description: z.string(),
        category: createUnionSchema(CATEGORY_IDS).optional().default("misc"),
        tags: z.array(z.string()).optional().default([]),
        heroPosition: z.union([
            z.literal("top"),
            z.literal("center"),
            z.literal("bottom")
        ]).optional(),
        draft: z.boolean().optional().default(false),
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
        }).strict().optional()
    }).strict()
});

const seriesCollection = defineCollection({
    type: "data",
    schema: z.object({
      title: z.string(),
      description: z.string()
    }).strict()
  });

export const collections = {
    blog: blogCollection,
    series: seriesCollection
  };
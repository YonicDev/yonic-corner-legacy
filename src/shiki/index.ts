import type { ShikiTransformer } from "shiki";

export * from "./line-highlights"
export * from "./squiggly-lines"
export * from "./better-comments"

export function parseMeta(): ShikiTransformer {
    return {
        preprocess(_,options) {
            if(options.meta == null)
                options.meta = { __raw: "{}" };
            const parsedMeta: Record<string, string|undefined> = JSON.parse(options.meta.__raw ?? "{}");
            for (const key in parsedMeta) {
                if (Object.prototype.hasOwnProperty.call(parsedMeta, key)) {
                    const element = parsedMeta[key];
                    if(element != null)
                        options.meta[key] = element;
                }
            }
        },
    }
}
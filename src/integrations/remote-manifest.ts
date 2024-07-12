import url from "node:url";
import path from "node:path";
import fs from "node:fs";
import type { AstroIntegration } from "astro";

export function remoteImageManifest(): AstroIntegration {
    return {
        name: "remote-images-manifest",
        hooks: {
            "astro:build:start": function() {
                (globalThis as any).remoteImageManifest = [];
            },
            "astro:build:generated": function({dir, logger}) {
                const dirPath = url.fileURLToPath(dir);
                const filePath = path.resolve(dirPath, "remote-manifest.json");
                fs.writeFileSync(filePath, JSON.stringify((globalThis as any).remoteImageManifest));
                return logger.info("Generated remote images manifest.");
            },
        }
    }
}
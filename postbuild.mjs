// Astro does not track additional files generated manually during Astro components rendering,
// so this script will bundle the static assets that are generated in a hacky way.

import fs from "fs"
import path from "path"

const src = path.resolve(process.cwd(), "src/feeds/rss.xml");
const dest = path.resolve(process.cwd(), "dist/feeds/rss.xml");

fs.copyFileSync(src, dest);
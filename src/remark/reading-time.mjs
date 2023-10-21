import getReadingTime from "reading-time"
import { toString } from "mdast-util-to-string"

import { visit, CONTINUE, SKIP } from "unist-util-visit";
import { filter } from "unist-util-filter";

const remarkReadingTime = (function() {
    return function(tree, {data}) {
        const esmFreeTree = filter(tree, node => node.type!=='mdxjsEsm');
        let videoTime = 0;
        visit(esmFreeTree, (node) => {
            if(node.type === "mdxTextExpression") {
                const match = /frontmatter\.([a-z\.A-z]+)/.exec(node.value);
                if(match) {
                    const props = match[1].split(".");
                    node.value = props.reduce((o, i) => o[i], data.astro.frontmatter);
                } else {
                    console.warn(`MDX expression ${node.name} with value ${node.value} cannot be parsed for reading time.`);
                }
                return SKIP;
            } else if (node.type === "mdxJsxFlowElement" && node.name?.toLowerCase() === 'Youtube'.toLowerCase()) {
                const videoDuration = (node.attributes.find(attr => attr.name === "duration")?.value ?? "0:0").split(":");
                videoTime += parseInt(videoDuration[0]) + parseInt(videoDuration[1])/60;
                return SKIP;
            }
            return CONTINUE;
        })
        const textOnPage = toString(esmFreeTree);
        const readingTime = Math.round(getReadingTime(textOnPage).minutes);
        data.astro.frontmatter.readingTime = {text: readingTime, video: Math.round(videoTime)};
        
    }
});

export default remarkReadingTime;
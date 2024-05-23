import type { ShikiTransformer } from "shiki";

type Range = {from: number, to: number} | number;

export function lineHighlightTransformer(): ShikiTransformer {
    return {
        name: "lineHighlighter",
        line(node, line) {
            const createMarks = (type: "mark"|"ins"|"del", className: string, mark: string) => {
                const marksRaw = meta[type]?.split(",")
                const marksRanges: Range[] = marksRaw?.map(markRange => {
                    if(/^\d+-\d+$/.test(markRange)) {
                        const limits = markRange.split("-") as [string, string];
                        return {
                            from: parseInt(limits[0]),
                            to: parseInt(limits[1])
                        }
                    }
                    return parseInt(markRange)
                }) ?? [];
                let isMark = false;
                for (const range of marksRanges) {
                    if(isMark)
                        break;
                    if(typeof range == "number")
                        isMark ||= line === range;
                    else
                        isMark ||= line >= range.from && line <= range.to;
                }
                if(isMark) {
                    this.addClassToHast(node, className);
                    node.children[0].children[0].value = mark;
                }
            }

            node.children.unshift({
                type: "element",
                tagName: "span",
                properties: {
                    className: "line-marker"
                },
                children: [
                    {
                        type: "text",
                        value: " "
                    }
                ]
            })
            
            if(!this.options.meta)
                return;
            const meta: Record<string, string | undefined> = this.options.meta;
            createMarks("mark", "marked", " ")
            createMarks("ins", "insertion", "+")
            createMarks("del", "deletion", "-");
        },
    }
}


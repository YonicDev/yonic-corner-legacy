import { type ShikiTransformer, FontStyle } from "shiki";

type TransformerOptions = {
    lineColor?: string,
}

export function squigglyLinesTransformer(options: TransformerOptions = {}): ShikiTransformer {
    const {lineColor = "red"} = options;
    return {
        name: "squigglyLines",
        tokens(lines) {   
            let squiggly = false;
            let cumulativeOffset = 0;
            for (const line of lines) {
                for (const token of line) {
                    if(/~~/.test(token.content)) {
                        squiggly = !squiggly;
                        token.content = token.content.replace("~~", "");
                        cumulativeOffset += 2;
                        continue;
                    }
                    if(squiggly) {
                        const fontStyle = token.fontStyle === FontStyle.Italic? "font-style: italic;" : "";
                        const fontWeight = token.fontStyle === FontStyle.Bold? "font-weight: bold;" : "";
                        token.htmlStyle=`text-decoration: underline;color: ${lineColor};${fontStyle}${fontWeight}`.replaceAll(/[\n\r]/g,"");
                        token.offset -= cumulativeOffset;
                    }
                }
            }
        },
    }
}

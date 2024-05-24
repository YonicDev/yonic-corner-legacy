import { type ShikiTransformer, FontStyle } from "shiki";

type TransformerOptions = {
    error?: CommentStyle,
    returnStyle?: CommentStyle,
    header?: CommentStyle,
    warning?: CommentStyle,
    info?: CommentStyle
}

type CommentStyle = {
    bgColor?: string,
    textColor?: string,
}

export function betterCommentsTransformer(options: TransformerOptions = {}): ShikiTransformer {
    const {
        error = { textColor: "#003333", bgColor: "red" },
        returnStyle = { textColor: "deepskyblue" },
        warning = { textColor: "#003333", bgColor: "gold" },
        header = { textColor: "#00423A", bgColor: "#92F3ED"},
        info = { textColor: "azure", bgColor: "royalblue"},
    } = options;

    const errorStyle = { script: /(?<=^|\s)\/\/!\s/, markup: /(?<=^|\s)(?<=<!--\s)!\s/};
    const returnCommentStyle = { script: /(?<=^|\s)\/\/>\s/, markup: /(?<=^|\s)<!--\s>\s/};
    const warningStyle = { script: /(?<=^|\s)\/\/\?\s/, markup: /(?<=^|\s)(?<=<!--\s)\?\s/};
    const headerStyle = { script: /(?<=^|\s)\/\/(\d+\.\s?)/, markup: /(?<=^|\s)<!--\s(\d+\.\s?)/};
    const infoStyle = { script: /(?<=^|\s)\/\/i\s/, markup: /(?<=^|\s)(?<=<!--\s)i\s/};

    function getStyledCommentOfType(type: Record<string, RegExp>, token: string): RegExp | null {
        for (const syntax of Object.values(type)) {
            if(syntax.test(token))
                return syntax;
        }
        return null;
    }

    return {
        name: "squigglyLines",
        tokens(lines) {
            for (const line of lines) {
                for (const token of line) {
                    let detectedStyleSyntax = getStyledCommentOfType(errorStyle, token.content);
                    if(detectedStyleSyntax != null) {
                        token.color = error.textColor;
                        token.bgColor = error.bgColor;
                        token.fontStyle = FontStyle.None;
                        token.content = token.content.replace(detectedStyleSyntax, "");
                        continue;
                    }
                    detectedStyleSyntax = getStyledCommentOfType(returnCommentStyle, token.content);
                    if(detectedStyleSyntax != null) {
                        token.color = returnStyle.textColor;
                        token.bgColor = returnStyle.bgColor;
                        token.fontStyle = FontStyle.Italic;
                        if(detectedStyleSyntax === returnCommentStyle.markup)
                            token.content = token.content.replace(/--*>(?=$|\s)/, "")
                        token.content = token.content.replace(detectedStyleSyntax, "=> ");
                        continue;
                    }
                    detectedStyleSyntax = getStyledCommentOfType(warningStyle, token.content);
                    if(detectedStyleSyntax != null) {
                        token.color = warning.textColor;
                        token.bgColor = warning.bgColor;
                        token.fontStyle = FontStyle.None;
                        token.content = token.content.replace(detectedStyleSyntax, "");
                        continue;
                    }
                    detectedStyleSyntax = getStyledCommentOfType(headerStyle, token.content);
                    if(detectedStyleSyntax != null) {
                        token.color = header.textColor;
                        token.bgColor = header.bgColor;
                        token.fontStyle = FontStyle.Bold;
                        const [,number] = detectedStyleSyntax.exec(token.content)!;
                        token.content = token.content.replace(detectedStyleSyntax, number);
                        if(detectedStyleSyntax === headerStyle.markup)
                            token.content = token.content.replace(/\s*-->(?=$|\s+)/, "")
                        token.content += " ";
                        continue;
                    }
                    detectedStyleSyntax = getStyledCommentOfType(infoStyle, token.content);
                    if(detectedStyleSyntax != null) {
                        token.color = info.textColor;
                        token.bgColor = info.bgColor;
                        token.fontStyle = FontStyle.None;
                        token.content = token.content.replace(detectedStyleSyntax, "");
                        continue;
                    }
                }
            }
        },
    }
}

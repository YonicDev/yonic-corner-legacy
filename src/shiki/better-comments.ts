import { type ShikiTransformer, FontStyle } from "shiki";

type TransformerOptions = {
    error?: CommentStyle
}

type CommentStyle = {
    bgColor?: string,
    textColor?: string,
}

export function betterCommentsTransformer(options: TransformerOptions = {}): ShikiTransformer {
    const {
        error = { bgColor: "red", textColor: "#003333" }
    } = options;
    return {
        name: "squigglyLines",
        tokens(lines) {
            for (const line of lines) {
                for (const token of line) {
                    if(/(?<=^|\s)\/\/!\s/.test(token.content)) {
                        token.color = error.textColor;
                        token.bgColor = error.bgColor;
                        token.fontStyle = FontStyle.None;
                        token.content = token.content.replace(/(?<=^|\s)\/\/!\s/, "");
                    }
                }
            }
        },
    }
}

// h1, h2, h3, p, span, li
import './Markdown.css'

import { useEffect, useState } from "react";
import { marked } from "marked";    // 603/198k
import DOMPurify from "dompurify";  // 626/207k

type Props = {
    children: string | undefined;
};

export default function Markdown({ children }: Props) {
    const [html, setHtml] = useState("");

    useEffect(() => {
        async function convert() {
            const rawHtml = await marked(children ?? "");
            const cleanHtml = DOMPurify.sanitize(rawHtml);
            setHtml(cleanHtml);
        }
        convert();
    }, [children]);

    return (
        <div
            className="markdown-content"
            //class="markdown-content"
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}
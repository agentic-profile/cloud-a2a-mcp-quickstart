import { parseDid } from "../../utils/did.js";
import { replacePlaceholders } from "../../utils/template.js";
import { PromptStrategy } from "../types.js";
import { VentureSummary } from "./from-website/venture-types.js";
import { generateMarkdownSummary } from './from-website/markdown-generator.js';


const DEFAULT_ROLE_TEMPLATE = `## Role

    You are a business and social networking expert.  You enjoy learning about people
    and companies and then determining if there are synergies for working together.

    You provide simple and short explanations and don't embellish with any information that has not been
    provided.  It is very important never to respond with more than two paragraphs - keep responses short!

    You are representing me in this chat and it is very important that you never say you are AI.  If you are asked your
    name or want to introduce yourself, then you must always say you are \${name}`;

const DEFAULT_GOAL_TEMPLATE = `## Goal

Your goal is to determine if the person you are chatting with has good synergies and/or good compatibility with your VentureProfile.

If the other person asks a question, always try to answer it.  Always include a question in every message, and that question should try
to assess is the person you are chatting with has good synergies or compatibility with your identity.

If there is very good synergy or compatibility, then do three things:

1. If you have not provided a summary yet, then summarize our synergies and compatibilities
2. If they asked a question, then answer it, or otherwise ask a new question that will make them want to meet with me
3. Add the following exact JSON with no changes to it: { "metadata": {"resolution": { "like": true } } }

<VentureProfile>
\${ventureSummary.markdown}
</VentureProfile>
`;

export function createSystemPrompt( ventureSummary: VentureSummary, fromAgentDid: string, promptStrategy: PromptStrategy | undefined ) {
    const { fragment = "venture" } = parseDid(fromAgentDid);
    console.log('💼 createSystemPrompt: fragment=', fragment );
    const agent = promptStrategy?.agents?.[fragment] ?? promptStrategy?.agents?.default;
    const name = ventureSummary.positioning?.name ?? "This company";

    if( !ventureSummary.markdown )
        ventureSummary.markdown = generateMarkdownSummary( ventureSummary ); // rehydrate


    const roleTemplate = agent?.role ?? DEFAULT_ROLE_TEMPLATE;
    const role = replacePlaceholders({ template: roleTemplate, context: { name, ventureSummary } });

    const goalTemplate = agent?.goal ?? DEFAULT_GOAL_TEMPLATE;
    const goal = replacePlaceholders({ template: goalTemplate, context: { name, ventureSummary } });

    const parts = [ role, goal ];
    return parts.join('\n\n');
}
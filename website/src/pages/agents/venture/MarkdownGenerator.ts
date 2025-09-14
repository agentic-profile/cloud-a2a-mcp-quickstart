import type { TabValues } from '@/components/TabbedEditableLists';

export interface VentureData {
    problem: string[];
    solution: string[];
    team: (string | number)[][];
    positioning: TabValues[];
    marketOpportunity: (string | number)[][];
    milestones: (string | number)[][];
    references: (string | number)[][];
}

export class MarkdownGenerator {
    /**
     * Generate a complete Markdown summary from venture data
     */
    static generateMarkdownSummary(data: VentureData): string {
        const {
            problem,
            solution,
            team,
            positioning,
            marketOpportunity,
            milestones,
            references
        } = data;

        // Extract positioning values
        const positioningValues = this.extractPositioningValues(positioning);
        
        // Generate positioning statement
        const positioningStatement = this.generatePositioningStatement(positioningValues);

        let markdown = `# ${this.renderPositioning(positioningValues.name)} - Venture Summary\n\n`;
        
        // Positioning Statement
        markdown += `${positioningStatement}\n\n`;

        // Problem
        if (problem.length > 0) {
            markdown += `## Problem\n\n`;
            problem.forEach(item => {
                markdown += `- ${item}\n`;
            });
            markdown += `\n`;
        }

        // Market Opportunity
        if (marketOpportunity.length > 0) {
            markdown += `## Market Opportunity\n\n`;
            marketOpportunity.forEach(([segment, size]) => {
                segment = segment?.toString().trim();
                if (segment) {
                    markdown += `- **${segment}**: ${typeof size === 'number' ? `$${size.toLocaleString()}` : size}\n`;
                }
            });
            markdown += `\n`;
        }

        // Solution
        if (solution.length > 0) {
            markdown += `## Solution\n\n`;
            solution.forEach(item => {
                markdown += `- ${item}\n`;
            });
            markdown += `\n`;
        }

        // Milestones
        if (milestones.length > 0) {
            markdown += `## Milestones\n\n`;
            markdown += `| Milestone | Duration | Funding Needed |\n`;
            markdown += `|-----------|----------|----------------|\n`;
            milestones.forEach(([milestone, duration, funding]) => {
                if (milestone && milestone.toString().trim()) {
                    markdown += `| ${milestone} | ${duration} weeks | ${typeof funding === 'number' ? `$${funding.toLocaleString()}` : funding} |\n`;
                }
            });
            markdown += `\n`;
        }

        // Team
        if (team.length > 0) {
            markdown += `## Team\n\n`;
            markdown += `| Name | LinkedIn | Role |\n`;
            markdown += `|------|----------|------|\n`;
            team.forEach(([name, linkedin, role]) => {
                if (name && name.toString().trim()) {
                    const linkedinText = linkedin && linkedin.toString().trim() ? `[${linkedin}](${linkedin})` : '-';
                    markdown += `| ${name} | ${linkedinText} | ${role || '-'} |\n`;
                }
            });
            markdown += `\n`;
        }

        // References
        if (references.length > 0) {
            markdown += `## References\n\n`;
            references.forEach(([url, description]) => {
                if (url && url.toString().trim()) {
                    markdown += `- [${description || url}](${url})\n`;
                }
            });
            markdown += `\n`;
        }

        return markdown;
    }

    /**
     * Extract positioning values from tab values array
     */
    private static extractPositioningValues(positioning: TabValues[]): Record<string, string> {
        return positioning.reduce((acc, tab) => {
            acc[tab.id] = tab.values[tab.selected];
            return acc;
        }, {} as Record<string, string>);
    }

    /**
     * Generate positioning statement from extracted values
     */
    private static generatePositioningStatement(positioningValues: Record<string, string>): string {
        const { forWho, whoNeed, name, productCategory, keyBenefit, unlike, primaryDifferentiator } = positioningValues;
        
        return `For ${this.renderPositioning(forWho)} that need ${this.renderPositioning(whoNeed)}, ${this.renderPositioning(name)} is a ${this.renderPositioning(productCategory)} that ${this.renderPositioning(keyBenefit)}. Unlike ${this.renderPositioning(unlike)}, our product ${this.renderPositioning(primaryDifferentiator)}.`;
    }

    /**
     * Helper function to render positioning values with placeholders for empty values
     */
    private static renderPositioning(text: string | undefined | null): string {
        text = text?.trim();
        return text && text.length > 0 ? text : "________________________";
    }
}

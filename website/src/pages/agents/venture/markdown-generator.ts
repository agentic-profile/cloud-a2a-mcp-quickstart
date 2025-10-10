import type { VentureSummary } from '@/stores/venture-types';
import { generatePositioningStatement, renderPositioning } from './positioning';

/**
 * Generate a complete Markdown summary from venture data
 */
export function generateMarkdownSummary(data: VentureSummary): string {
    const {
        problem,
        solution,
        team,
        positioning,
        marketOpportunity,
        milestones,
        references
    } = data;

    let markdown = `# ${renderPositioning(positioning?.name)} - Venture Summary\n\n`;
    
    // Generate positioning statement
    if( positioning ) {
        const positioningStatement = generatePositioningStatement(positioning);
        markdown += `${positioningStatement}\n\n`;
    }

    // Problem
    if ( problem && problem.length > 0) {
        markdown += `## Problem\n\n`;
        problem.forEach(item => {
            markdown += `- ${item}\n`;
        });
        markdown += `\n`;
    }

    // Market Opportunity
    if (marketOpportunity && marketOpportunity.length > 0) {
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
    if (solution && solution.length > 0) {
        markdown += `## Solution\n\n`;
        solution.forEach(item => {
            markdown += `- ${item}\n`;
        });
        markdown += `\n`;
    }

    // Milestones
    if (milestones && milestones.length > 0) {
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
    if (team && team.length > 0) {
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
    if (references && references.length > 0) {
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

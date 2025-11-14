/* eslint-disable @typescript-eslint/naming-convention */
import * as core from '@actions/core';
import * as parser from '@babel/parser';
import traverse from '@babel/traverse';
import {exec as execCallback} from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import {promisify} from 'util';

const exec = promisify(execCallback);

type FunctionInfo = {
    name: string;
    file: string;
    startLine: number;
    endLine: number;
    code: string;
};

type ComplexityResult = {
    functionName: string;
    file: string;
    algorithmicComplexity: string;
    cyclomaticComplexity: number;
    status: 'Good' | 'Warning' | 'High';
    details: string;
    callHierarchy: string;
    concerns: string[];
};

/**
 * Call Claude API to analyze code complexity
 */
async function callClaudeAPI(prompt: string, apiKey: string): Promise<string> {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 8000,
            messages: [
                {
                    role: 'user',
                    content: prompt,
                },
            ],
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Claude API error: ${response.status} - ${errorText}`);
    }

    const data = (await response.json()) as {content: Array<{text: string}>};
    return data.content.at(0).text;
}

/**
 * Get changed files from PR
 */
async function getChangedFiles(prNumber: number, githubToken: string): Promise<string[]> {
    const {stdout} = await exec(`gh pr view ${prNumber} --json files --jq '.files[].path'`, {
        env: {...process.env, GH_TOKEN: githubToken},
    });

    return stdout
        .trim()
        .split('\n')
        .filter((file) => file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.jsx'))
        .filter((file) => file.startsWith('src/'));
}

/**
 * Get PR diff for a specific file
 */
async function getPRDiff(prNumber: number, file: string, githubToken: string): Promise<string> {
    const {stdout} = await exec(`gh pr diff ${prNumber} -- "${file}"`, {
        env: {...process.env, GH_TOKEN: githubToken},
    });

    return stdout;
}

/**
 * Extract functions from a TypeScript/JavaScript file
 */
function extractFunctions(filePath: string, fileContent: string): FunctionInfo[] {
    const functions: FunctionInfo[] = [];

    try {
        const ast = parser.parse(fileContent, {
            sourceType: 'module',
            plugins: ['typescript', 'jsx'],
        });

        traverse(ast, {
            FunctionDeclaration(nodePath) {
                const node = nodePath.node;
                if (node.id && node.loc) {
                    functions.push({
                        name: node.id.name,
                        file: filePath,
                        startLine: node.loc.start.line,
                        endLine: node.loc.end.line,
                        code: fileContent
                            .split('\n')
                            .slice(node.loc.start.line - 1, node.loc.end.line)
                            .join('\n'),
                    });
                }
            },
            ArrowFunctionExpression(nodePath) {
                const parent = nodePath.parent;
                if (parent.type === 'VariableDeclarator' && parent.id.type === 'Identifier' && nodePath.node.loc) {
                    const node = nodePath.node;
                    functions.push({
                        name: parent.id.name,
                        file: filePath,
                        startLine: node.loc.start.line,
                        endLine: node.loc.end.line,
                        code: fileContent
                            .split('\n')
                            .slice(node.loc.start.line - 1, node.loc.end.line)
                            .join('\n'),
                    });
                }
            },
            ClassMethod(nodePath) {
                const node = nodePath.node;
                if (node.key.type === 'Identifier' && node.loc) {
                    functions.push({
                        name: node.key.name,
                        file: filePath,
                        startLine: node.loc.start.line,
                        endLine: node.loc.end.line,
                        code: fileContent
                            .split('\n')
                            .slice(node.loc.start.line - 1, node.loc.end.line)
                            .join('\n'),
                    });
                }
            },
        });
    } catch (error) {
        console.warn(`Failed to parse ${filePath}:`, error);
    }

    return functions;
}

/**
 * Determine if a function was modified based on diff
 */
function isFunctionModified(func: FunctionInfo, diff: string): boolean {
    const diffLines = diff.split('\n');
    const addedOrModifiedLines: number[] = [];

    let currentLine = 0;
    for (const line of diffLines) {
        if (line.startsWith('@@')) {
            const match = /@@ -\d+(?:,\d+)? \+(\d+)(?:,\d+)? @@/.exec(line);
            if (match) {
                currentLine = parseInt(match[1], 10);
            }
        } else if (line.startsWith('+') && !line.startsWith('+++')) {
            addedOrModifiedLines.push(currentLine);
            currentLine++;
        } else if (!line.startsWith('-')) {
            currentLine++;
        }
    }

    return addedOrModifiedLines.some((line) => line >= func.startLine && line <= func.endLine);
}

/**
 * Analyze complexity using Claude
 */
async function analyzeComplexityWithClaude(func: FunctionInfo, allFunctions: FunctionInfo[], fileContents: Map<string, string>, apiKey: string): Promise<ComplexityResult> {
    const contextFiles = Array.from(fileContents.entries())
        .map(([filePath, content]) => `File: ${filePath}\n\`\`\`typescript\n${content}\n\`\`\``)
        .join('\n\n');

    const prompt = `You are a code complexity analyzer. Analyze the following function and its call hierarchy for both algorithmic complexity (Big O) and cyclomatic complexity.

TARGET FUNCTION:
File: ${func.file}
Lines: ${func.startLine}-${func.endLine}
\`\`\`typescript
${func.code}
\`\`\`

CONTEXT - All functions in modified files:
${allFunctions.map((f) => `- ${f.name} in ${f.file} (lines ${f.startLine}-${f.endLine})`).join('\n')}

FULL FILE CONTENTS FOR CONTEXT:
${contextFiles}

Please analyze:
1. **Algorithmic Complexity**: Estimate time and space complexity (Big O notation)
2. **Cyclomatic Complexity**: Count decision points (if/else, loops, switch, &&, ||, ?:)
3. **Call Hierarchy**: Identify which functions this calls and which functions call this (up to 3 levels deep)
4. **Concerns**: Identify any performance concerns, nested loops, or complex branching

Respond ONLY with a valid JSON object (no markdown formatting, no code blocks) in this exact format:
{
  "algorithmicComplexity": "O(n) time, O(1) space",
  "cyclomaticComplexity": 8,
  "callHierarchy": "functionName (O(n), M=8)\\n├─ calledFunction1 (O(1), M=3)\\n└─ calledFunction2 (O(n), M=5)",
  "details": "Detailed explanation of the complexity analysis",
  "concerns": ["Concern 1", "Concern 2"]
}`;

    const response = await callClaudeAPI(prompt, apiKey);

    // Parse Claude's response
    let parsed;
    try {
        // Try to extract JSON from response (in case Claude wraps it)
        const jsonMatch = /\{[\s\S]*\}/.exec(response);
        if (jsonMatch) {
            parsed = JSON.parse(jsonMatch[0]) as ComplexityResult;
        } else {
            parsed = JSON.parse(response) as ComplexityResult;
        }
    } catch (error) {
        console.warn(`Failed to parse Claude response for ${func.name}:`, error);
        console.warn('Response was:', response);
        // Fallback to manual analysis
        parsed = {
            algorithmicComplexity: 'Unknown',
            cyclomaticComplexity: 0,
            callHierarchy: `${func.name}`,
            details: 'Failed to analyze',
            concerns: ['Failed to parse complexity analysis'],
        };
    }

    const cyclomaticComplexity = parsed.cyclomaticComplexity || 0;
    let status: 'Good' | 'Warning' | 'High' = 'Good';
    if (cyclomaticComplexity > 15) {
        status = 'High';
    } else if (cyclomaticComplexity > 10) {
        status = 'Warning';
    }

    return {
        functionName: func.name,
        file: func.file,
        algorithmicComplexity: parsed.algorithmicComplexity || 'Unknown',
        cyclomaticComplexity,
        status,
        details: parsed.details || '',
        callHierarchy: parsed.callHierarchy || func.name,
        concerns: parsed.concerns || [],
    };
}

/**
 * Format results as markdown
 */
function formatMarkdownReport(results: ComplexityResult[]): string {
    const statusEmoji = {
        Good: '✅',
        Warning: '⚠️',
        High: '🔴',
    };

    let markdown = '## 🔍 Complexity Analysis Report\n\n';
    markdown += '### Summary\n\n';
    markdown += '| Function | File | Algorithmic | Cyclomatic | Status |\n';
    markdown += '|----------|------|-------------|------------|--------|\n';

    for (const result of results) {
        const emoji = statusEmoji[result.status];
        markdown += `| \`${result.functionName}\` | \`${result.file}\` | ${result.algorithmicComplexity} | ${result.cyclomaticComplexity} | ${emoji} ${result.status} |\n`;
    }

    markdown += '\n';

    for (const result of results) {
        markdown += `<details>\n`;
        markdown += `<summary>📊 Detailed Analysis: ${result.functionName}</summary>\n\n`;
        markdown += `**Call Hierarchy:**\n\`\`\`\n${result.callHierarchy}\n\`\`\`\n\n`;
        markdown += `**Complexity Breakdown:**\n${result.details}\n\n`;

        if (result.concerns.length > 0) {
            markdown += `**Concerns:**\n`;
            for (const concern of result.concerns) {
                markdown += `- ${concern}\n`;
            }
            markdown += '\n';
        }

        markdown += `</details>\n\n`;
    }

    return markdown;
}

/**
 * Post comment to PR
 */
async function postPRComment(prNumber: number, comment: string, githubToken: string): Promise<void> {
    // Write comment to temp file to avoid shell escaping issues
    const tempFile = path.join('/tmp', `complexity-comment-${Date.now()}.md`);
    fs.writeFileSync(tempFile, comment);

    try {
        await exec(`gh pr comment ${prNumber} --body-file "${tempFile}"`, {
            env: {...process.env, GH_TOKEN: githubToken},
        });
        console.log(`Posted complexity analysis comment to PR #${prNumber}`);
    } finally {
        fs.unlinkSync(tempFile);
    }
}

/**
 * Main function
 */
async function run() {
    try {
        const prNumber = parseInt(core.getInput('pr_number', {required: true}), 10);
        const githubToken = core.getInput('github_token', {required: true});
        const anthropicApiKey = core.getInput('anthropic_api_key', {required: true});

        console.log(`Analyzing complexity for PR #${prNumber}`);

        // Get changed files
        const changedFiles = await getChangedFiles(prNumber, githubToken);
        console.log(`Found ${changedFiles.length} changed TypeScript/JavaScript files`);

        if (changedFiles.length === 0) {
            console.log('No TypeScript/JavaScript files changed in this PR');
            return;
        }

        // Read file contents and extract functions
        const fileContents = new Map<string, string>();
        const allFunctions: FunctionInfo[] = [];

        for (const file of changedFiles) {
            try {
                const content = fs.readFileSync(file, 'utf-8');
                fileContents.set(file, content);

                const functions = extractFunctions(file, content);
                allFunctions.push(...functions);
            } catch (error) {
                console.warn(`Failed to read ${file}:`, error);
            }
        }

        console.log(`Extracted ${allFunctions.length} functions from changed files`);

        // Identify modified functions
        const modifiedFunctions: FunctionInfo[] = [];

        for (const file of changedFiles) {
            const diff = await getPRDiff(prNumber, file, githubToken);
            const functionsInFile = allFunctions.filter((f) => f.file === file);

            for (const func of functionsInFile) {
                if (isFunctionModified(func, diff)) {
                    modifiedFunctions.push(func);
                }
            }
        }

        console.log(`Identified ${modifiedFunctions.length} modified functions`);

        if (modifiedFunctions.length === 0) {
            console.log('No modified functions detected in this PR');
            await postPRComment(prNumber, '## 🔍 Complexity Analysis Report\n\nNo modified functions detected in this PR.', githubToken);
            return;
        }

        // Analyze complexity for each modified function
        const results: ComplexityResult[] = [];

        for (const func of modifiedFunctions) {
            console.log(`Analyzing ${func.name} in ${func.file}...`);
            try {
                const result = await analyzeComplexityWithClaude(func, allFunctions, fileContents, anthropicApiKey);
                results.push(result);
            } catch (error) {
                console.error(`Failed to analyze ${func.name}:`, error);
            }
        }

        // Format and post report
        const report = formatMarkdownReport(results);
        await postPRComment(prNumber, report, githubToken);

        console.log('Complexity analysis complete!');
    } catch (error) {
        if (error instanceof Error) {
            core.setFailed(error.message);
            return;
        }
        core.setFailed('An unknown error occurred.');
    }
}

if (require.main === module) {
    run();
}

export default run;

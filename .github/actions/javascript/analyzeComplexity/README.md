# Complexity Analysis Action

This GitHub Action analyzes the algorithmic and cyclomatic complexity of code changes in Pull Requests using Claude AI's deep reasoning capabilities.

## Features

- **Algorithmic Complexity Analysis**: Estimates Big O time and space complexity
- **Cyclomatic Complexity**: Calculates decision point complexity (McCabe complexity)
- **Call Hierarchy Traversal**: Maps function call graphs up to 3 levels deep
- **Automated PR Comments**: Posts structured findings as markdown comments
- **AI-Powered**: Uses Claude Sonnet 4 for deep code understanding

## Usage

### Manual Trigger

The workflow is manually triggered via GitHub Actions UI:

1. Go to **Actions** tab in the repository
2. Select **Complexity Analysis** workflow
3. Click **Run workflow**
4. Enter the PR number to analyze
5. Wait for analysis to complete (typically 2-5 minutes)

### Workflow File

Location: `.github/workflows/complexity-analysis.yml`

```yaml
on:
  workflow_dispatch:
    inputs:
      PR_NUMBER:
        description: 'Pull Request number to analyze'
        required: true
        type: number
```

## Requirements

### Secrets

- `ANTHROPIC_API_KEY`: Required for Claude API access
- `GITHUB_TOKEN`: Automatically provided by GitHub Actions

### Dependencies

The action uses:
- `@actions/core`: GitHub Actions toolkit
- `@babel/parser` and `@babel/traverse`: Code parsing
- GitHub CLI (`gh`): PR interaction
- Node.js 20+

## Output Format

The action posts a comment to the PR with:

### Summary Table

| Function | File | Algorithmic | Cyclomatic | Status |
|----------|------|-------------|------------|--------|
| `processExpenses` | `src/libs/actions/IOU.ts` | O(n²) | 15 | ⚠️ High |
| `validateReport` | `src/libs/ReportUtils.ts` | O(n) | 8 | ✅ Good |

### Detailed Analysis (Collapsible)

For each analyzed function:
- **Call Hierarchy**: Visual tree showing function dependencies
- **Complexity Breakdown**: Explanation of time/space complexity
- **Concerns**: Specific performance issues and recommendations

## Status Indicators

- ✅ **Good**: Cyclomatic complexity ≤ 10
- ⚠️ **Warning**: Cyclomatic complexity 11-15
- 🔴 **High**: Cyclomatic complexity > 15

## Implementation Details

### Analysis Process

1. **Fetch PR Changes**: Gets list of modified TypeScript/JavaScript files
2. **Parse Functions**: Extracts all function definitions using Babel
3. **Identify Modified Functions**: Matches functions to git diff hunks
4. **Analyze with Claude**: For each modified function:
   - Builds context from all files
   - Identifies call hierarchy
   - Estimates algorithmic complexity
   - Calculates cyclomatic complexity
5. **Post Results**: Formats and posts as PR comment

### Supported Files

- `.ts`, `.tsx` - TypeScript files
- `.js`, `.jsx` - JavaScript files
- Only files in `src/` directory

### Analysis Limitations

- Maximum 3 levels of call hierarchy depth
- Focuses on modified functions only (not entire codebase)
- Algorithmic complexity is estimated, not formally proven
- May have false positives for highly dynamic code

## Building

Before the action can run, it must be compiled:

```bash
npm run gh-actions-build
```

This compiles all TypeScript actions including this one using `@vercel/ncc`.

## Development

### Source Files

- `analyzeComplexity.ts`: Main implementation
- `action.yml`: Action metadata
- `index.js`: Compiled output (auto-generated)

### Local Testing

To test changes:

1. Make modifications to `analyzeComplexity.ts`
2. Run `npm run gh-actions-build` to compile
3. Commit both `.ts` and compiled `index.js`
4. Push and trigger workflow on a test PR

## Troubleshooting

### "Action has not been compiled"

Run `npm run gh-actions-build` to compile the TypeScript source.

### "Claude API error"

Check that `ANTHROPIC_API_KEY` secret is properly configured.

### "No modified functions detected"

Ensure the PR modifies functions in TypeScript/JavaScript files under `src/`.

### Analysis takes too long

Large PRs with many modified functions will take longer. Consider:
- Analyzing specific files instead of entire PR
- Breaking large PRs into smaller ones

## Future Enhancements

Potential improvements:
- Support for analyzing specific files/functions
- Historical complexity tracking
- Integration with PR status checks
- Configurable complexity thresholds
- Support for other languages


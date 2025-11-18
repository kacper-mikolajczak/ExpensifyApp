---
allowed-tools: Bash(gh pr comment:*),Bash(gh pr diff:*),Bash(gh pr view:*),Bash(.github/scripts/addPrReaction.sh:*),mcp__github_inline_comment__create_inline_comment
description: Review a code contribution pull request
---

Perform a comprehensive PR review using a specialized subagent:

## Inline Review
Use the code-inline-reviewer agent to:
- Scan all changed source code files
- Create inline comments for specific review rule violations
- Focus on line-specific, actionable feedback

Run the agent and ensure its feedback is posted to the PR.

<important>
BEFORE starting the review, you MUST:
1. Read the "Output Requirements" section in the code-inline-reviewer agent prompt
2. Understand the ONLY two valid outputs: inline comments OR thumbs up reaction
3. Never create summary comments, tables, or explanatory text

Keep feedback concise and follow output rules strictly.
</important>

---
allowed-tools: Bash(gh pr comment:*),Bash(gh pr diff:*),Bash(gh pr view:*)
description: Tell a joke based on the contents of a given PR
---

Analyze the given PR and create a funny, contextual joke based on its contents.

Steps:
1. Review the PR changes, description, and file modifications
2. Identify humorous aspects such as:
   - Naming choices (variable/function names)
   - Type of changes (large refactors, tiny fixes, etc.)
   - Files being modified (e.g., lots of test files, config files)
   - Patterns in the code (repeated patterns, complexity)
   - PR title or description quirks
3. Create a clean, professional joke that relates to what you found

Requirements:
- Keep it lighthearted and respectful (never mean-spirited)
- Make it specific to this PR's content
- Keep it concise (1-3 sentences)
- Add context if needed to explain the joke

Format:
- Start with the joke
- Optionally add "(Context: ...)" if technical explanation helps


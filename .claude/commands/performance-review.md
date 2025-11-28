---
allowed-tools: Bash(gh pr comment:*),Bash(gh pr diff:*),Bash(gh pr view:*),Bash(addPrReaction.sh:*),mcp__github_inline_comment__create_inline_comment
description: Grade-driven performance review for given PR
---


## Grading Scales

**Complexity Scale:**
- 0: No complexity
- 1: Simple
- 2: Medium
- 3: Complex
- 4: Very complex

**Impact Scale:**
- 0: No impact
- 1: Minor impact
- 2: Moderate impact
- 3: Significant impact
- 4: Very significant impact

---

Provide only literal yes/no answer based on the results of the checklist below:

- [ ] Estimate **complexity** of changed functions (use Complexity Scale)
- [ ] Estimate **performance** impact of the changes (use Impact Scale)
- [ ] Estimate **memory** impact of the changes (use Impact Scale)
- [ ] Estimate **CPU** impact of the changes (use Impact Scale)
- [ ] Estimate **network** impact of the changes (use Impact Scale)
- [ ] Estimate **storage** impact of the changes (use Impact Scale)
- [ ] Estimate **security** impact of the changes (use Impact Scale)
- [ ] Estimate **scalability** impact of the changes (use Impact Scale)
- [ ] Estimate **maintainability** impact of the changes (use Impact Scale)

- [ ] Analyze all the results and provide final verdict:
  - If any of the results are above 2, return "no", otherwise return "yes"

<important>
Return only literal yes/no answer based on the results of the checklist above. Do not include any other text or comments.
</important>
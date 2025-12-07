# Review Checklist Interface

This document defines the shared contract that all code review sub-agents must follow when reporting findings to the orchestrator.

## Finding Schema

Each sub-agent must report findings in this exact structure:

```yaml
finding:
  id: string           # Unique finding ID with agent prefix (e.g., "PERF-001", "CONV-003", "DOM-012")
  severity: string     # One of: CRITICAL, WARNING, INFO
  confidence: string   # One of: HIGH, MEDIUM, LOW
  file: string         # Full file path relative to repo root (e.g., "src/components/ReportActionsList.tsx")
  line: number         # Line number where the issue occurs
  title: string        # Short descriptive title (max 80 chars)
  issue: string        # Clear description of what was detected
  rationale: string    # Technical explanation of why this matters
  suggestion: string   # Concrete fix, preferably with code snippet
```

## Severity Levels

- **CRITICAL**: Must be fixed before merge. Security issues, data loss risks, crashes, or severe performance degradation.
- **WARNING**: Should be addressed. Performance issues, anti-patterns, maintainability concerns, or deviations from architecture.
- **INFO**: Consider addressing. Minor improvements, style suggestions, or educational notes.

## Confidence Levels

- **HIGH**: The agent is certain this is a valid finding based on clear pattern matching and context analysis.
- **MEDIUM**: The agent believes this is likely an issue but context or intent may vary.
- **LOW**: The agent suspects a potential issue but recommends human verification.

## Agent Metadata

Each sub-agent must also report metadata about its review:

```yaml
metadata:
  agent_name: string        # Agent identifier (e.g., "React Performance Reviewer")
  agent_prefix: string      # Finding ID prefix (e.g., "PERF", "CONV", "DOM")
  model: string             # Model used (e.g., "claude-sonnet-4-20250514")
  files_reviewed: string[]  # List of files analyzed
  findings_summary:
    critical: number        # Count of CRITICAL findings
    warning: number         # Count of WARNING findings
    info: number            # Count of INFO findings
    high_confidence: number # Count of HIGH confidence findings
    medium_confidence: number
    low_confidence: number
```

## Output Format

Sub-agents must output their findings as a structured report that the orchestrator can parse:

```
=== AGENT REPORT START ===
AGENT: <agent_name>
PREFIX: <agent_prefix>
MODEL: <model>
FILES_REVIEWED: <comma-separated list>

--- FINDINGS ---

[FINDING-1]
ID: <prefix>-001
SEVERITY: <CRITICAL|WARNING|INFO>
CONFIDENCE: <HIGH|MEDIUM|LOW>
FILE: <file_path>
LINE: <line_number>
TITLE: <short_title>
ISSUE: <description>
RATIONALE: <why_it_matters>
SUGGESTION: <fix_with_code_if_applicable>
[/FINDING-1]

[FINDING-2]
...
[/FINDING-2]

--- SUMMARY ---
CRITICAL: <count>
WARNING: <count>
INFO: <count>
HIGH_CONFIDENCE: <count>
MEDIUM_CONFIDENCE: <count>
LOW_CONFIDENCE: <count>

=== AGENT REPORT END ===
```

## Inline Comment Format

The orchestrator will transform findings into inline comments with this structure:

```markdown
### [SEVERITY] Title
**Confidence**: High/Medium/Low | **Source**: Agent Name

**Issue**: Clear description of what was detected

**Why this matters**: Technical rationale explaining impact

**Suggestion**:
<concrete fix - code snippet when applicable>

---
*Finding ID: AGENT-NNN*
```

## Guidelines for Sub-Agents

1. **Be precise**: Only report findings you can locate to a specific file and line number.
2. **Be actionable**: Every finding must include a concrete suggestion for how to fix it.
3. **Avoid duplicates**: Do not report the same issue multiple times for the same location.
4. **Respect scope**: Only analyze files that changed in the PR diff.
5. **Use appropriate confidence**: If unsure, use MEDIUM or LOW confidence rather than skipping.
6. **Reference documentation**: When applicable, cite project docs (CLAUDE.md, contributing guides) in rationale.
7. **Focus on your domain**: Stay within your specialized area; don't overlap with other agents' responsibilities.


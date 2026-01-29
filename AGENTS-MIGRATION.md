# CLAUDE.md → AGENTS.md Migration

## Status: Complete (Phase 1)

**Completed on**: 2026-01-29

### What Was Done

1. ✅ Renamed `/Expensify-App/CLAUDE.md` → `/Expensify-App/AGENTS.md`
2. ✅ Verified no other references to CLAUDE.md in `.claude/README.md`
3. ✅ Content preserved as-is (rename only, minimal cleanup)

### Why This Matters

[AGENTS.md](https://agents.md/) is an open standard (July 2025, Sourcegraph Amp team) for AI coding assistants:
- **Purpose**: "One file, any agent" - vendor-neutral config replacing tool-specific files
- **Adoption**: 20k+ GitHub repos
- **Support**: Claude Code, Cursor, Windsurf, Codex, Aider, etc.
- **Backward compatible**: Claude Code still reads both CLAUDE.md and AGENTS.md

---

## Future Improvements (Phase 2)

These improvements are planned for the next iteration to fully leverage the AGENTS.md standard.

### Structure Reorganization

Target structure for better agent parsing:

```
AGENTS.md
├── Quick Context (2-3 sentence summary)
├── Key Constraints (architectural rules, HybridApp caveats)
├── Codebase Map (entry points, directory structure, key files by feature)
├── Development Commands (unchanged)
├── Architecture Deep Dive (condensed from current 266 lines)
└── Agent Instructions (code style, testing, PR conventions)
```

### Content Improvements

| Section | Current Issue | Proposed Fix |
|---------|---------------|--------------|
| Key Features | Too verbose for AI parsing | Condense to bullet list with file paths |
| Navigation | Missing actual file paths | Add `src/libs/Navigation/` structure details |
| State Management | Generic descriptions | Add actual Onyx key examples |
| Build & Deployment | CI/CD list unhelpful for local dev | Focus on local dev commands |
| Related Repositories | Sparse Mobile-Expensify info | Expand submodule integration details |

### New Sections to Add

- **Quick Context Block** - 5-line summary for fast agent loading
- **File Patterns** - Where to find things (e.g., "tests live in `*.test.ts` beside source")
- **Common Mistakes** - Anti-patterns to avoid when modifying the codebase
- **Change Checklist** - What to update when modifying specific features

### Agent-Agnostic Changes

- [ ] Add YAML frontmatter for tool compatibility:
  ```yaml
  ---
  version: 1.0
  supported_tools: [claude, cursor, copilot, aider, continue]
  ---
  ```
- [ ] Update `/playwright-app-testing` skill reference to generic "browser testing available"
- [ ] Standardize command formatting for better agent parsing

---

## Files Involved

### Current State
- ✅ `/Expensify-App/AGENTS.md` (renamed from CLAUDE.md)
- `/Expensify-App/Mobile-Expensify/CLAUDE.md` (left as-is, can be migrated independently)

### CI/CD Impact
- No action needed - Claude Code reads both file names
- Workflows and GitHub Actions unaffected

---

## Decisions Made

| Question | Decision | Rationale |
|----------|----------|-----------|
| Symlink CLAUDE.md? | No | Claude Code reads both files; no compatibility needed |
| Skill references | Keep as-is for now | `/playwright-app-testing` is Claude Code specific; can normalize in Phase 2 |
| Mobile-Expensify submodule | Leave as CLAUDE.md | Will migrate independently when team is ready |
| Current scope | Rename only | Restructuring planned for Phase 2 to minimize breaking changes |

---

## Next Steps (When Ready)

1. **Phase 2 Prep**: Gather feedback from team on proposed structure
2. **Structure Reorganization**: Refactor AGENTS.md per "Structure Reorganization" section
3. **Content Polish**: Add new sections and standardize existing ones
4. **Validation**: Test with multiple agents (Claude Code, Cursor, etc.) to ensure compatibility
5. **Mobile-Expensify**: Migrate submodule's CLAUDE.md when Phase 1 is stable

---

## References

- [AGENTS.md Standard](https://agents.md/)
- [Claude Code Documentation](https://docs.anthropic.com/en/docs/claude-code)
- Original CLAUDE.md structure preserved for transition period

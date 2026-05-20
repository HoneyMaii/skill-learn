# Trellis Source Notes

Frozen for: Chinese long-form HTML presentation about `mindfold-ai/Trellis`, with Codex as the primary environment.

Last checked: 2026-05-18.

## Source Status

Official sources checked:

- GitHub repository: https://github.com/mindfold-ai/Trellis
- Install and first task: https://docs.trytrellis.app/start/install-and-first-task
- Quick start URL requested by plan: https://docs.trytrellis.app/guide/ch02-quick-start
- How it works: https://docs.trytrellis.app/start/how-it-works
- Everyday use: https://docs.trytrellis.app/start/everyday-use
- Configuration: https://docs.trytrellis.app/advanced/configuration
- Chinese install page: https://docs.trytrellis.app/zh/start/install-and-first-task
- Local prior record: `records/trellis.md`

Verification notes:

- The official docs site was reachable during this task.
- The requested `/guide/ch02-quick-start` page redirects to `/start/install-and-first-task`; treat it as an older or aliased quick-start URL rather than a distinct chapter page.
- The docs pages currently show a beta banner for the 0.6 track. Some official snippets use beta install commands while the GitHub README and local record use stable/latest wording. The deck should avoid implying that one command is universally canonical without naming the source/version context.

## Concise Verified Facts

- Trellis is published by Mindfold / `mindfold-ai` and its GitHub repository describes it as an agentic software engineering framework.
- License is AGPL-3.0, verified from the GitHub repository license metadata and local record.
- Trellis is not just a single skill. It installs a project workflow layer with tasks, specs, workspace memory, hooks, skills, and agent/platform integration files.
- Trellis aims to make AI coding more structured by moving from single prompts to a repeatable workflow with task context, PRD-style planning, checks, memory, and archival.
- Trellis supports multiple AI coding environments. Official docs mention Claude Code, Codex, Cursor, Gemini CLI, and OpenCode in setup examples.
- Official installation requirements shown in the docs are Node.js 18+ and Python 3.9+.
- The package can be installed globally with npm. Official docs for the beta track show `npm install -g @mindfoldhq/trellis@beta`; the local record and GitHub/README-oriented usage show `npm install -g @mindfoldhq/trellis` or `@latest`.
- Project initialization is done with `trellis init -u <username>`.
- Codex can be selected explicitly during initialization with `trellis init -u <username> --codex`.
- Multiple platform targets can be initialized together, for example `--codex --claude --cursor --opencode`.
- Trellis creates `.trellis/` as the core project workflow directory.
- In Codex projects, Trellis also uses Codex-facing files such as `.codex/` and `AGENTS.md`, plus shared agent skill files under `.agents/skills/`.
- The official workflow emphasizes starting with a task description, generating or refining a task/PRD, implementing with loaded context, checking against requirements/specs, then updating reusable memory/specs when appropriate.

## Codex-Specific Setup Notes

- Recommended minimal Codex-first initialization for a test project:

```bash
npm install -g @mindfoldhq/trellis
trellis init -u your-name --codex
```

- If following the currently displayed beta docs, the install command may be:

```bash
npm install -g @mindfoldhq/trellis@beta
```

- Codex hook support must be enabled in the user-level Codex config:

```toml
[features]
hooks = true
```

- Official docs/local record indicate Codex 0.129+ may require running `/hooks` inside Codex and approving the Trellis hook. Until hook approval is complete, Trellis may fall back to skill-driven/manual context loading, but the experience is less automatic.
- For a first Codex run, keep the default Codex dispatch behavior unless there is a strong reason to test sub-agent dispatch. The local record identifies `codex.dispatch_mode: inline` as the safer default to explain in the deck.
- Trellis initialization may create or modify files that should be intentionally reviewed before committing: `.trellis/`, `.codex/`, `.agents/skills/`, and `AGENTS.md`.

## Mental Model for the Deck

Use this framing:

- Trellis is an AI engineering operating layer for a repository, not a prompt snippet and not one standalone `SKILL.md`.
- `.trellis/tasks/` is for current work: task description, PRD, acceptance criteria, research, implementation/check context, and archives.
- `.trellis/spec/` is for reusable project rules: architecture conventions, testing expectations, style rules, domain vocabulary, and other knowledge future tasks should load.
- `.trellis/workspace/<user>/` is personal working memory: journal/session notes and developer-local context.
- `.agents/skills/` is the portable skill surface used by supported agent platforms.
- `AGENTS.md` is the Codex-facing project entrypoint that tells Codex how to use the workflow.

Suggested Chinese explanation:

- Do not present Trellis as "another AI coding tool".
- Present it as "把 AI 编码变成有任务、上下文、规范、检查和记忆的工程流程层".
- The key shift is from "ask the model to edit code" to "give the model a maintained project process".

## Everyday Workflow Notes

Deck-safe flow:

1. User describes the task.
2. Trellis helps shape task context and PRD/acceptance criteria.
3. User confirms scope before implementation.
4. The agent reads relevant task context and reusable specs.
5. Implementation happens inside the repository.
6. Check phase compares work against PRD, specs, lint/type-check/tests where available.
7. Reusable learnings are promoted into `.trellis/spec/`.
8. Finished work is archived/journaled after the code work is done.

Important wording:

- Trellis does not remove the need to review diffs.
- Trellis improves consistency only if the team writes useful specs and keeps task boundaries clear.
- For tiny one-line edits, the full workflow may be overhead.

## Pitfalls and Caveats

- Version ambiguity: public docs currently show beta 0.6 messaging while other official/local material may use stable/latest commands. The deck should say "depending on the release track" around install commands.
- Do not imply Trellis is only for Codex. Codex is the presentation's primary environment, but Trellis is multi-platform.
- Do not imply hooks are optional polish only. For Codex, hook approval materially affects how automatically Trellis injects context.
- Do not put all project knowledge into task files. Current-task facts belong in `.trellis/tasks/`; reusable rules belong in `.trellis/spec/`.
- Do not overfill `implement.jsonl` or `check.jsonl` with arbitrary source files. The local record recommends prioritizing specs/research rather than dumping the codebase.
- Do not run `/trellis:finish-work` as a substitute for committing or reviewing code. Treat finish/archive as a final workflow step after code work is complete.
- Understand `session_auto_commit` before using Trellis in an important repo. If automatic journal/archive commits are not desired, the local record recommends setting it to `false`.
- First evaluation should happen in a demo project or non-critical repo. The local record's staged test plan remains appropriate.
- Teams should decide whether `.trellis/`, `.codex/`, `.agents/`, and `AGENTS.md` are meant to be committed before introducing Trellis into a shared repository.

## Explicit Assumptions for the Chinese Deck

- Audience: developers who already use Codex or similar coding agents and want a more durable workflow for real projects.
- Primary demo environment: Codex on a local repository.
- The deck can use `trellis init -u your-name --codex` as the main setup path.
- The deck should show both stable/latest and beta install variants only if it explicitly explains release-track differences.
- The deck should emphasize workflow value over tool hype: PRD, context discipline, spec reuse, check phase, and memory.
- The deck should recommend starting with one small feature in a test repo before using Trellis on a production codebase.
- The deck should state that some operational details, especially hook behavior and dispatch mode, must be rechecked against the installed Trellis/Codex versions during live demo preparation.

## Deck Outline Seeds

- Opening thesis: "Trellis turns AI coding from chat-driven edits into repository-level operating procedure."
- Problem slide: AI loses context, forgets rules, edits beyond scope, and repeats the same mistakes.
- Core idea slide: task context + reusable specs + workspace memory + check loop.
- Codex setup slide: Node/Python prerequisites, npm install, `trellis init --codex`, Codex hooks.
- Directory map slide: `.trellis/tasks`, `.trellis/spec`, `.trellis/workspace`, `.agents/skills`, `.codex`, `AGENTS.md`.
- Workflow slide: brainstorm/PRD -> implement -> check -> update specs -> finish/archive.
- Pitfalls slide: version track, hooks, auto-commit, over-broad specs, using it for trivial edits.
- Recommendation slide: start with Codex inline/default mode and a small test project.

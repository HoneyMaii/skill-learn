---
name: git-commit-message
description: Use when the user asks for a git commit message, Conventional Commits draft, commit type/scope selection, or help preparing a git commit from staged/unstaged changes
license: MIT
allowed-tools: Bash
---

# Git Commit Message Generator

## Overview

Generate a Conventional Commits message from the actual git diff. Default user-facing commit `description` and `body` text is Chinese unless the user explicitly requests another language.

Only after showing a single concrete recommended commit message, ask whether the user wants help running `git commit`. Prefer the platform native structured yes/no choice UI when available; otherwise fall back to typed confirmation. Do not ask before a recommended message exists. Only run `git commit` after the user explicitly selects or types `yes`. It must not run `git push`, change git config, rewrite history, or modify the staging area unless the user explicitly asks for that separate git operation.

## Commit Format

```text
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

## Workflow

### 1. Inspect Git State

Run status first, then inspect the relevant diff:

```bash
git status --porcelain

# If files are staged, use staged diff as the commit source
git diff --staged

# If nothing is staged, use working tree diff
git diff
```

Rules:

- If staged and unstaged changes both exist, generate the message for staged changes only and mention that unstaged changes are not included.
- If nothing is staged, generate the message from the working tree diff and say it is based on unstaged changes.
- If untracked files exist, `git diff` will not show their content. Mention them from `git status --porcelain`; inspect file content only when needed to make the message accurate.
- If there is no diff, say there is nothing to summarize instead of inventing a message.

### 2. Check Commit Boundaries

Before writing the final message, decide whether the diff is one logical change.

If changes are unrelated, do not force one vague message. Suggest splitting them into smaller commits and provide grouped message drafts when possible.

Do not modify the staging area automatically. You may show manual examples only when useful:

```bash
git add path/to/file1 path/to/file2
git add -p
```

### 3. Detect Safety Risks

Flag suspicious commit content before suggesting a final message:

- Secrets or credentials: `.env`, tokens, private keys, certificates, connection strings
- Large generated outputs or vendored files
- Accidental local/editor files
- Destructive migration or schema changes when the user did not explicitly request database structure changes

### 4. Choose Type, Scope, and Text

Use standard Conventional Commit types:

| Type | Use for |
| --- | --- |
| `feat` | User-visible feature or capability |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting only, no behavior change |
| `refactor` | Code restructuring without feature/fix intent |
| `perf` | Performance improvement |
| `test` | Tests only or test coverage |
| `build` | Build system or dependencies |
| `ci` | CI configuration |
| `chore` | Maintenance that does not fit above |
| `revert` | Revert a previous commit |

Scope rules:

- Prefer stable module, package, directory, feature, or domain names.
- Keep scope machine-friendly and usually English, for example `auth`, `api`, `parser`, `readme`.
- Omit scope when the change is broad or a scope would be misleading.
- Avoid vague scopes such as `misc`, `update`, or `changes`.

Description rules:

- Chinese by default; use another language only when the user asks.
- Present tense and action-oriented wording.
- Aim for 72 characters or less.
- Do not end the description with a period.

Body rules:

- Add a body only when the diff needs context that does not fit the subject line.
- Explain why or summarize important implementation details; do not repeat the subject.

Footer rules:

- Preserve standard footer conventions such as `BREAKING CHANGE:`, `Closes #123`, and `Refs #456`.
- For breaking changes, use `type!:` and/or a `BREAKING CHANGE:` footer.

## Output

Return a clear recommendation first:

```text
<recommended commit message>
```

When useful, include brief notes after the message:

- Mention whether it was based on staged or unstaged changes.
- Mention excluded unstaged or untracked files.
- Mention split-commit recommendations.
- Offer 1-2 alternative messages only if there are credible naming/type choices.

After showing one concrete recommended commit message and any notes, ask the user to choose.

Prefer native structured choices when the platform supports them:

```text
要我用这条消息帮你执行 git commit 吗？

Options:
- yes
- no
```

If native choices are unavailable, fall back to typed confirmation:

```text
要我用这条消息帮你执行 git commit 吗？如果需要，请回复 yes；否则回复 no。
```

Do not include `git commit` commands unless the user explicitly asks for command examples.

## Commit Confirmation Gate

Only execute `git commit` when all of these are true:

- One concrete recommended commit message has already been shown to the user in the immediately preceding response.
- The user explicitly chooses `yes` through the native choice UI, or types exactly `yes` after the fallback confirmation question.
- There are staged changes to commit.
- No unresolved safety risk was flagged.

Treat anything other than an explicit selected or typed `yes` as not confirmed. `no`, closing/dismissing the prompt, no response, rejected platform permission, silence, `ok`, `好`, `可以`, `提交吧`, `LGTM`, or other ambiguous approval means do not commit.

If the message was generated from unstaged changes, do not ask to commit immediately. Tell the user to stage the intended files first, or to explicitly request a separate staging operation. Never run `git add` as part of this skill unless the user separately asks for staging.

When confirmation is valid, run `git commit` with the exact recommended message. For multi-line messages, preserve the subject, body, and footers. Never add `--no-verify`, never amend, never force, and never push.

## Examples

```text
feat(auth): 支持通过设备码登录

fix(api): 修复提交为空时的崩溃问题

docs(readme): 更新安装说明

refactor(parser): 简化配置解析流程

test(cli): 补充参数解析异常场景测试

feat(config)!: 移除旧版配置加载入口

BREAKING CHANGE: 不再支持 `legacyConfigPath`
```

## Common Mistakes

- Using `chore` for feature, fix, test, docs, build, or CI changes that have a more precise type.
- Writing vague descriptions such as `更新代码`, `修改文件`, or `fix bug`.
- Summarizing staged and unstaged changes together without telling the user.
- Ignoring untracked files that are intended for the commit.
- Creating one commit message for unrelated changes instead of recommending a split.
- Asking to commit before a recommended message is shown, running commit without an explicit selected or typed `yes`, treating `no` or dismissed prompts as approval, or running push, staging, reset, config, amend, force, or other history-changing commands from this skill.

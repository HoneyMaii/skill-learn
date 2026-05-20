---
name: technical-note-guide
description: Use when turning technical notes, docs, READMEs, CLI/framework/library learning material, agent skill experience, or engineering methods into a polished scrollable HTML tutorial guide instead of slides, PPT, or a presentation deck.
---

# Technical Note Guide

## Overview

Create high-quality, scrollable HTML technical tutorial guides with explicit source notes and browser verification. Default outputs are `guide.html`, `source-notes.md`, `verify-guide.js`, and `guide-preview.png`.

This skill is for readable tutorial pages, not slide decks. If the user says "HTML notes" without mentioning slides, confirm the intended artifact is a scrollable guide before generating UI.

## Required Companion Skills

Declare every companion skill you use in the user-visible update before applying it.

- **Required for every guide task:** Use `brainstorming` to confirm theme, audience, depth, language, scope, and whether the output is a tutorial guide, reference manual, or workshop page.
- **Required before writing files:** Use `writing-plans` to produce a concise implementation plan before creating `guide.html`, `source-notes.md`, or verification scripts.
- **Required before generating or redesigning `guide.html`:** Use `design-taste-frontend` explicitly. This local skill may also be referred to by its directory alias `taste-skill` at `C:\Users\220700398\.codex\skills\taste-skill\SKILL.md`.
- **Required for existing guide redesigns:** Use `redesign-existing-projects` and still use `design-taste-frontend` for UI taste, layout, and responsive constraints.
- **Required before claiming completion:** Use `verification-before-completion` and run the verification gates in this skill.
- **Only when creating or updating this skill itself:** Use `skill-creator`, `write-a-skill`, or `writing-skills`. Do not load those skills for ordinary guide generation.
- **Only when the user explicitly asks for PPT, slides, presentation, or 演示文稿:** Use full `frontend-slides`. Otherwise only read its `STYLE_PRESETS.md` when the user wants its style discovery method.

No `guide.html` may be called complete unless `design-taste-frontend` / `taste-skill` was loaded and applied.

## Workflow

1. **Freeze sources**
   - Read provided notes, local docs, READMEs, official docs, changelogs, and version notes.
   - Browse current official docs when versions, commands, APIs, prices, rules, or product behavior may have changed.
   - Write `source-notes.md` with sources, versions, facts, assumptions, and caveats. Do not hard-code uncertain or stale commands as facts.

2. **Confirm intent**
   - Use `brainstorming`.
   - Confirm audience, task depth, language, and output shape.
   - Classify the page as tutorial guide, reference manual, or workshop exercise page.
   - If the user did not ask for slides, keep the output as a scrollable guide.

3. **Plan**
   - Use `writing-plans`.
   - Specify files to create or modify and verification commands.
   - Keep the plan practical; do not add a framework unless the user asked for one.

4. **Design Taste Gate**
   - Use `design-taste-frontend` / `taste-skill` before creating or modifying `guide.html`.
   - Read `references/guide-ui-patterns.md` for guide-specific UI rules.
   - Establish the default visual baseline from `projects/trellis-complete-guide/guide.html`: warm editorial grid-paper background, subtle fixed noise, Geist/Noto Sans SC typography, blue-green accent system, glassy topbar/hero/sidebar panels, rounded tutorial sections, compact sticky nav, light Command Typewriter panels, mobile single-column fallback, and transform/opacity motion only.
   - Reject generic AI UI: purple-blue gradients, emoji, excessive glow, forced three-card rows, cards inside cards, oversized H1s, and slide-deck composition.
   - For existing pages, audit for equal three-card grids, overlarge centered hero, purple/blue gradients, missing responsive constraints, nested cards, `.slide`, `scroll-snap`, 100vh slide fitting, keyboard page controls, and presentation nav dots.

5. **Preview direction**
   - Generate or describe one guide preview direction by default: Trellis complete-guide editorial style + Apple tutorial tone + Editorial Learning Path + Command Typewriter.
   - If the user wants style selection, borrow only `frontend-slides` mood/vibe and `STYLE_PRESETS.md` ideas to produce 2-3 guide previews.
   - Previews must remain scrollable guide previews, never slide previews.

6. **Generate guide**
   - Start from `assets/templates/guide.html` unless the project already has a better compatible structure.
   - Include sticky sidebar navigation, reading progress, semantic sections, code copy buttons, callouts, checklists, case studies, prompt panels, and Command Typewriter blocks.
   - Keep the default artifact zero-dependency static HTML.
   - Display commands, configuration, prompts, and code with Command Typewriter or prompt-template components.
   - Copy buttons must read canonical text from an adjacent hidden `<code>` element or equivalent stable source, not from animated or line-wrapped display text.
   - Active navigation must update to the section currently occupying the reading position; long sections must not leave the sidebar one section behind.

7. **Verify**
   - Use `verification-before-completion`.
   - Run the local `verify-guide.js` copied or adapted from `scripts/verify-guide.js`.
   - Static gate: no `TODO`, `TBD`, `placeholder`, `.slide`, `scroll-snap`, full-screen slide viewport fitting, keyboard pagination, nav dots, or presentation controls.
   - Browser gate: desktop and mobile have no horizontal overflow; sections, nav links, copy buttons, progress bar, active sidebar sync, Command Typewriter copy, and prompt-template copy all work.
   - Generate `guide-preview.png` from the browser session.

## Frontend Slides Reuse Policy

Default to `technical-note-guide` + `design-taste-frontend` for tutorials, technical notes, HTML guides, and learning pages. Use full `frontend-slides` only for explicit slide or presentation requests.

Allowed reuse:
- Mood/vibe choices: Impressed/Confident, Excited/Energized, Calm/Focused, Inspired/Moved.
- Theme names, typography, color, and atmosphere from `frontend-slides/STYLE_PRESETS.md`.
- "Show, Don't Tell" preview selection, adapted to guide preview screenshots.

Forbidden reuse:
- `.slide` structure.
- `scroll-snap`.
- 100vh slide viewport fitting.
- Keyboard page-turning.
- Navigation dots or presentation controls.
- Full `frontend-slides` Phase 3 presentation generation workflow.

## Resources

- `references/guide-ui-patterns.md`: guide layout, component, motion, responsive, and anti-pattern rules.
- `assets/templates/guide.html`: static starter template using the Trellis complete-guide visual style with topbar, hero summary panel, sidebar, reading progress, Command Typewriter, copy buttons, callout, checklist, case study, and prompt panel.
- `scripts/verify-guide.js`: parameterized Playwright verification script. Copy it next to the generated guide as `verify-guide.js` and run it against `guide.html`.

## Quality Bar

Successful guide output includes:
- `guide.html`: polished scrollable tutorial UI, no framework required by default.
- `source-notes.md`: sources, version caveats, facts, assumptions.
- `verify-guide.js`: project-local verifier.
- `guide-preview.png`: screenshot from Playwright.

Stop and revise if verification finds horizontal overflow, stale active nav, broken copy behavior, slide/deck structure, placeholder text, or a guide made without the Design Taste Gate.

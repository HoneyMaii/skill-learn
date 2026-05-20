# Guide UI Patterns

Use this reference after loading `design-taste-frontend` / `taste-skill`.

## Design Baseline

Default to the visual language of `projects/trellis-complete-guide/guide.html`:

- Warm editorial grid-paper page background: `#fffdf8` to `#f7f4ee` with faint grid lines and a subtle fixed noise overlay.
- Blue-green primary accent system: blue for section indexes/progress, green for status and learning path markers, amber/red only for warning or danger states.
- Geist + Noto Sans SC for Chinese-heavy pages; IBM Plex Mono, Geist Mono, or JetBrains Mono for commands.
- Topbar with compact brand mark and chips, then a non-centered hero with a large balanced title and a right-side lesson summary panel.
- Glassy rounded panels: translucent warm white surfaces, inset 1px borders, soft warm shadows, radius around 14-32px depending on scale.
- Sticky sidebar on desktop with compact nav pills and active section state; mobile collapses to single-column with two-column nav before one-column fallback.
- Rounded tutorial section panels with section kicker, monospace index, restrained H2 scale, and readable lead text.
- Light Command Typewriter panels with grid texture, command lines prefixed by `>`, staggered transform/opacity entry, cursor blink, and hidden canonical copy code.
- Reading progress bar fixed to the top edge with blue-green gradient.
- CSS Grid for macro layout; avoid flex percentage math.
- Motion limited to transform and opacity. Use short transitions and respect `prefers-reduced-motion`.
- Cards only for repeated items, case notes, prompt rules, or framed tools. Do not put cards inside cards.

If the local Trellis project is available, inspect `projects/trellis-complete-guide/guide.html` before building a new guide and reuse its visual rhythm. Do not copy Trellis-specific text unless the topic is Trellis.

## Forbidden Patterns

Reject these before implementation and during verification:

- `.slide`, slide deck, PPT, full-screen page-turning, or keyboard pagination structure.
- `scroll-snap` and 100vh slide fitting.
- AI purple/blue gradients, neon glow, excessive shadows, or one-note purple palette.
- Emoji in UI text, labels, alt text, or code.
- Generic three equal cards as the main teaching structure.
- Overlarge centered H1 that makes the page read like a landing page.
- Nested cards, decorative blobs, arbitrary orbs, and bokeh backgrounds.
- Horizontal overflow at any viewport.

## Information Architecture

Choose one before writing UI:

- **Tutorial guide:** learning path with a narrative sequence, "why this matters", commands, checkpoints, and practice prompts.
- **Reference manual:** dense sections, searchable table of contents, quick API/CLI tables, and version caveats.
- **Workshop page:** numbered exercises, expected outcomes, self-checks, and solution reveals.

Use section IDs that are stable and human-readable. Keep sidebar labels shorter than 32 characters.

## Required Components

### Sticky Sidebar

- Use semantic `<aside>` and `<nav>`.
- Keep it sticky only on desktop; mobile nav must not cause horizontal overflow.
- Active nav should update by measuring section intersections against a top offset near 30% of viewport height.
- Long sections must stay active while the reader is inside them.

### Reading Progress

- Fixed top progress bar.
- Width is `scrollTop / (scrollHeight - innerHeight)`.
- Use transform scale or width updates with requestAnimationFrame.

### Command Typewriter

- Show commands/configs/prompts in a styled terminal-like block.
- The animated text is presentational only.
- The copy button reads canonical content from a hidden adjacent `<code data-copy-source>`.
- Provide a reduced-motion fallback that renders the full command immediately.

### Copy Button

- Every copy button points to a stable source by `data-copy-target`.
- It never copies from line-wrapped visual text or typewriter output.
- Button state changes to "Copied" briefly and returns to "Copy".
- Clipboard failure should set a visible failure label, not throw silently.

### Callout

- Use understated variants: note, warning, version, practice.
- No emoji icons. Use labels or simple CSS marks.
- Keep callouts narrow enough for reading rhythm, about `65ch` max for body text.

### Checklist

- Use real checkboxes or semantic lists.
- Checklist items should represent learner actions, not decorative bullets.

### Case Study

- Include context, decision, outcome, and what to copy into future work.
- Avoid fake company clichés and perfect round metrics.

### Prompt Template

- Use for agent prompts, migration prompts, review prompts, and debugging prompts.
- Store canonical prompt text in hidden `<code data-copy-source>`.
- Use whitespace-preserving copy.

## Frontend Slides Style Reuse

Allowed: read `frontend-slides/STYLE_PRESETS.md` for mood and palette inspiration, then translate the theme into long-form guide UI.

Not allowed: copying any slide mechanics, `.slide`, `scroll-snap`, nav dots, keyboard controls, or 100vh page fitting.

## Responsive Rules

- Desktop: two-column layout with sidebar and article content.
- Tablet: narrower sidebar or top-aligned contents list.
- Mobile: one column, no sticky sidebar, no fixed-width code blocks.
- Code blocks use `overflow-x: auto` inside the article, while the page itself must not overflow horizontally.
- Use `max-width`, `minmax(0, 1fr)`, and `box-sizing: border-box`.

## Verification Targets

Run the guide verifier and confirm:

- No horizontal overflow at desktop and mobile widths.
- All sidebar links resolve to sections.
- Progress bar changes after scrolling.
- Active nav matches the visible section, including long sections such as 08/09.
- Copy buttons copy canonical `<code data-copy-source>` content.
- Command Typewriter and prompt-template copy behavior works.
- No `TODO`, `TBD`, `placeholder`, `.slide`, `scroll-snap`, keyboard pagination, nav dots, or presentation controls.

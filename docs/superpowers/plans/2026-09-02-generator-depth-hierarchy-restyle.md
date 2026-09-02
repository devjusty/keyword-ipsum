# Generator Depth, Hierarchy, Spacing, and Layout Restyle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle Keyword Ipsum into a clear editorial workbench with stronger hierarchy, restrained depth, deliberate spacing, and reliable narrow-screen composition without changing generator behavior.

**Architecture:** Keep `App` as page shell and `Generator` as state owner. Add semantic presentation wrappers in the existing form, result, and chip components; centralize their visual language in `src/index.css` using the existing Tailwind/daisyUI setup. No generator logic or data flow changes.

**Tech Stack:** React 19, Tailwind CSS 4, daisyUI 5, Radix Icons, Vite, Vitest.

---

## File Map

- Modify `src/App.jsx`: page heading, masthead, intro, and workbench presentation wrappers.
- Modify `src/components/GeneratorForm.jsx`: semantic control tiers and presentation classes; preserve controlled inputs and handlers.
- Modify `src/components/GeneratorResult.jsx`: empty/generated output surfaces, reading measure, count row, and copy action presentation.
- Modify `src/components/ChipInput.jsx`: chip/input presentation, focus treatment, and clear-action layout; preserve input behavior.
- Modify `src/index.css`: semantic tokens, surfaces, type scale, spacing, layout, responsive rules, focus treatment, and reduced-motion rules.
- Verify existing tests in `src/utils/*.test.js` and `src/components/hooks/useSynonymFetcher.test.js`; add no behavior tests unless implementation changes behavior.

## Task 1: Establish page-shell hierarchy

**Files:**

- Modify: `src/App.jsx`
- Modify: `src/index.css`

- [ ] **Step 1: Update page-shell markup only**

Add stable presentation classes while keeping one visible `h1`, the existing intro copy, and the generator landmark:

```jsx
<main className="app-shell">
  <header className="app-header">
    <div className="app-brand-mark" aria-hidden="true">
      <BookOpenIcon width="22" height="22" />
    </div>
    <div>
      <p className="app-kicker">Keyword tool</p>
      <h1>Keyword Ipsum</h1>
    </div>
  </header>

  <section className="app-intro" aria-labelledby="intro-heading">
    <h2 id="intro-heading" className="sr-only">
      Keyword text generator
    </h2>
    <p>
      Turn a handful of keywords into custom Lorem Ipsum for layouts, drafts,
      and prototypes.
    </p>
  </section>

  <section className="workbench" aria-label="Ipsum generator">
    <Generator />
  </section>
</main>
```

- [ ] **Step 2: Add page-shell tokens and layout rules**

In `src/index.css`, retain Tailwind/daisyUI directives and existing color notation. Add semantic custom properties for page spacing, surfaces, rules, type roles, and focus. Style `.app-header`, `.app-brand-mark`, `.app-kicker`, `.app-intro`, and `.workbench` so the header, intro, and workbench form three distinct levels.

Use logical properties, `min-width: 0`, `text-wrap: balance` for headings, `text-wrap: pretty` for intro copy, and a capped intro measure. Keep `html` and `body` at `overflow-x: clip`.

- [ ] **Step 3: Run static checks**

Run: `pnpm lint`

Expected: PASS with zero warnings.

- [ ] **Step 4: Commit**

```bash
git add src/App.jsx src/index.css
git commit -m "style: strengthen page hierarchy"
```

## Task 2: Rebuild form presentation tiers

**Files:**

- Modify: `src/components/GeneratorForm.jsx`
- Modify: `src/index.css`

- [ ] **Step 1: Preserve current controls and add semantic groups**

Keep every current prop, event handler, input `id`, label, radio `name`, and loading status. Replace comment-only rows with presentation groups following this structure:

```jsx
<form className="generator-form workbench__controls" ...>
  <div className="form-heading">
    <p className="section-kicker">Build a passage</p>
    <h2 id="generator-title">Lorem Ipsum Generator</h2>
  </div>

  <section className="control-group control-group--keywords" aria-labelledby="keywords-heading">
    <div className="control-group__heading">
      <h3 id="keywords-heading">Keywords</h3>
      <p>Use words that should shape the passage.</p>
    </div>
    {/* Existing ChipInput and synonym toggle */}
  </section>

  <section className="control-group" aria-labelledby="shape-heading">
    <div className="control-group__heading">
      <h3 id="shape-heading">Output shape</h3>
    </div>
    {/* Existing length and units controls */}
  </section>

  <section className="control-group" aria-labelledby="texture-heading">
    <div className="control-group__heading">
      <h3 id="texture-heading">Texture</h3>
    </div>
    {/* Existing density and Lorem Ipsum controls */}
  </section>

  <div className="form-actions">{/* Existing submit button */}</div>
  {/* Existing synonym status display */}
</form>
```

Do not add new state or alter validation, submission, or synonym behavior.

- [ ] **Step 2: Style hierarchy and controls**

Use form surface tokens, a large keyword region, at least `2x` spacing between control groups compared with within-group gaps, and one filled primary action. Keep labels sentence case, controls distinct from static copy, and compact actions `white-space: nowrap`.

Use daisyUI classes only where they already exist or are the correct native component primitive: `input`, `toggle`, `range`, `checkbox`, `btn`, and joined radios. Centralize layout overrides in CSS instead of adding arbitrary one-off values.

- [ ] **Step 3: Run behavior tests and lint**

Run: `pnpm test -- --run`

Expected: all existing tests pass; no generator behavior changes.

Run: `pnpm lint`

Expected: PASS with zero warnings.

- [ ] **Step 4: Commit**

```bash
git add src/components/GeneratorForm.jsx src/index.css
git commit -m "style: organize generator controls"
```

## Task 3: Rebuild result and chip surfaces

**Files:**

- Modify: `src/components/GeneratorResult.jsx`
- Modify: `src/components/ChipInput.jsx`
- Modify: `src/index.css`

- [ ] **Step 1: Update result presentation wrappers**

Keep both render branches and all count/copy logic. Use these presentation roles:

```jsx
<div className="result-surface workbench__output">
  <div className="result-heading">
    <div>
      <p className="section-kicker">Your passage</p>
      <h2>Generated text</h2>
    </div>
    <div className="result-count">{textCount}</div>
  </div>
  <div className="result-copy">{ipsumText}</div>
  <div className="result-actions">{/* Existing copy button */}</div>
</div>
```

Keep the existing `<pre>` or equivalent text-preserving element so generated whitespace remains intact. Empty state should point to the next action: “Add keywords to start a passage.” and “Your generated text will appear here.”

- [ ] **Step 2: Improve chip-input presentation without changing behavior**

Retain `shouldCommitChip`, paste parsing, duplicate prevention, max count, removal, clear behavior, and auto-focus. Add only stable classes for the chip field, chip list, chip remove button, input, helper text, and clear action. Keep the input label association and accessible remove names.

- [ ] **Step 3: Style output reading measure and chip rhythm**

Use one inset output surface inside the raised result region, a readable `max-width` for generated text, `overflow-wrap: anywhere`, generous paragraph rhythm, and no nested card chrome. Give chips a compact consistent gap, ensure remove/clear controls have visible focus styles and touch-safe hit areas, and keep long keywords reachable rather than silently truncating them.

- [ ] **Step 4: Run behavior tests and lint**

Run: `pnpm test -- --run`

Expected: all existing tests pass.

Run: `pnpm lint`

Expected: PASS with zero warnings.

- [ ] **Step 5: Commit**

```bash
git add src/components/GeneratorResult.jsx src/components/ChipInput.jsx src/index.css
git commit -m "style: refine generator output surfaces"
```

## Task 4: Responsive and interaction verification

**Files:**

- Modify: `src/index.css` if verification exposes defects.
- Modify: affected JSX file only if a semantic presentation defect is confirmed.

- [ ] **Step 1: Verify production build**

Run: `pnpm build`

Expected: Vite build completes successfully.

- [ ] **Step 2: Inspect supported widths**

Run the app with `pnpm dev` and inspect at 320, 375, 414, and 768 px. Confirm:

- no horizontal scroll;
- page, form, chip field, radio group, and output remain inset;
- form and output stack at narrow widths and split only when both regions fit;
- no button, label, or primary navigation text wraps because there is no navigation;
- long keyword and generated text wrap without clipping.

- [ ] **Step 3: Inspect interaction states**

Keyboard-tab through every control. Confirm visible `:focus-visible` rings, native disabled behavior for the Lorem Ipsum option in word mode, chip removal and clear actions, submit validation, synonym loading status, generated output, and copy success/error feedback.

- [ ] **Step 4: Inspect reduced motion and zoom**

At 200% zoom, confirm no clipped controls or output. With `prefers-reduced-motion: reduce`, confirm transitions are removed or reduced to a short opacity change and no state depends on motion.

- [ ] **Step 5: Run final verification**

Run:

```bash
pnpm lint
pnpm test -- --run
pnpm build
```

Expected: all commands pass.

- [ ] **Step 6: Commit final fixes**

```bash
git add src/App.jsx src/index.css src/components/GeneratorForm.jsx src/components/GeneratorResult.jsx src/components/ChipInput.jsx
git commit -m "style: complete generator workbench restyle"
```

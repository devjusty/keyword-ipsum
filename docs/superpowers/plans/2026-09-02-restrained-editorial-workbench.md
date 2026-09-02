# Restrained Editorial Workbench Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rework Keyword Ipsum into a restrained editorial split workbench while preserving generator behavior and standardizing icons on Radix Icons.

**Architecture:** Keep `App` as shell, `Generator` as state owner, and existing form/result components as the two workbench regions. Move visual ownership into `src/index.css` with project tokens and small component classes, while retaining daisyUI for controls.

**Tech Stack:** React 19, Vite, Tailwind CSS 4, daisyUI 5, Radix Icons, CSS custom properties, Vitest.

---

## File Map

- Modify `src/index.css`: define restrained editorial tokens, typography, workbench layout, surfaces, responsive rules, and focus/interaction polish.
- Modify `src/App.jsx`: use Radix brand icon and editorial shell markup/copy.
- Modify `src/components/GeneratorForm.jsx`: give controls rail semantic classes and simplify card nesting.
- Modify `src/components/GeneratorResult.jsx`: give output region semantic classes, remove inline SVG, use Radix copy icon, improve empty state and nowrap action.
- Modify `src/components/ChipInput.jsx`: replace Lucide close icon with Radix Cross 1 icon.
- Modify `src/components/Generator.jsx`: remove emoji toast icons while preserving error behavior.
- Modify `src/components/hooks/useSynonymFetcher.js`: remove emoji loading/error toast icons while preserving async behavior.
- Modify `package.json`: remove `lucide-react` after migration; retain installed `@radix-ui/react-icons`.
- Modify `pnpm-lock.yaml`: regenerate lockfile after dependency removal.

## Task 1: Establish Failing UI Contract

**Files:**

- Test: existing `src/utils/generatorLogic.test.js` and `src/components/hooks/useSynonymFetcher.test.js`

- [ ] **Step 1: Record behavior baseline**

Run:

```bash
pnpm test -- --run
```

Expected: existing generator and synonym tests pass before visual edits.

- [ ] **Step 2: Confirm icon migration surface**

Run:

```bash
rg 'lucide-react|icon:|<svg|BookOpen|<X' src package.json
```

Expected: only locations listed in File Map require migration; no test behavior changes are needed.

## Task 2: Build Editorial Shell and Tokens

**Files:**

- Modify: `src/index.css`
- Modify: `src/App.jsx`

- [ ] **Step 1: Add tokens and base rules below existing Tailwind imports**

Add CSS custom properties for warm paper, ink, muted ink, accent, rule, spacing, and typography. Keep all colors and font-family declarations token-backed. Add `box-sizing`, `overflow-x: clip` to `html` and `body`, base body background/color, and heading line-height.

- [ ] **Step 2: Add shell/workbench layout rules**

Create `.app-shell`, `.app-header`, `.app-intro`, `.workbench`, `.workbench__controls`, and `.workbench__output` classes. Use a two-column grid above the content-fit breakpoint and one column below it. Set `minmax(0, 1fr)` on image-free flexible tracks where applicable and ensure controls remain inside page padding.

- [ ] **Step 3: Update App markup**

Use `BookOpenIcon` from `@radix-ui/react-icons` with `aria-hidden="true"`; keep the adjacent `Keyword Ipsum` heading as the accessible brand text. Wrap intro and generator in the new shell classes. Replace repeated two-paragraph explanation with one concise paragraph describing keyword entry and generated output.

- [ ] **Step 4: Run lint**

Run: `pnpm lint`

Expected: PASS with zero warnings.

## Task 3: Convert Form to Controls Rail

**Files:**

- Modify: `src/components/GeneratorForm.jsx`

- [ ] **Step 1: Replace outer card classes with workbench control classes**

Keep the existing `<form>`, labels, inputs, radio group, range, toggle, submit handling, and synonym status. Replace outer `rounded... bg... shadow...` classes with `.workbench__controls` and a single restrained surface class. Remove comments that describe generic rows if they do not aid maintenance.

- [ ] **Step 2: Make row layout responsive and labels consistent**

Use semantic class names for the keyword/toggle, generation controls, and options groups. Keep mobile stacking and use nowrap for the submit label. Preserve `aria-labelledby` and all controlled props.

- [ ] **Step 3: Verify form behavior**

Run: `pnpm test -- --run`

Expected: PASS; no generator logic or hook tests regress.

## Task 4: Convert Result to Output Surface

**Files:**

- Modify: `src/components/GeneratorResult.jsx`

- [ ] **Step 1: Replace generated result inline SVG**

Import `CopyIcon` from `@radix-ui/react-icons`, render it with `aria-hidden="true"`, and retain `aria-label="Copy Ipsum text"` on the button. Change visible label to `Copy text` and add `whitespace-nowrap`.

- [ ] **Step 2: Simplify result and empty-state surfaces**

Use `.workbench__output` and `.result-surface` classes instead of stacked daisyUI card/shadow classes. Keep generated text in a readable bounded surface. Replace the emoji empty-state mark with a small typographic marker or no icon, and change copy to action-oriented empty-state text without repeating App intro.

- [ ] **Step 3: Preserve copy and count behavior**

Do not change `handleCopyText`, `textCount`, clipboard failure handling, or generated text rendering. Run: `pnpm test -- --run`.

Expected: PASS.

## Task 5: Standardize Remaining Icons and Toasts

**Files:**

- Modify: `src/components/ChipInput.jsx`
- Modify: `src/components/Generator.jsx`
- Modify: `src/components/hooks/useSynonymFetcher.js`

- [ ] **Step 1: Replace chip removal icon**

Import `Cross1Icon` from `@radix-ui/react-icons`, render it at the existing compact size, and preserve button type, stop-propagation behavior, and accessible remove label.

- [ ] **Step 2: Remove emoji toast icons**

Delete `icon` properties from validation, generation, synonym-loading, synonym-error, and clipboard toast calls. Keep toast text, position, duration, success/error type, and control flow unchanged.

- [ ] **Step 3: Confirm no Lucide or emoji UI icons remain**

Run:

```bash
rg 'lucide-react|icon:|[📝❌📋⏳]' src
```

Expected: no matches, except any deliberately documented non-UI text if present.

## Task 6: Remove Lucide Dependency

**Files:**

- Modify: `package.json`
- Modify: `pnpm-lock.yaml`

- [ ] **Step 1: Remove dependency with pnpm**

Run: `pnpm remove lucide-react`

Expected: `package.json` and `pnpm-lock.yaml` remove Lucide while retaining `@radix-ui/react-icons`.

- [ ] **Step 2: Confirm imports resolve**

Run: `rg 'lucide-react' src package.json pnpm-lock.yaml`

Expected: no matches.

## Task 7: Responsive and State Verification

**Files:**

- Verify: `src/index.css`, `src/App.jsx`, `src/components/GeneratorForm.jsx`, `src/components/GeneratorResult.jsx`, `src/components/ChipInput.jsx`

- [ ] **Step 1: Run required checks**

Run:

```bash
pnpm lint
pnpm test -- --run
pnpm build
```

Expected: all commands pass.

- [ ] **Step 2: Inspect browser at supported widths**

Run the Vite app with `pnpm dev`, then inspect 320, 375, 414, and 768 px widths. Confirm no horizontal scroll, controls above output on mobile, no wrapped action labels, visible focus rings, and stable loading overlay.

- [ ] **Step 3: Walk interaction states**

Check empty state, keyword add/remove/clear, synonym loading, invalid keyword/length errors, generated output, copy success/failure, disabled start-with-Lorem control, and keyboard focus. Confirm behavior matches baseline.

- [ ] **Step 4: Commit implementation**

```bash
git add src/index.css src/App.jsx src/components/GeneratorForm.jsx src/components/GeneratorResult.jsx src/components/ChipInput.jsx src/components/Generator.jsx src/components/hooks/useSynonymFetcher.js package.json pnpm-lock.yaml
git commit -m "refactor: shape generator as editorial workbench"
```

Do not stage unrelated existing changes in `.gitignore`, `AGENTS.md`, or companion artifacts.

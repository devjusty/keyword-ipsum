# Restrained Editorial Workbench

## Goal

Reduce obvious AI-generated visual patterns while preserving generator behavior. The interface should feel like a restrained editorial tool: authored typography, clear workbench hierarchy, minimal surfaces, and consistent iconography.

## Structure

- Keep `App.jsx` as page shell and `Generator` as state owner.
- Present generator controls and generated output as a responsive split workbench.
- Place controls before output in DOM order; use a two-column layout when space permits.
- Collapse to one column at narrow widths without horizontal scrolling.
- Keep validation, synonym fetching, generation, sanitization, copy behavior, and counts unchanged.

## Visual system

- Preserve Tailwind and daisyUI usage.
- Add a small project token layer in `src/index.css` for warm neutral surfaces, ink, accent, spacing, and typography.
- Use Satoshi for body and headings; remove or repurpose the unused Rubik Scribble face only if it supports the brand mark without weakening legibility.
- Replace layered card/shadow treatment with one restrained surface per workbench region, hairline rules, and minimal elevation.
- Left-align primary page content; reserve centering for empty-state content where useful.
- Use Lucide icons consistently. Remove emoji from empty state and toast configuration.

## Copy and interactions

- Keep the product name and core generator terminology.
- Make intro copy explain the tool once; make empty-state copy give the next action without repeating the intro.
- Shorten the copy action to `Copy text` and retain an accessible label.
- Keep visible labels, keyboard chip entry/removal, focus indication, and disabled state behavior.
- Add `white-space: nowrap` to compact action labels that must remain one line.

## Scope

Expected production edits:

- `src/index.css`
- `src/App.jsx`
- `src/components/GeneratorForm.jsx`
- `src/components/GeneratorResult.jsx`
- `src/components/Generator.jsx`

No production files will be deleted. Brainstorm companion artifacts remain outside production source.

## Verification

- Run `pnpm lint`.
- Run `pnpm test -- --run`.
- Run `pnpm build`.
- Inspect browser layout at 320, 375, 414, and 768 px.
- Check default, empty, loading, error, generated, and copy interaction states.

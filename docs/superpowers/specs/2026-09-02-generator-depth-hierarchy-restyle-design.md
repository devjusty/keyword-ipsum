# Generator Depth, Hierarchy, Spacing, and Layout Restyle

## Goal

Give Keyword Ipsum a more authored editorial workbench: stronger visual hierarchy, clearer surface depth, more deliberate spacing, and a responsive composition that makes generated text the destination. Preserve all generator behavior.

## Scope

Production files expected to change:

- `src/App.jsx`
- `src/index.css`
- `src/components/GeneratorForm.jsx`
- `src/components/GeneratorResult.jsx`
- `src/components/ChipInput.jsx`

No production files are deleted or created. `Generator.jsx` behavior remains unchanged unless a presentation-only integration adjustment becomes necessary.

## Structure and hierarchy

- Keep `App.jsx` as the page shell and `Generator` as the state owner.
- Use an editorial masthead with a compact brand mark, one visible page heading, and concise supporting copy.
- Keep controls before output in DOM order.
- Treat the form as a focused control surface and generated text as the primary reading surface.
- Organize form controls into three visual tiers:
  - Keywords: dominant keyword entry area and synonym setting.
  - Output shape: length and unit controls.
  - Texture: keyword density and Lorem Ipsum starter option.
- Make the generate action the form's single visual anchor.
- Keep empty output calm and action-oriented without repeating the page introduction.

## Surface depth and visual system

- Preserve Tailwind 4 and daisyUI 5 primitives.
- Replace scattered visual decisions with semantic tokens in `src/index.css` for paper, ink, muted text, rules, raised surfaces, inset surfaces, spacing, type scale, focus, and elevation.
- Use one warm page background, one raised workbench surface, and one inset output surface. Avoid nested card stacks and decorative shadows.
- Use hairline rules only where spacing cannot carry grouping.
- Use Satoshi for body and display text, with a restrained type scale and capped reading measure.
- Keep Radix Icons as the icon source and use consistent optical sizing.

## Component presentation

### `App.jsx`

- Add semantic wrapper classes for masthead, intro, and workbench regions.
- Preserve the existing generator landmark and heading relationships.

### `GeneratorForm.jsx`

- Add semantic group wrappers and section headings without changing controlled state or event handlers.
- Consolidate visual classes around the new form surface and control tiers.
- Keep native number, radio, range, checkbox, and submit controls.
- Keep compact action labels on one line.

### `GeneratorResult.jsx`

- Keep empty and generated branches.
- Give generated content a clear title/count row and readable text measure.
- Keep copy action inset within the output surface, with its accessible label and disabled behavior.
- Preserve exact count logic and clipboard error/success behavior.

### `ChipInput.jsx`

- Preserve keyboard entry, comma/Enter commit, paste parsing, duplicate prevention, chip removal, and clear behavior.
- Improve chip spacing, clear action placement, input focus styling, and mobile wrapping.
- Keep every control natively keyboard reachable and visibly focused.

## Responsive behavior

- Use one column until the controls and output genuinely fit side by side.
- Use `minmax(0, 1fr)` for image-free grid tracks and `min-width: 0` on flexible regions.
- Keep controls inset from viewport edges.
- Verify no horizontal scrolling at 320, 375, 414, and 768 px.
- Ensure long labels and generated text wrap without clipping at narrow widths and 200% zoom.

## Behavior and accessibility invariants

- Do not change validation, synonym fetching, generation, sanitization, result counts, or copy behavior.
- Retain labels and accessible relationships for every input.
- Retain loading status and disabled states.
- Provide visible `:focus-visible` treatment for all keyboard controls.
- Keep mobile input text at or above 16px to avoid browser zoom.
- Do not rely on color alone for state or status.

## Verification

- `pnpm lint`
- `pnpm test -- --run`
- `pnpm build`
- Inspect default, empty, loading, error, generated, and copy states.
- Inspect the rendered layout at 320, 375, 414, and 768 px.
- Check keyboard traversal and visible focus states.
- Check 200% zoom and a representative long keyword.

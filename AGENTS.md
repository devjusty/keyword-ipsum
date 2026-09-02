# Keyword Ipsum Agent Guide

## Commands

- Install dependencies with `pnpm install`; use `pnpm`, not npm, for local development.
- Start Vite with `pnpm dev`; preview a production build with `pnpm preview`.
- Run `pnpm lint`; ESLint scans `js` and `jsx` files and treats warnings as failures.
- Run all tests with `pnpm test -- --run`.
- Run one test file with `pnpm test -- --run src/utils/generatorLogic.test.js` or the corresponding path.
- Build with `pnpm build`; run bundle analysis with `pnpm run build:analyze`.
- Run unused-code checks with `pnpm run knip`.
- Format with `pnpm run format`; Prettier uses two spaces and no tabs.
- Netlify deploys `dist` from `npm run build` as defined in `netlify.toml`.

## Application Flow

- `src/main.jsx` is the browser entrypoint; analytics loads lazily during idle time only when `VITE_GA_TRACKING_ID` is set.
- `src/App.jsx` owns page shell and renders `src/components/Generator.jsx`.
- `Generator.jsx` owns generator state, validation, synonym orchestration, sanitization, and result state.
- `GeneratorForm.jsx` is the controlled form; `ChipInput.jsx` owns keyword entry, paste parsing, duplicate prevention, and chip removal.
- `useSynonymFetcher.js` calls Datamuse sequentially. Development requests use Vite’s `/api/datamuse` proxy; production requests use `https://api.datamuse.com`.
- `GeneratorResult.jsx` displays generated text and handles clipboard copying.
- `src/utils/generatorLogic.js` contains deterministic seeded text generation. Generation length is validated as a positive integer from 1 through 1000.

## Environment

- Copy `.env.example` to `.env.local` for local variables. `VITE_GA_TRACKING_ID` is optional; do not commit local env files.
- Vite proxy configuration exists only in development and rewrites `/api/datamuse` to Datamuse.

## Verification

- For code changes, run `pnpm lint`, `pnpm test -- --run`, and `pnpm build`.
- Keep generated `dist/` and local environment files out of changes; both are ignored by Git.

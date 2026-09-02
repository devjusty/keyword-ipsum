# Vite 8 Upgrade

## Goal

Upgrade Keyword Ipsum from Vite 7 to Vite 8+, review its configuration for the Rolldown/Oxc toolchain, and preserve existing development and production behavior.

## Scope

- Update the Vite dependency and regenerate `pnpm-lock.yaml`.
- Update compatible plugin versions only when Vite 8 peer constraints require it.
- Keep Vitest on its current major unless dependency resolution requires a scoped compatibility update.
- Rename `build.rollupOptions` to `build.rolldownOptions`.
- Preserve the targeted Zod `INVALID_ANNOTATION` warning suppression.
- Remove obsolete `esbuild` configuration because Vite 8 uses Oxc/Rolldown.
- Preserve development proxy, CORS, HMR overlay, and development sourcemaps.
- Preserve application behavior and unrelated worktree changes.

## Configuration Invariants

- `/api/datamuse` continues proxying to `https://api.datamuse.com` only in development.
- Development-only CORS, credentials, HMR overlay, and sourcemaps remain enabled.
- Non-development builds retain default sourcemap behavior.
- Warnings not matching the known Zod annotation condition continue through the default warning handler.

## Error Handling

If Vite 8 or Rolldown reports a real incompatibility, make the smallest scoped update in the responsible dependency or config. Do not broadly refactor application code or suppress new warnings without understanding them.

## Verification

Run:

```bash
pnpm lint
pnpm test -- --run
pnpm build
```

The upgrade is complete only when dependency installation and all three commands succeed without unresolved migration warnings.

# Vite 8 Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade Keyword Ipsum to Vite 8+ and migrate its config to the Rolldown/Oxc toolchain without changing application behavior.

**Architecture:** Keep existing JavaScript config and plugin structure. Update Vite dependency resolution, move the existing warning hook under `build.rolldownOptions`, and remove obsolete `esbuild` configuration while preserving development server behavior.

**Tech Stack:** Vite 8, React plugin, Tailwind CSS Vite plugin, Vitest, pnpm.

---

### Task 1: Refresh Vite dependencies

**Files:**

- Modify: `package.json:46-70`
- Modify: `pnpm-lock.yaml:32-104` and resolved package entries

- [ ] **Step 1: Update Vite dependency range**

Change `devDependencies.vite` from `^7.1.11` to `^8.0.0`. Keep unrelated dependency edits already present in the worktree.

- [ ] **Step 2: Regenerate lockfile with pnpm**

Run:

```bash
pnpm install
```

Expected: install succeeds and importer/package entries resolve Vite 8 with compatible plugin peer dependencies.

- [ ] **Step 3: Confirm dependency graph**

Run:

```bash
pnpm list vite @vitejs/plugin-react @tailwindcss/vite vitest --depth 0
```

Expected: Vite reports version 8 or newer; listed plugins and Vitest remain installed without peer-resolution errors.

### Task 2: Migrate Vite configuration

**Files:**

- Modify: `vite.config.js:36-63`

- [ ] **Step 1: Move warning hook to Rolldown options**

Keep `build.sourcemap` conditional and move the existing `rollupOptions.onwarn` function to `rolldownOptions.onwarn`:

```js
build: {
  ...(isDevelopment && { sourcemap: true }),
  rolldownOptions: {
    onwarn(warning, defaultHandler) {
      if (
        warning.code === "INVALID_ANNOTATION" &&
        warning.id?.includes("/node_modules/zod/v4/core/") &&
        warning.message.includes(
          "contains an annotation that Rollup cannot interpret due to the position",
        )
      ) {
        return;
      }

      defaultHandler(warning);
    },
  },
},
```

- [ ] **Step 2: Remove obsolete esbuild configuration**

Delete the `esbuild` property and its development conditional. Vite 8 uses Oxc/Rolldown for the relevant transform/build pipeline.

- [ ] **Step 3: Preserve server invariants**

Do not alter the development-only `/api/datamuse` proxy, CORS credentials, HMR overlay, or production defaults.

### Task 3: Verify migration

**Files:**

- No additional files expected unless verification identifies a concrete Vite 8 incompatibility.

- [ ] **Step 1: Run lint**

Run `pnpm lint`. Expected: exit code 0 with no warnings.

- [ ] **Step 2: Run tests**

Run `pnpm test -- --run`. Expected: all existing tests pass.

- [ ] **Step 3: Run production build**

Run `pnpm build`. Expected: Vite 8 build succeeds without unresolved migration warnings.

- [ ] **Step 4: Inspect final diff**

Run:

```bash
git status --short
git diff -- package.json vite.config.js pnpm-lock.yaml
```

Expected: diff contains only the Vite migration plus lockfile changes required by it; unrelated existing edits remain intact.

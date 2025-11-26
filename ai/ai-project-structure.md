# Project Structure & Tech Stack

## 1. The Stack (Bleeding Edge)

| Component | Technology |
|-----------|-----------|
| **Monorepo** | Turborepo |
| **Package Manager** | Bun (Fast, all-in-one toolkit) |
| **Runtime** | Bun (Replaces Node.js) |
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript (Strict Mode) |
| **Styling** | Tailwind CSS v4 (CSS-first configuration, NO tailwind.config.js) |
| **Components** | shadcn/ui (Radix UI primitives) |
| **Animation** | Motion + tailwindcss-animate |
| **Database** | Supabase (PostgreSQL) |
| **ORM** | Drizzle ORM (preferred) or Prisma |
| **Linting/Formatting** | Biome (Replaces ESLint + Prettier) |

---

## 2. Monorepo Architecture

The project uses a standard Turborepo layout with Bun workspaces:
```
.
├── package.json             # Root workspace configuration
├── bun.lockb               # Bun lockfile (binary)
├── biome.json              # Biome configuration
├── turbo.json
├── apps/
│   ├── dashboard/           # Next.js 15 (Creator Admin Portal)
│   │   ├── Features: Auth, OAuth Connect, Stripe Billing, Theme Editor
│   │   └── Uses "use client" heavily for the editor interface
│   └── profile/             # Next.js 15 (Public Media Kit)
│       ├── Features: ISR Caching, Motion animations, Read-only DB access
│       └── Optimized for Core Web Vitals (Lighthouse 100)
└── packages/
    ├── ui/                  # Shared Design System
    │   ├── src/components/      (Shadcn components)
    │   ├── src/lib/utils.ts     (cn utility)
    │   └── src/globals.css       (Tailwind v4 @theme definition)
    ├── db/                  # Database Schema & Client
    │   ├── src/schema.ts         (Drizzle schema)
    │   └── src/client.ts         (Supabase connection)
    ├── utils/               # Shared Helpers
    │   └── Currency formatting, Number compaction, etc.
    └── config/              # Shared TSConfig, Biome config
```

---

## 3. Dependency Management (Bun Workspaces)

We use **Bun's native workspace** feature for monorepo management.

### Key Commands:
```bash
# Install all dependencies
bun install

# Add a dependency to a specific workspace
bun add react --cwd apps/dashboard

# Add a dev dependency to root
bun add -d turbo

# Run development
bun run dev
```

---

## 4. Biome Configuration

We use **Biome** as a single tool for linting and formatting (replaces ESLint + Prettier).

### Commands:
```bash
# Check for issues
bun run lint

# Fix auto-fixable issues
biome check --write .

# Format only
bun run format
```

---

## 5. Theming Strategy (TweakCDN Style)

We use **Tailwind v4 CSS variables** in `packages/ui/src/globals.css`.

### Dynamic Injection:

- The `ui` package exports a `<ThemeProvider theme={userTheme} />`.
- This component accepts a JSON object (colors, radius) and applies them as inline styles to the root element, overriding the CSS variables defined in `@theme`.

---

## 6. Senior Developer Code Style Guidelines

### General Philosophy

- **Concise & Functional**: Code should be boring and predictable. Avoid clever one-liners that sacrifice readability.
- **Composition over Inheritance**: Use React composition.
- **Server-First**: Default to React Server Components (RSC). Only use `"use client"` at the leaves of the component tree (buttons, inputs, interactive areas).

### TypeScript & Zod

- **No `any`**: Strictly prohibited. Use `unknown` if data shape is ambiguous and narrow it later.
- **Zod for Boundaries**: All API inputs, URL params, and Database responses must be parsed with Zod schemas.
- **Type Inference**: Rely on TS inference where possible. Don't manually type simple variables.
  - ❌ **Bad**: `const count: number = 0;`
  - ✅ **Good**: `const count = 0;`

### React & Next.js 15 Patterns

- **Server Actions**: Use Server Actions for ALL mutations. Do not create API routes (`/app/api/`) unless you need to expose a webhook to a 3rd party (e.g., Stripe Webhook).
- **Data Fetching**: Fetch data directly in Server Components. Do not use `useEffect` for data fetching.
- **Suspense**: Use React Suspense boundaries for loading states. Do not use `isLoading` booleans if possible.

### Tailwind v4 & Styling

- **Variables**: Use CSS variables for all design tokens to support the "TweakCDN" live editing feature.
  - **Usage**: `bg-[var(--primary)]` or define `--primary` in the CSS `@theme` block and use `bg-primary`.
- **Sorting**: Class names should be logical (Layout → Box Model → Typography → Visuals).
- **Merging**: ALWAYS use `cn()` (clsx + tailwind-merge) when accepting a `className` prop.

### Biome & Code Quality

- **Auto-formatting**: Always run `bun run format` before committing.
- **No Unused Imports**: Biome will auto-remove them with `organizeImports`.
- **Consistent Style**: Let Biome handle all formatting decisions. Don't fight the formatter.

### AI Interaction Rules

- **No Comments**: Do not add comments explaining *what* the code does. Only explain *why* a complex decision was made.
- **Scaffolding**: When asked to create a component, check `packages/ui/src/components` first. Do not duplicate primitives.
- **Imports**: Use workspace imports `@repo/ui` for shared components, or relative imports within packages.

---

## 7. Performance Considerations

### Why Bun?

- **Faster installs**: 20-100x faster than npm
- **Native TypeScript**: No need for ts-node
- **Built-in bundler**: Can replace some build tools
- **Drop-in replacement**: Works with existing npm packages

### Biome vs ESLint/Prettier

| Feature | Biome | ESLint + Prettier |
|---------|-------|-------------------|
| **Speed** | ~100x faster | Baseline |
| **Configuration** | Single file | Multiple configs |
| **Dependencies** | Zero | 100+ packages |
| **Auto-fix** | Built-in | Requires plugins |
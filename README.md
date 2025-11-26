# MyBio Space

Live Media Kit Platform - A dynamic, web-based media kit for content creators.

## Tech Stack

- **Monorepo**: Turborepo
- **Package Manager**: Bun
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Components**: shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **ORM**: Drizzle ORM
- **Linting/Formatting**: Biome

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) >= 1.0.0

### Installation

```bash
bun install
```

### Development

```bash
bun run dev
```

This will start all apps in development mode.

### Building

```bash
bun run build
```

### Linting & Formatting

```bash
# Check for issues
bun run lint

# Format code
bun run format
```

## Project Structure

```
.
├── apps/
│   ├── dashboard/     # Creator Admin Portal
│   └── profile/        # Public Media Kit
└── packages/
    ├── ui/            # Shared Design System
    ├── db/            # Database Schema & Client
    ├── utils/         # Shared Helpers
    └── config/        # Shared Configs
```

## Documentation

See `ai/` directory for detailed project documentation:
- `ai-project-idea.md` - Product vision and user flows
- `ai-project-structure.md` - Technical stack and architecture


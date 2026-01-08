# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a Next.js blog starter kit (personal theme) integrated with Hashnode's GraphQL API. Content is managed through Hashnode and fetched via GraphQL queries at build time (ISR with revalidation).

## Commands

```bash
# Development (runs Next.js + GraphQL codegen in watch mode)
pnpm dev

# Build for production
pnpm build

# Regenerate GraphQL types after schema changes
pnpm codegen

# Type checking
pnpm typecheck

# Linting
pnpm lint

# Format code
pnpm format
```

## Environment Variables

Required in `.env.local`:
- `NEXT_PUBLIC_HASHNODE_GQL_ENDPOINT` - Hashnode GraphQL endpoint (default: `https://gql.hashnode.com`)
- `NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST` - Your Hashnode publication host (e.g., `engineering.hashnode.com`)

## Architecture

### Data Flow
1. GraphQL queries are defined in `generated/schema.graphql`
2. Running `pnpm codegen` generates typed query documents and TypeScript types in `generated/graphql.ts`
3. Pages use `graphql-request` with generated typed documents for type-safe API calls
4. Data is fetched at build time via `getStaticProps` with ISR (`revalidate: 1`)

### Key Generated Types
- `PublicationFragment` - Blog publication metadata (title, author, integrations, links)
- `PostFragment` - Post preview data for listings
- `PostFullFragment` - Complete post data including content
- `PageInfoFragment` - Pagination cursor info

### Key Query Documents
Import from `generated/graphql`:
- `PostsByPublicationDocument` - Homepage post listing with pagination
- `MorePostsByPublicationDocument` - Load more posts (infinite scroll)
- `SinglePostByPublicationDocument` - Single post page
- `PageByPublicationDocument` - Static pages
- `TagPostsByPublicationDocument` - Posts filtered by tag

### Application Context
`AppProvider` in `components/contexts/appContext.tsx` provides publication, post, and page data to components via `useAppContext()` hook.

### Routing
- `/` - Home page with paginated post list
- `/[slug]` - Dynamic route handling both posts and static pages
- `/tag/[slug]` - Posts filtered by tag
- `/preview/[id]` - Draft preview
- `/rss.xml`, `/sitemap.xml`, `/robots.txt` - SEO files

### Styling
- Tailwind CSS with `@tailwindcss/typography` plugin
- Dark mode via `next-themes` (class-based)
- **Source of truth**: See `tailwind.config.js` for all color, typography, and styling configuration (well-commented)

### Theme Considerations
**IMPORTANT**: This blog supports both dark and light themes. When making styling changes:
- Always ensure changes work in BOTH dark and light modes
- Dark mode is the primary/preferred theme, but light mode must remain functional
- Use Tailwind's `dark:` prefix for dark mode specific styles
- Test changes in both modes before considering them complete
- Never apply a single color value to both modes if it creates contrast issues

### Styling System Overview

The theme uses a semantic color system that adapts to dark/light mode:

1. **CSS Variables** (defined in `styles/index.css`):
   - `--color-text-heading`, `--color-text-body`, `--color-text-muted`, `--color-border`
   - These change values based on `.dark` class

2. **Tailwind Integration** (configured in `tailwind.config.js`):
   - Semantic colors are exposed as Tailwind colors (`text-text-heading`, etc.)
   - Utility classes in CSS (`.text-heading`, `.text-body`, `.text-muted`)
   - Default border color overridden to use semantic token

3. **Typography Plugin** (configured in `tailwind.config.js`):
   - Customizes prose content: links, blockquotes, lists, HR, callouts
   - Uses `theme('colors.primary.500')` for accent colors (dynamic)

**For specific values and usage details, refer to the comments in `tailwind.config.js`.**

### Documentation Maintenance
**IMPORTANT**: When making styling changes:
- Update the comments in `tailwind.config.js` if you add/modify colors, typography, or semantic tokens
- Update this file (`AGENTS.md`) if you change the overall styling system or add new patterns
- Keep both files in sync - `tailwind.config.js` is the source of truth for specific values, this file explains the system

### Shared Utilities
The `@starter-kit/utils` package (workspace dependency) provides:
- Image resizing utilities
- SEO helpers (JSON-LD)
- OG image generation
- Embed handling and iframe resizing

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
- Custom typography styles for callouts in `tailwind.config.js`

### Shared Utilities
The `@starter-kit/utils` package (workspace dependency) provides:
- Image resizing utilities
- SEO helpers (JSON-LD)
- OG image generation
- Embed handling and iframe resizing

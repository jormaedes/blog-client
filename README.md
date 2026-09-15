# Editorial — Public Blog Client

A modern, responsive public frontend for the Blog API where readers can explore articles, search topics, read rich editorial content, and participate in discussions.

Built with **Next.js**, **TypeScript**, **Tailwind CSS**, and **Zustand**.

## Overview

**Editorial** is the public client for reading and interacting with blog posts. It offers a clean, editorial reading experience without requiring authentication to browse content, while enabling interactive features (likes, comments) for registered users.

## Features

- **Public Reading**: Open access to all published blog posts without requiring login.
- **Editorial Cards**: Automatic detection and extraction of featured cover images from article HTML with adaptive dark overlays and typographic fallbacks.
- **Real-Time Search**: Instant client-side search across articles by title.
- **Client-Side Pagination**: Smooth, responsive pagination that works seamlessly with search.
- **Rich Article View**: Responsive typography rendering with `@tailwindcss/typography`, estimated reading times, and publication dates.
- **Community Interaction**:
  - Like/unlike posts and comments (with friendly modal prompts for unauthenticated visitors).
  - Add, edit, and delete comments for registered users.
- **Reader Authentication**:
  - Simple login and signup (creates reader accounts via the API).
  - JWT token management with Zustand store.
- **Modern Navigation**:
  - Sticky header with active routes, theme toggle, and user profile chip.
  - Fully responsive mobile drawer menu with smooth backdrop overlay.
- **Theme Support**: Seamless Light, Dark, and System modes with `next-themes`.

## Tech Stack

- [Next.js](https://nextjs.org/) (App Router)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Tailwind Typography](https://tailwindcss.com/docs/typography-plugin)
- [Zustand](https://zustand.docs.pmnd.rs/)
- [Lucide React](https://lucide.dev/)
- [next-themes](https://github.com/pacocoursey/next-themes)

## Project Structure

```text
src/
├── app/
│   ├── layout.tsx         # Root layout with Header, Footer, and ThemeProvider
│   ├── page.tsx           # Public homepage (Hero, search, featured banner, latest posts)
│   ├── posts/
│   │   ├── page.tsx       # All articles directory with search and pagination
│   │   └── [postId]/
│   │       └── page.tsx   # Single article reading view with comments & likes
│   ├── login/
│   │   └── page.tsx       # Public reader login
│   └── signup/
│       └── page.tsx       # Public reader account registration
├── components/
│   ├── Header.tsx         # Responsive public header with mobile menu
│   ├── Footer.tsx         # Editorial blog footer
│   ├── PostCard.tsx       # Editorial card with cover extraction & fallback
│   ├── PostGrid.tsx       # Responsive post grid with skeleton loaders
│   ├── SearchBar.tsx      # Real-time search input
│   ├── Pagination.tsx     # Accessible pagination controls
│   ├── PostContent.tsx    # Prose HTML content renderer
│   ├── PostLikeButton.tsx # Interactive like button with auth check
│   ├── CommentList.tsx    # Comments list with plain text safety & actions
│   ├── CommentForm.tsx    # Comment form with guest invitation
│   ├── AuthPromptModal.tsx# Modal prompting guests to login/signup
│   ├── ConfirmDialog.tsx  # Accessible confirmation modal
│   ├── ThemeProvider.tsx  # Next-themes provider
│   ├── ThemeSwitcher.tsx  # Light/Dark/System theme toggle
│   └── AuthInitializer.tsx# Client authentication restorer
├── lib/
│   ├── api.ts             # Blog API client functions
│   └── postUtils.ts       # HTML image extractor, excerpt, reading time & dates
├── stores/
│   └── authStore.ts       # Public Zustand auth state store
└── types/
    ├── auth.ts
    ├── comment.ts
    └── post.ts
```

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/jormaedes/blog-client.git
cd blog-client
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variable in `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3300
```

4. Start the development server:
```bash
npm run dev
```

The application will be accessible at:
```
http://localhost:3000
```

## Production Build

```bash
npm run build
npm start
```
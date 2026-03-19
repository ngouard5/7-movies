# CLAUDE.md — AI Assistant Guide for 7-Movies

## Project Overview

**7-Movies** is an emoji-based movie guessing game where players identify 7 movies from emoji clues within a time limit. It supports multiplayer challenges via shareable links, multi-language (EN/FR), and stores game sessions in Supabase.

Built with: React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui + Supabase.

---

## Directory Structure

```
/
├── src/
│   ├── main.tsx              # App entry point (PostHog init)
│   ├── App.tsx               # Root router + providers
│   ├── pages/                # One file per route
│   ├── components/
│   │   ├── ui/               # shadcn/ui primitives (do not edit manually)
│   │   ├── game/             # Game-specific components
│   │   └── layout/           # App shell (header, background)
│   ├── hooks/
│   │   ├── useGameLogic.ts   # Central game state machine
│   │   └── useMovieGuess.ts  # Guess processing + hints + scoring
│   ├── services/
│   │   ├── movieService.ts   # Movie search + OMDb fallback
│   │   ├── gameStorage.ts    # localStorage persistence
│   │   ├── statsService.ts   # Supabase session saving
│   │   └── challengeService.ts # Challenge creation/lookup
│   ├── contexts/
│   │   └── LanguageContext.tsx # EN/FR i18n
│   ├── data/
│   │   └── movies.ts         # Static movie database (~500 entries)
│   ├── utils/
│   │   ├── fuzzyMatching.ts  # Levenshtein-based typo tolerance
│   │   ├── scoreCalculator.ts # Points = 100 + speed bonus
│   │   ├── category.ts       # Movie category filtering
│   │   └── movieUtils.ts
│   ├── types/
│   │   └── gameTypes.ts      # All shared TypeScript interfaces
│   ├── lib/utils.ts          # cn() helper (clsx + tailwind-merge)
│   ├── config/posthog.ts     # Analytics config
│   └── integrations/supabase/ # Generated Supabase client + types
├── supabase/
│   ├── config.toml
│   ├── functions/get-challenge-movies/  # Edge function
│   └── migrations/           # SQL migration files
├── public/                   # Static assets
├── index.html
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json             # Path alias: @/* → src/*
└── components.json           # shadcn/ui config
```

---

## Development Workflow

### Commands

```bash
npm run dev       # Dev server at http://localhost:8080
npm run build     # Production build → dist/
npm run build:dev # Dev-mode build
npm run lint      # ESLint check
npm run preview   # Serve production build locally
```

> Bun is also supported (`bun.lockb` is present), but `npm` is the primary tool.

### Path Alias

Use `@/` to import from `src/`:

```ts
import { cn } from "@/lib/utils";
import { Movie } from "@/types/gameTypes";
```

### Environment Variables

Vite requires the `VITE_` prefix for client-side env vars. The dev server runs on port 8080. Keys currently hardcoded in source (Supabase anon key, PostHog key) are intentional — both are safe for client exposure with RLS / domain restrictions.

---

## Key Architecture Decisions

### Game Flow

```
Index → PreGame → Countdown → Game → Results
                                  ↘ Challenge (via link)
```

State flows through `useGameLogic` (central hook) which composes `useMovieGuess`. Game data is passed between pages via `localStorage` (not React Router state), using keys like `gameSession`, `selectedCategory`, `playerInfo`.

### Movie Database

`src/data/movies.ts` is the source of truth. Each entry:

```ts
{
  id: string,
  title: string,         // English title (used for matching)
  frenchTitle?: string,  // Displayed in FR locale
  emojis: string,        // The emoji clue shown to player
  imdbID?: string,
  genre: string,
  year: number,
  director: string,
  mainActor: string,
  tags: string[]         // Used for category filtering
}
```

**Do not remove movies without checking `challengeService` and `gameStorage`** — stored sessions reference movie IDs.

### Fuzzy Matching

`src/utils/fuzzyMatching.ts` uses Levenshtein distance to tolerate typos. Text is normalized (remove accents, punctuation, lowercase) before comparison. Both English and French titles are checked. The threshold scales with word length.

### Scoring

`src/utils/scoreCalculator.ts`:
- Base: 100 points per correct guess
- Speed bonus: decreases linearly with time elapsed
- Hints used reduce the score

### Category Filtering

Stored in `localStorage` as `selectedCategory`. Values: `all`, `disney`, `blockbusters`, `superheroes`, `animation`, `true_stories`, `comedies`, `fantasy`, `scifi`. Applied in `useGameLogic` when loading the movie list.

### i18n

`LanguageContext` wraps the whole app. Use the `useLanguage()` hook:

```ts
const { t, language, setLanguage } = useLanguage();
return <p>{t("game.correct")}</p>;
```

Add new translation keys in both `en` and `fr` objects inside `LanguageContext.tsx`. The `t()` function supports `{{variable}}` interpolation.

### Supabase Integration

- Client: `src/integrations/supabase/client.ts`
- Types: `src/integrations/supabase/types.ts` (auto-generated, do not hand-edit)
- Main tables: `game_sessions`, `game_session_movies`, `game_participants`
- Public leaderboard view: `public_game_sessions`
- RLS is enabled — the anon key only allows what migrations explicitly permit

To update DB types after a schema migration:

```bash
npx supabase gen types typescript --project-id beibpjlcoriuebctohcm > src/integrations/supabase/types.ts
```

### shadcn/ui Components

Components in `src/components/ui/` are generated by shadcn/ui and should not be manually edited unless necessary. Add new shadcn components with:

```bash
npx shadcn-ui@latest add <component-name>
```

Custom game UI lives in `src/components/game/` and layout wrappers in `src/components/layout/`.

---

## Conventions

### TypeScript

- `strict: false` is intentional (project uses relaxed checking for speed)
- Avoid `any` when possible but don't add strict-mode-style annotations to untouched code
- All shared types live in `src/types/gameTypes.ts`

### Styling

- Tailwind CSS utility classes exclusively (no separate CSS files except `index.css` for base styles)
- Dark mode via `class` strategy — add `dark:` variants for dark mode support
- Custom design tokens are in `tailwind.config.ts` under `theme.extend`
- Use `cn()` from `@/lib/utils` to merge conditional class names:

```ts
import { cn } from "@/lib/utils";
<div className={cn("base-class", condition && "conditional-class")} />
```

### Component Patterns

- One component per file, named to match filename
- Pages import hooks and pass props to presentational components
- Avoid prop-drilling more than 2 levels — use context or lift to a hook
- Game components receive callbacks (not internal state) from parent hooks

### Analytics

PostHog is initialized in `main.tsx`. Track custom events via:

```ts
import posthog from "posthog-js";
posthog.capture("event_name", { property: value });
```

Do not add analytics calls inside low-level utilities — keep them in hooks or page components.

---

## Common Tasks

### Adding a New Movie

Edit `src/data/movies.ts` and add an entry following the existing schema. Choose a unique `id` (kebab-case slug). Add `tags` to support category filtering.

### Adding a New Category

1. Add the category key to the `CategoryType` union in `gameTypes.ts`
2. Add the filter logic in `src/utils/category.ts`
3. Add the UI option in `PreGame.tsx`

### Adding a New Page/Route

1. Create `src/pages/MyPage.tsx`
2. Add the route in `App.tsx` inside the `<Routes>` block
3. Update navigation links as needed

### Adding a Translation Key

In `src/contexts/LanguageContext.tsx`, add the key to both `en` and `fr` translation objects.

### Modifying Scoring

Edit `src/utils/scoreCalculator.ts`. The function is pure and tested by tracing through `useMovieGuess.ts`.

---

## Infrastructure Notes

- **Build tool:** Vite 5 with SWC (fast, no Babel)
- **Hosting:** Lovable (Vite-compatible static hosting)
- **Backend:** Supabase (Postgres + Edge Functions + Auth)
- **Analytics:** PostHog (client-side, self-served key)
- **No test suite** exists currently — validate changes manually via `npm run dev`
- **No CI/CD pipeline** — deployments are triggered through the Lovable platform

---

## Things to Avoid

- Do not modify `src/components/ui/` files directly — regenerate via shadcn CLI
- Do not edit `src/integrations/supabase/types.ts` by hand — regenerate via Supabase CLI
- Do not add server-side secrets to any file in `src/` — all source is bundled client-side
- Do not change the port in `vite.config.ts` (8080) without updating Lovable settings
- Do not introduce new global CSS unless absolutely necessary — use Tailwind utilities
- Do not store sensitive user data in `localStorage` — current storage is for non-PII game state only

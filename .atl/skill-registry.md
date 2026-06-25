# Skill Registry

**Delegator use only.** Any agent that launches sub-agents reads this registry to resolve compact rules, then injects them directly into sub-agent prompts. Sub-agents do NOT read this registry or individual SKILL.md files.

See `_shared/skill-resolver.md` for the full resolution protocol.

## User Skills

| Trigger | Skill | Path |
|---------|-------|------|
| building PocketBase backends, designing schemas, access control, auth flows, performance optimization | pocketbase-best-practices | `C:\Users\German\.agents\skills\pocketbase-best-practices\SKILL.md` |
| server-state management, data fetching in TS/JS, React, Vue, Solid, Svelte & Angular | tanstack-query | `C:\Users\German\.agents\skills\tanstack-query\SKILL.md` |
| adding shadcn/ui, installing shadcn, Button, Card, Dialog, Form, shadcn components, Radix UI + Tailwind | shadcn-ui | `C:\Users\German\.agents\skills\shadcn-ui\SKILL.md` |
| styling with Tailwind v4, configuring Tailwind, utility classes, @theme, @layer, @utility | tailwind-css | `C:\Users\German\.agents\skills\tailwind-css\SKILL.md` |
| building forms with validation, shadcn/ui Form, multi-step wizards, useFieldArray | react-hook-form-zod | `C:\Users\German\.agents\skills\react-hook-form-zod\SKILL.md` |
| async APIs, concurrent systems, I/O-bound applications requiring non-blocking operations | async-python-patterns | `C:\Users\German\.agents\skills\async-python-patterns\SKILL.md` |
| needs specs created or updated for a change | openspec-spec | `C:\Users\German\.config\opencode\skills\openspec-spec\SKILL.md` |
| thinking through before or during a change | openspec-explore | `C:\Users\German\.config\opencode\skills\openspec-explore\SKILL.md` |
| starting a new feature, enhancement, or significant change needing specification tracking | openspec-proposal | `C:\Users\German\.config\opencode\skills\openspec-proposal\SKILL.md` |
| needs a design document created or updated for a change | openspec-design | `C:\Users\German\.config\opencode\skills\openspec-design\SKILL.md` |
| wants to learn OPSX or do a guided first change | openspec-onboard | `C:\Users\German\.config\opencode\skills\openspec-onboard\SKILL.md` |
| needs tasks created or updated for a change | openspec-tasks | `C:\Users\German\.config\opencode\skills\openspec-tasks\SKILL.md` |
| implementation tasks finished, needs completion | openspec-archive | `C:\Users\German\.config\opencode\skills\openspec-archive\SKILL.md` |
| needs to verify completed or partially completed change | openspec-verify | `C:\Users\German\.config\opencode\skills\openspec-verify\SKILL.md` |
| wants to initialize OPSX, 'opsx init', 'iniciar opsx', 'openspec init' | openspec-init | `C:\Users\German\.config\opencode\skills\openspec-init\SKILL.md` |
| proposal approved and ready for implementation | openspec-apply | `C:\Users\German\.config\opencode\skills\openspec-apply\SKILL.md` |
| 'judgment day', 'review adversarial', 'dual review', 'doble review', 'juzgar', 'que lo juzguen' | judgment-day | `C:\Users\German\.config\opencode\skills\judgment-day\SKILL.md` |
| needs to create CHANGES.md, roadmap, change map, implementation plan | roadmap-generator | `C:\Users\German\.config\opencode\skills\roadmap-generator\SKILL.md` |
| looking for functionality that might exist as an installable skill | find-skill | `C:\Users\German\.config\opencode\skills\find-skill\SKILL.md` |
| wants to create a skill from scratch, edit, optimize, run evals, benchmark performance | skill-creator | `C:\Users\German\.config\opencode\skills\skill-creator\SKILL.md` |
| wants to start a project from scratch using SDD/OpenSpec foundation flow | jr-orchestrator | `C:\Users\German\.config\opencode\skills\jr-orchestrator\SKILL.md` |
| needs to create/generate/update AGENTS.md, CLAUDE.md, project rules | agents-md-generator | `C:\Users\German\.config\opencode\skills\agent-instruction\SKILL.md` |
| needs to create, build, or generate a knowledge base for a project | kb-creator | `C:\Users\German\.config\opencode\skills\kb-creator\SKILL.md` |

## Compact Rules

Pre-digested rules per skill. Delegators copy matching blocks into sub-agent prompts as `## Project Standards (auto-resolved)`.

### pocketbase-best-practices
- Use JSON fields for objects/structured data, Select for enums, Relation over manual ID strings
- Always set API rules; empty rules = public access. Start locked, open selectively.
- Use `@request.auth`, `@collection`, `@now`, `@request.context` (values: `default`/`oauth2`/`otp`/`password`/`realtime`/`protectedFile`) in rules
- Filter binding to prevent injection: `{:name}` + `dbx.Params` in server-side `FindFirstRecordByFilter`/`FindRecordsByFilter`
- `authWithPassword` for email/pass; `requestOTP`→`authWithOTP` for OTP; rate-limit requestOTP
- Expand relations (`expand`) to avoid N+1; use cursor pagination for large datasets
- Select only needed fields (`fields` param); batch creates/updates when possible
- Realtime: subscribe to specific records/collections; implement reconnection logic
- File serving: `pb.files.getURL()`; uploads via FormData; validate types/sizes server-side
- `defer fs.Close()` on every `NewFilesystem()`/`NewBackupsFilesystem()` handle in Go extensions
- Go hooks: always call `e.Next()`; use `Bind(id)` + `Unbind` for cleanup
- JSVM: only CJS (`require()`) works in goja; bundle ESM first; avoid mutable module state
- Never ship `no-reply@example.com`; resolve sender from `app.Settings().Meta` at send-time
- Rate limiting: use built-in fixed-window (v0.36.7+); front with Nginx/Caddy for defense in depth
- Production: raise `ulimit -n` for realtime, set `GOMEMLIMIT`, enable settings encryption with `PB_ENCRYPTION` (32 chars)

### tanstack-query
- Use `queryOptions()` helper for type-safe, reusable query configurations
- Structure query keys hierarchically (`['resource']`, `['resource', id]`) for granular invalidation
- Use `placeholderData` (not `initialData`) for keeping previous page data during pagination
- Use `enabled` for dependent queries, never conditional hook calls
- Always invalidate queries after mutations: `queryClient.invalidateQueries({ queryKey: [...] })`
- Cancel outgoing queries in `onMutate` before optimistic updates to prevent race conditions
- Use `useSuspenseQuery` with `<Suspense>` boundary for cleaner loading states
- Set `staleTime > 0` for less dynamic data (default 0 = always refetch on mount)
- Use `select` for data derivation instead of inline transformation in components
- Test setup: set `retry: false` and `gcTime: Infinity`; create fresh QueryClient per test wrapper
- Use `ensureQueryData` in route loaders (not `prefetchQuery`) for guaranteed availability
- Infinite queries: required `initialPageParam` in v5; use `getNextPageParam` returning `undefined` = no more pages

### shadcn-ui
- Install via CLI through package manager: `shadcn init` → `shadcn add <component>`
- Import components from `@/components/ui/<component>` — NEVER from `shadcn/ui` package
- Components are copied into your project — you own and edit the source code
- Tailwind v4 required: `@import "tailwindcss"` in main CSS, `@tailwindcss/vite` or `@tailwindcss/postcss`
- Do NOT create or suggest `tailwind.config.js` — theme via CSS variables and `@theme` only
- Path alias `@/*` → `./src/*` required in both tsconfig AND bundler (Vite `resolve.alias`)
- Add multiple components at once: `shadcn add button card dialog`
- shadcn/ui Form component is legacy — use Field component for new implementations
- Use Sonner for toasts (recommended); Toast is deprecated
- In Next.js App Router, set `rsc: true` in `components.json` for Server Component compatibility
- Components accept `className` and spread props; use `cn()` helper for class merging

### tailwind-css
- Tailwind v4 only: NO `tailwind.config.js`, `tailwind.config.ts`, or `tailwind.config.mjs` ever
- Entry: single CSS file with `@import "tailwindcss"` — not imported = no styles
- Theme only in CSS via `@theme { ... }` — never in a JS config file
- Next.js: use `@tailwindcss/postcss` in `postcss.config.mjs` (NOT `tailwindcss` or `autoprefixer`)
- Vite: use `@tailwindcss/vite` plugin; no PostCSS config needed
- Use `@layer base` for element defaults, `@layer components` for reusable component classes
- Custom utilities via `@utility name { ... }` with CSS rules
- Custom variants via `@custom-variant name (selector);`
- Keyframes inside `@theme`: `--animate-name: name duration ease; @keyframes name { ... }`
- React/Next use `className`; Qwik/Vue use `class` — wrong attribute produces no styles
- Arbitrary values: `top-[117px]`, `bg-[#bada55]`, use `_` for spaces in value: `grid-cols-[1fr_500px_2fr]`
- Use `@theme inline` when a theme token references another variable (`var(--...)`)
- Compatibility: targets modern browsers (Chrome 111+, Safari 16.4+, Firefox 128+)

### react-hook-form-zod
- Always set `defaultValues` in useForm — prevents "uncontrolled to controlled" React warnings
- Use `zodResolver(schema)` from `@hookform/resolvers/zod` to connect Zod with RHF
- Type forms with `z.infer<typeof schema>` for full type safety across client and server
- Same Zod schema on client AND server — client validation can be bypassed, never trust it alone
- Use `register()` for standard HTML inputs; use `Controller` only for custom/third-party components
- In useFieldArray `.map()`, use `key={field.id}` (NOT array index) to prevent React key warnings
- Debounce async validation with `useDebouncedCallback` to avoid excessive API calls
- Map server errors to form fields with `setError(field, { type: 'server', message })`
- `mode: 'onSubmit'` for best performance; `onChange`/`onBlur` for live feedback
- Multi-step wizards: use `trigger(fieldsToValidate)` to validate current step before advancing
- Use `z.discriminatedUnion` or `.refine()` with `path` option for conditional validation
- Set `shouldUnregister: true` for multi-step forms to clear unmounted fields
- Never mutate form values directly — use `setValue()` or `reset()` instead
- Always spread `{...field}` in Controller render prop — missing it breaks controlled inputs

### async-python-patterns
- Prefer `asyncio` for I/O-bound operations, threading for CPU-bound, multiprocessing for CPU-heavy
- Use `async def` + `await` for non-blocking I/O; never block the event loop with sync calls
- Use `asyncio.gather()` for concurrent independent tasks, `asyncio.create_task()` for background work
- Use `asyncio.Queue` for producer-consumer patterns; set `maxsize` for backpressure
- Always use `asyncio.timeout()` or `asyncio.wait_for()` to prevent hanging coroutines
- Use `aiohttp` or `httpx.AsyncClient` for HTTP; `aiosqlite` for SQLite; `asyncpg` for PostgreSQL
- Structured concurrency with `TaskGroup` (Python 3.11+) preferred over manual `create_task`+`gather`
- For rate limiting, use `asyncio.Semaphore` or `aiolimiter`

### openspec-*
These are workflow/orchestrator skills used by the main agent, not delegated to sub-agents. Include only if the sub-agent needs to participate in the OPSX workflow.

### judgment-day
Parallel adversarial review: launches two blind judges, synthesizes findings, applies fixes, re-judges until both pass or escalates after 2 iterations.

### roadmap-generator
Generates CHANGES.md with dependency tree, parallelism gates, critical path, multi-agent plan. Fire-and-forget.

### find-skill
Discovers skills by querying user directories and the skill registry. Helps users find and install agent skills.

### skill-creator
Creates, edits, optimizes skills. Runs evals, benchmarks performance, optimizes descriptions for triggering accuracy.

### jr-orchestrator
Thin orchestrator for project foundation flow. Runs `openspec init` then dispatches phases: kb-creator → roadmap-generator → find-skill → skill-registry → agent-instruction.

### agents-md-generator
Generates AGENTS.md from KB and roadmap: stack, knowledge-base reference, skills, roadmap, hard rules. Interactive only for hard rules confirmation.

### kb-creator
Builds 10 canonical .md files at `knowledge-base/`. Dual mode: silent from existing docs or interactive from scratch.

## Project Conventions

| File | Path | Notes |
|------|------|-------|
| — | — | No project convention files found (no AGENTS.md, CLAUDE.md, .cursorrules, GEMINI.md, or copilot-instructions.md) |

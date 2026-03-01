import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Post } from '../modules/posts/entities/post.entity';
import { Category } from '../modules/posts/entities/category.entity';

dotenv.config();

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'personal_website',
  entities: [Post, Category],
  synchronize: true,
});

const CATEGORIES = [
  {
    name: 'AI Development',
    slug: 'ai-development',
    description: 'Articles about AI-assisted development, prompt engineering, and AI coding tools.',
  },
  {
    name: 'Engineering',
    slug: 'engineering',
    description: 'Software engineering best practices, architecture, and methodologies.',
  },
  {
    name: 'DevOps',
    slug: 'devops',
    description: 'CI/CD, deployment, infrastructure, and developer operations.',
  },
];

const POSTS = [
  {
    title: 'Spec-Driven Workflow: How AI Transforms Software Development',
    slug: 'spec-driven-workflow-ai-transforms-software-development',
    categorySlug: 'ai-development',
    tags: ['AI', 'Spec-Driven', 'Workflow', 'Claude', 'Software Engineering'],
    excerpt:
      'Discover how spec-driven development with AI agents is revolutionizing the way we build software. From requirements to implementation, learn the methodology that makes AI a true engineering partner.',
    content: `## Introduction

The way we build software is changing. With AI coding assistants becoming increasingly capable, a new methodology is emerging: **Spec-Driven Development**. Instead of writing code line by line, developers define *what* they want through structured specifications, and AI agents handle the *how*.

This isn't about replacing developers — it's about elevating them from coders to architects.

## What is Spec-Driven Workflow?

Spec-Driven Workflow is a methodology where software development follows a structured pipeline:

\`\`\`
Requirements → Design → Tasks → Implementation → Validation
\`\`\`

Each phase produces a document that feeds into the next, creating a clear chain of decisions. AI agents can participate at every stage, but **humans retain control** at each gate.

### The Three Pillars

1. **Requirements Document** — What the system should do
2. **Design Document** — How the system will be built
3. **Task Breakdown** — Atomic units of work an AI agent can execute

## The Workflow in Practice

### Phase 1: Requirements Gathering

Start by defining what you need. A good requirements document answers:

- **Who** is the user?
- **What** problem are we solving?
- **Why** does this matter?
- **What** are the acceptance criteria?

\`\`\`markdown
# Feature: CV Upload & Parse

## User Story
As an admin, I want to upload a PDF resume so that the system
automatically extracts skills, work history, and education.

## Acceptance Criteria
- [ ] Upload PDF files up to 10MB
- [ ] Extract skills as a tag list
- [ ] Parse work history with dates and descriptions
- [ ] Handle errors gracefully (corrupted PDF, timeout, etc.)
\`\`\`

### Phase 2: Design

The design phase is where you make architectural decisions. This is the most critical phase for AI collaboration — you're setting constraints that guide implementation.

\`\`\`markdown
# Design: CV Upload & Parse

## Architecture
- Backend: NestJS service with PDF parser
- Storage: PostgreSQL with JSONB for flexible data
- Parser: pdf-parse library with timeout protection

## API Design
POST /api/cv/upload → multipart/form-data
GET  /api/cv        → returns parsed CV data
PUT  /api/cv        → updates CV data manually

## Error Handling
| Error | Code | User Message |
|-------|------|-------------|
| File too large | FILE_TOO_LARGE | Max 10MB |
| Invalid PDF | CORRUPTED_PDF | Cannot read file |
| Parse timeout | PARSING_TIMEOUT | Try smaller file |
\`\`\`

### Phase 3: Task Breakdown

This is where the spec-driven approach shines. Break the design into **atomic tasks** — each one small enough for an AI agent to execute independently.

Good tasks are:
- **Self-contained** — No implicit dependencies
- **Testable** — Clear success criteria
- **Specific** — No ambiguity in what to build

\`\`\`markdown
## Task 1: Create ParsedWorkHistoryEntry interface
File: packages/shared/src/types/cv.ts
Add: id, company, role, startDate, endDate, current, highlights, badges

## Task 2: Implement PDF text extraction
File: apps/backend/src/modules/cv/services/pdf-parser.service.ts
- Accept Buffer input
- Return extracted text
- Timeout after 30 seconds
- Handle encrypted PDFs
\`\`\`

### Phase 4: AI-Powered Implementation

With well-defined tasks, an AI agent can execute each one with high accuracy. The key insight: **the quality of the output is directly proportional to the quality of the spec**.

\`\`\`
Vague spec    → AI guesses → bugs and rework
Precise spec  → AI executes → clean, correct code
\`\`\`

### Phase 5: Validation

Each task produces code that can be validated against the spec:

- Does it match the interface definition?
- Do the tests pass?
- Does it handle the error cases listed in the design?

## Why This Works

### 1. Reduces Ambiguity

The biggest source of bugs isn't bad code — it's **misunderstood requirements**. By writing specs first, you catch misunderstandings before any code is written.

### 2. Makes AI Predictable

AI coding assistants work best with clear context. A spec provides that context in a structured, unambiguous format. Instead of:

> "Add a CV upload feature"

You give the AI:

> "Create a POST endpoint at /api/cv/upload that accepts multipart/form-data with a 'file' field. Validate the file is a PDF under 10MB. Use the PDFParserService to extract text. Return a CVParseResult with skills, workHistory, and education arrays."

### 3. Enables Parallel Work

With atomic tasks, multiple AI agents (or team members) can work in parallel without stepping on each other's code.

### 4. Creates Documentation as a Side Effect

Your specs ARE your documentation. When someone asks "why was it built this way?" — point them to the design doc.

## Tools for Spec-Driven Development

Several tools are emerging to support this workflow:

- **Claude Code** with spec commands (\`/spec-create\`, \`/spec-execute\`)
- **Cursor** with .cursorrules for project conventions
- **Custom agents** defined in \`.claude/agents/\` for specialized validation

## Getting Started

1. **Start small** — Pick one feature and write a spec before coding
2. **Iterate on specs** — Your first specs will be too vague. That's normal.
3. **Use templates** — Create reusable templates for requirements, design, and tasks
4. **Review specs, not just code** — Code review is important, but spec review catches issues earlier

## Conclusion

Spec-driven development isn't new — it's what good engineering teams have always done. What's new is that AI makes it **practical**. When the cost of implementation drops, the value of specification rises.

The developers who thrive in the AI era won't be the fastest coders. They'll be the clearest thinkers — the ones who can articulate exactly what needs to be built, and why.

---

*This post is part of the AI Dev Blogs series, exploring how AI is changing software development practices.*`,
    published: true,
    readingTime: 7,
  },
  {
    title: 'Building a Full-Stack App with AI: Lessons from the Trenches',
    slug: 'building-fullstack-app-with-ai-lessons',
    categorySlug: 'ai-development',
    tags: ['AI', 'Full-Stack', 'NestJS', 'React', 'TypeScript'],
    excerpt:
      'A practical retrospective on building a complete web application using AI coding assistants. What worked, what didn\'t, and what I\'d do differently next time.',
    content: `## The Experiment

I set out to build a complete personal website — blog, CV management, admin portal — using AI as my primary coding partner. Not just for autocomplete, but for **architecture, implementation, and debugging**.

Here's what I learned.

## What Worked

### 1. Monorepo Setup

AI excels at scaffolding. Give it a clear architecture and it will generate consistent, well-structured code across your entire monorepo.

\`\`\`
project/
├── apps/
│   ├── backend/    # NestJS API
│   └── frontend/   # React + Vite
├── packages/
│   └── shared/     # TypeScript types
└── package.json    # Workspaces config
\`\`\`

The shared types package was a game-changer — AI could reference the same interfaces in both frontend and backend, keeping them in sync.

### 2. Test-Driven Feedback Loops

When I gave the AI failing tests, it could debug effectively. The test output provided clear, structured feedback that AI could act on:

\`\`\`
FAIL  cv.controller.spec.ts
  Expected: true
  Received: undefined
  at cv.controller.spec.ts:149
\`\`\`

This is much better than "it doesn't work" — the AI knows exactly what's wrong and where.

### 3. Database Schema Design

AI is surprisingly good at designing TypeORM entities with proper relationships, indexes, and validation. It understands common patterns:

\`\`\`typescript
@Entity('posts')
@Index(['slug'], { unique: true })
@Index(['publishedAt'])
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  slug: string;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'categoryId' })
  category: Category;
}
\`\`\`

## What Didn't Work

### 1. Deployment Configuration

AI often generates configurations that work locally but fail in production. Common pitfalls:

- **Workspace names** — Using \`@shared\` instead of \`@aidevblogs/shared\`
- **File storage** — Writing to filesystem on ephemeral platforms like Render
- **Environment-specific settings** — \`synchronize: false\` in production without migrations

Lesson: **Always test the deployment pipeline early.**

### 2. Mocking in Tests

AI-generated test mocks often don't match the actual implementation. When a library's API changes (e.g., \`pdf-parse\` class constructor vs function), the mocks become stale.

### 3. Implicit Assumptions

The AI doesn't know your deployment environment. It doesn't know Render has ephemeral storage, or that your repo is private (so GitHub Pages won't work), or that your Render service URL is \`kai-api-flbx.onrender.com\` not \`kai-api.onrender.com\`.

**Always provide context about your infrastructure.**

## Key Takeaways

1. **Spec first, code second** — The better your specification, the better the AI output
2. **Test early, test often** — Tests are the best feedback loop for AI-generated code
3. **Deploy early** — Don't wait until the end to test your deployment pipeline
4. **Review everything** — AI code looks correct but may have subtle issues (wrong URLs, missing env vars, broken mocks)
5. **Iterate fast** — AI makes iteration cheap, so don't be afraid to refactor

## The Future

We're in the early days of AI-assisted development. The tools are getting better fast. The developers who invest in learning how to work *with* AI — not just *using* AI — will have a massive advantage.

The key skill isn't prompting. It's **thinking clearly about what you want to build**.

---

*Built with NestJS, React, TypeScript, and a lot of AI assistance.*`,
    published: true,
    readingTime: 5,
  },
  {
    title: 'How to Render Large Lists in React Without Killing Performance',
    slug: 'render-large-lists-react-performance',
    categorySlug: 'engineering',
    tags: ['React', 'Performance', 'Virtualization', 'Frontend', 'TypeScript'],
    excerpt:
      'Rendering 10,000+ items in React can freeze your UI. Learn the three main approaches — naive, memoized, and virtualized — with benchmarks and code examples to pick the right one for your use case.',
    content: `## The Problem

You have a list of 10,000 items. You render them all. Your app freezes.

This is one of the most common React performance issues, and it has a straightforward solution — but choosing the **right** approach depends on your use case.

## Three Approaches

\`\`\`
< 100 items    → Just render them
100–1,000      → React.memo + useMemo
1,000–10,000   → Virtualization
10,000+        → Virtualization + server-side pagination
\`\`\`

Let's walk through each one.

---

## Approach 1: Naive Rendering

The simplest approach — render everything:

\`\`\`tsx
function NaiveList({ items }) {
  return (
    <div style={{ height: 400, overflow: 'auto' }}>
      {items.map((item) => (
        <div key={item.id}>
          <p>{item.name}</p>
          <p>{item.email}</p>
        </div>
      ))}
    </div>
  );
}
\`\`\`

**Problem:** With 10,000 items, React creates 10,000 DOM nodes. The browser must layout and paint all of them, even though only ~10 are visible. Initial render can take **500ms+**.

**When it's fine:** Lists under 100 items with simple markup.

---

## Approach 2: Memoized Rendering

Use \`React.memo\` to prevent unnecessary re-renders and \`useMemo\` to avoid recomputing derived data:

\`\`\`tsx
const ListItem = React.memo(function ListItem({ item }) {
  return (
    <div>
      <p>{item.name}</p>
      <p>{item.email}</p>
    </div>
  );
});

function MemoizedList({ items, search }) {
  // Only re-filter when items or search changes
  const filtered = useMemo(
    () => items.filter((i) => i.name.includes(search)),
    [items, search],
  );

  return (
    <div style={{ height: 400, overflow: 'auto' }}>
      {filtered.map((item) => (
        <ListItem key={item.id} item={item} />
      ))}
    </div>
  );
}
\`\`\`

### Key rules for memoization:

- **Stable keys** — Always use a unique \`id\`, never array index for dynamic lists
- **Stable callbacks** — Wrap event handlers in \`useCallback\` before passing to memoized children
- **Avoid inline objects** — \`style={{ color: 'red' }}\` creates a new object every render, breaking memo

\`\`\`tsx
// Bad — breaks React.memo
<ListItem item={item} onDelete={() => deleteItem(item.id)} />

// Good — stable reference
const handleDelete = useCallback((id) => {
  setItems((prev) => prev.filter((i) => i.id !== id));
}, []);
<ListItem item={item} onDelete={handleDelete} />
\`\`\`

**Limitation:** Memoization helps with **re-renders**, but the initial mount is still slow because all DOM nodes are created.

---

## Approach 3: Virtualization (The Winner)

Only render items visible in the viewport. A list of 50,000 items renders **~20 DOM nodes**.

\`\`\`
┌─────────────────────┐
│  ░░░░░░░░░░░░░░░░░  │  ← Not rendered (above viewport)
│  ░░░░░░░░░░░░░░░░░  │
├─────────────────────┤
│  ██ Item 45 ██████  │  ← Rendered (visible)
│  ██ Item 46 ██████  │
│  ██ Item 47 ██████  │
│  ██ Item 48 ██████  │
├─────────────────────┤
│  ░░░░░░░░░░░░░░░░░  │  ← Not rendered (below viewport)
│  ░░░░░░░░░░░░░░░░░  │
└─────────────────────┘
\`\`\`

### Using @tanstack/react-virtual

\`\`\`tsx
import { useVirtualizer } from '@tanstack/react-virtual';

function VirtualizedList({ items }) {
  const parentRef = useRef(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50, // estimated row height in px
    overscan: 5,            // render 5 extra items outside viewport
  });

  return (
    <div ref={parentRef} style={{ height: 400, overflow: 'auto' }}>
      <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const item = items[virtualRow.index];
          return (
            <div
              key={virtualRow.key}
              style={{
                position: 'absolute',
                top: virtualRow.start,
                height: virtualRow.size,
                width: '100%',
              }}
            >
              <p>{item.name}</p>
              <p>{item.email}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
\`\`\`

### How it works

1. A scrollable container has a fixed height (the viewport)
2. A tall inner div simulates the full list height via \`getTotalSize()\`
3. Only visible items are rendered with \`position: absolute\` at their calculated \`top\` offset
4. As the user scrolls, items are recycled — old ones unmount, new ones mount
5. \`overscan\` renders a few extra items outside the viewport for smoother scrolling

### Library comparison

| Library | Best For |
|---------|----------|
| \`@tanstack/react-virtual\` | Flexible, headless, modern (recommended) |
| \`react-window\` | Simple fixed/variable size lists |
| \`react-virtuoso\` | Auto-sizing, grouped lists, chat UIs |

---

## Bonus: Debounce Your Filters

When combining large lists with search/filter, don't re-filter on every keystroke:

\`\`\`tsx
function SearchableList({ items }) {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const filtered = useMemo(
    () => items.filter((i) => i.name.includes(debouncedSearch)),
    [items, debouncedSearch],
  );

  return (
    <>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search..."
      />
      <VirtualizedList items={filtered} />
    </>
  );
}
\`\`\`

This avoids filtering 50,000 items on every keystroke — it waits 300ms for the user to stop typing.

---

## Performance Comparison

Here's what I measured rendering 10,000 items on a MacBook Pro:

| Approach | Initial Render | Re-render | DOM Nodes |
|----------|---------------|-----------|-----------|
| Naive | ~450ms | ~300ms | 10,000 |
| Memoized | ~400ms | ~5ms | 10,000 |
| Virtualized | ~8ms | ~3ms | ~20 |

The difference is dramatic. Virtualization is **50x faster** on initial render because it simply doesn't create the DOM nodes.

---

## Decision Flowchart

\`\`\`
How many items?
│
├─ < 100 ──────→ Just render them. Add React.memo if items are complex.
│
├─ 100–1,000 ──→ Pagination or React.memo + useMemo
│
├─ 1,000–10,000 → Virtualization (@tanstack/react-virtual)
│
└─ 10,000+ ────→ Virtualization + server-side pagination
                  (don't send all data to the browser)
\`\`\`

## Summary

| Concern | Solution |
|---------|----------|
| Too many DOM nodes | **Virtualization** |
| Too much data from API | **Pagination / infinite scroll** |
| Items re-rendering needlessly | **React.memo + stable keys + useCallback** |
| Expensive filtering/sorting | **useMemo** |
| Rapid input triggering re-renders | **Debounce** |

The **#1 takeaway**: for large lists, **virtualization** is the single biggest win. Everything else is optimization on top. Start with \`@tanstack/react-virtual\` — it's headless, flexible, and works with any styling approach.

---

*This post is part of the AI Dev Blogs series on React performance patterns.*`,
    published: true,
    readingTime: 8,
  },
  {
    title: 'CI/CD Pipeline for AI-Built Projects: A Practical Guide',
    slug: 'cicd-pipeline-ai-built-projects-practical-guide',
    categorySlug: 'devops',
    tags: ['CI/CD', 'GitHub Actions', 'Render', 'DevOps', 'Deployment'],
    excerpt:
      'How to set up a robust CI/CD pipeline for projects built with AI assistance. From GitHub Actions to Render auto-deploy, with health checks and staging environments.',
    content: `## Why CI/CD Matters More with AI

When AI generates your code, you need **automated quality gates** more than ever. A solid CI/CD pipeline catches issues that might slip through AI-generated code before they reach production.

## The Pipeline

\`\`\`
Push to main
  → CI: Build + Test (GitHub Actions)
    → Backend Deploy (Render auto-deploy)
    → Frontend Deploy (GitHub Pages)
      → Health Checks (verify everything works)
\`\`\`

## Step 1: CI with GitHub Actions

\`\`\`yaml
name: CI
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - run: npm ci
      - run: npm run build --workspace=@aidevblogs/shared
      - run: npm run build --workspace=@aidevblogs/backend
      - run: npm run build --workspace=@aidevblogs/frontend
      - run: npm test --workspace=@aidevblogs/backend
\`\`\`

Key decisions:
- **Build order matters** — Shared package first, then consumers
- **Cache npm** — Speeds up builds significantly
- **Test in CI** — Don't rely on pre-commit hooks alone

## Step 2: Backend Deploy with Docker

Use a multi-stage Dockerfile to keep production images small:

\`\`\`dockerfile
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
CMD ["node", "dist/main.js"]
\`\`\`

## Step 3: Health Checks

Always verify your deployment actually works:

\`\`\`yaml
- name: Health check API
  run: |
    for i in {1..5}; do
      STATUS=$(curl -s -o /dev/null -w "%{http_code}" $API_URL/health)
      if [ "$STATUS" = "200" ]; then
        echo "API is healthy!"
        exit 0
      fi
      sleep 30
    done
    exit 1
\`\`\`

## Common Pitfalls

1. **Workspace names in Docker** — Make sure \`--workspace=\` matches your package.json name exactly
2. **Environment variables** — \`VITE_*\` vars are baked at build time, not runtime
3. **Database sync** — Decide on synchronize vs migrations early
4. **CORS** — Update origins when domains change

## Conclusion

A good CI/CD pipeline is your safety net. When AI generates code at high speed, automated tests and deployment checks keep quality high.

---

*Part of the AI Dev Blogs series on modern development practices.*`,
    published: true,
    readingTime: 4,
  },
];

async function seed() {
  await dataSource.initialize();
  console.log('Database connected.');

  const categoryRepository = dataSource.getRepository(Category);
  const postRepository = dataSource.getRepository(Post);

  // Seed categories
  for (const cat of CATEGORIES) {
    const existing = await categoryRepository.findOne({ where: { slug: cat.slug } });
    if (!existing) {
      await categoryRepository.save(categoryRepository.create(cat));
      console.log(`  Created category: ${cat.name}`);
    } else {
      console.log(`  Category exists: ${cat.name}`);
    }
  }

  // Seed posts
  for (const postData of POSTS) {
    const existing = await postRepository.findOne({ where: { slug: postData.slug } });
    if (existing) {
      console.log(`  Post exists: ${postData.title}`);
      continue;
    }

    const category = await categoryRepository.findOne({
      where: { slug: postData.categorySlug },
    });

    const post = postRepository.create({
      title: postData.title,
      slug: postData.slug,
      excerpt: postData.excerpt,
      content: postData.content,
      tags: postData.tags,
      published: postData.published,
      publishedAt: postData.published ? new Date() : undefined,
      readingTime: postData.readingTime,
      categoryId: category?.id,
    });

    await postRepository.save(post);
    console.log(`  Created post: ${postData.title}`);
  }

  console.log('\nBlog seed completed!');
  await dataSource.destroy();
}

seed().catch((error) => {
  console.error('Error seeding blog:', error);
  process.exit(1);
});

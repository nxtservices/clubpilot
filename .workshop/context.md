# ClubPilot MVP Development

## Project Overview
ClubPilot is a smart multi-tenant SaaS platform for associations, sports clubs, committees, volunteers and boards. It's a central workspace connecting people, roles, availability, teams, committees, tasks, documents, agenda items, meetings, decisions and voting rounds.

**Tagline:** De slimme cockpit voor je vereniging (The smart cockpit for your association)

**Philosophy:** Build the MVP as a Smart Foundation. Do not implement heavy AI yet. First build strong data models, workflows, rule-based smart signals and smart suggestions.

## Tech Stack
- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion (subtle animations)
- Supabase Auth (authentication)
- Supabase Postgres (database with RLS)
- Supabase RLS (mandatory row-level security)

## Branding & Colors
- Primary: #2563EB (brand-primary)
- Secondary: #14B8A6 (brand-secondary)
- Highlight: #FACC15 (brand-highlight)
- Dark Navy: #0F172A (brand-dark)
- Light Background: #F8FAFC (brand-light)
- Language: Dutch (nl)
- Style: Modern, trustworthy, friendly, professional SaaS

## Core Architecture Requirements
- **Multi-tenant from day one**: Every tenant-owned table must have tenant_id
- **Users belong to multiple tenants**: Not one user = one tenant
- **Tenant-scoped roles & permissions**: All access control is per-tenant
- **Supabase RLS mandatory**: All tenant data is private by default
- **Audit logs append-only**: Full history tracking
- **Future-ready**: Prepared for AI, WhatsApp, Google Drive, OneDrive, calendar integrations

## Project Structure
```
clubpilot_saas/
├── src/
│   ├── app/              # Next.js App Router pages and layout
│   ├── components/       # React components
│   ├── lib/              # Utilities, supabase client, helpers
│   ├── types/            # TypeScript types and interfaces
│   └── styles/           # Global styles
├── public/               # Static assets
├── .env.local.example    # Environment template
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript config
├── next.config.js        # Next.js config
├── tailwind.config.ts    # Tailwind config
├── postcss.config.js     # PostCSS config
└── .gitignore            # Git ignore rules
```

## Core Database Tables (per spec)
See supabase/schema.sql when created. Key structure:
- **Core**: tenants, profiles, tenant_memberships, roles, permissions, role_permissions, seasons
- **Organization**: committees, committee_members, teams, team_members, parent_child_links
- **Volunteers**: volunteer_profiles, volunteer_intake_answers, volunteer_shifts, volunteer_points_ledger
- **Planning**: calendar_events, tasks, task_comments
- **Documents**: documents, document_links
- **Meetings**: meetings, meeting_agenda_items
- **Decisions**: decisions
- **Voting**: voting_rounds, voting_options, votes
- **Smart**: smart_signals, smart_suggestions, notifications

## MVP Build Order (Phases)
1. ✅ Project setup, dependencies, basic structure
2. Supabase Auth setup & RLS policies
3. Database schema creation
4. App shell & sidebar navigation
5. Tenant & membership foundation
6. Committees & Teams
7. Volunteer intake form
8. Volunteer task templates & shifts
9. Volunteer planning (signup, assignment, team assignment)
10. Volunteer points ledger system
11. Agenda/Calendar module
12. Tasks module
13. Document links
14. Meetings module
15. Decisions module
16. Voting rounds
17. In-app notifications
18. Smart signals & suggestions
19. Smart volunteer placement
20. Demo data seeding

## Important Principles
- **No heavy AI in MVP**: Use rule-based logic, not ML
- **Strong data models first**: Architecture for AI later
- **Dutch UI language**: All labels in Dutch
- **Responsive design**: Mobile-friendly
- **Supabase RLS**: Every query respects tenant boundaries
- **Audit trails**: Every action is logged

## Environment Variables Needed
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Next Steps
1. Set up Supabase project and get credentials
2. Create .env.local from .env.local.example
3. Begin Phase 2: Auth & RLS implementation
4. Create database schema

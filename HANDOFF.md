# Handoff (updated 2026-10-17)

Talent side is feature-complete and pushed (see "Talent side" below). The employer side was mapped,
tested, and largely fixed and extended in this session. **None of the employer work is committed yet.**

## Where things live

| What                              | Path                                                                                              |
| --------------------------------- | ------------------------------------------------------------------------------------------------- |
| Frontend                          | `~/Desktop/skillsift-fe`, branch `fix/employer-phase0` (about 90 uncommitted files)               |
| Backend                           | `~/Desktop/credlane-be`, branch `fix/employer-phase0` (about 51 uncommitted files)                |
| Seed content (outside both repos) | `~/Desktop/skillsift-test-seed`                                                                   |
| Item-writing rules                | `skillsift-test-seed/ITEM-WRITING-SPEC.md`                                                        |
| Question validator                | `credlane-be/scripts/validate-question-bank.mjs` (`--tells --coverage`)                           |
| Local DB                          | docker `skillbridge-pg`, db `skillbridge_dev`, user `postgres`                                    |
| Test accounts                     | `talent_test_1..22@skillbridge.com`; employer `employer_test_1` (password in backend seed script) |

Run: backend `pnpm start:dev` (port 8080), frontend `pnpm dev` (port 3000). Browser calls go through the
same-origin `/backend/*` rewrite. AGENTS.md says this Next.js has breaking changes: read
`node_modules/next/dist/docs/` before writing new framework code.

Gotchas: one refresh token per user, so a curl login as the same user logs the browser session out.
Restart `next dev` after `next.config.ts` changes. Chrome MCP tab for browser testing may need re-creating.

## Strategy decided with the user

Employers are the revenue source. Model: **free to browse and shortlist, pay to unlock**.

- Free view: first name plus last initial, score, level, strengths, availability. No photo.
- One unlock reveals one talent: full name, photo, resume, portfolio, LinkedIn, contact email, share link.
- Hybrid pricing: monthly plan allowance plus never-expiring top-up credits; 3 welcome credits for new employers.
- Talent who accept an interview invite are revealed to that employer at no cost.
- Retention loops: pipeline, saved talent, monthly allowance reset, hiring checklist. Not built yet: new-match alerts.
- Judging on skill first (hidden photo and name) is a deliberate anti-bias choice.
- Talent cannot be anonymous: photo, resume and portfolio are mandatory; incomplete profiles are hidden from employers.

## Done this session (all uncommitted)

### Backend (`credlane-be`)

- Employer roles: pipeline filtered by role track (or declared interest); search no longer matches email.
- Employer assessments: share URL is `/assessment/<token>`; search-talent is name-only, returns masked names,
  accepts `track` to list same-track talent first; list/detail now return `talents_count`, `submission_count`,
  `pass_rate`, `last_activity_at` (new `loadAssessmentStats`); template and error text renamed to SkillSift.
- Offers: interview-link URL validation; candidate masked for employer views, employer shown as company name to talent.
- Discovery: `region` accepts comma-separated list; only talent with avatar + resume + portfolio are listed;
  cards and profile are masked until unlocked; new `POST employer/discovery/candidates/:userId/unlock`
  (404 if not job_ready, 402 when no unlocks left); profile adds `is_unlocked`, `portfolio_url`, `linkedin_url`.
- New module `modules/employer-billing`: `EmployerWallet`, `EmployerUnlock`, `EmployerBillingService`
  (`unlock`, `getSummary`, `getUnlockedIds`, `activatePlan`, `addCredits`), `GET employer/billing/summary`,
  constants for plans and prices (placeholders: Starter 15/mo $49 / ₦49,000; Growth 50/mo $129 / ₦129,000).
  Migration `1789000000000-CreateEmployerBilling` (run locally; must run before deploy). `PaymentRequiredError` added.
- Talent onboarding `saveProfile` now requires avatar, uploaded resume and `portfolioUrl` (new optional DTO field,
  stored as `personal_website`).
- Dashboard: "Created Assessments" count now counts created, not just those with submissions.
- Seeder `talent.seeder.ts` sets avatar, resume and website; the 44 local seeded talents were patched in the DB.
- Tests added or updated across employer-assessments, employer-discovery, employer-billing, dashboard.
  Full suite: 69 suites, 723 tests pass. tsc and eslint clean.

### Frontend (`skillsift-fe`)

- Role and assessment creation wizards rebuilt to match backend contract (track, education enum, levels,
  recipients, CSV import, external link vs send to talent). Placeholder copy removed.
- Assessments: table labels, green Active pill, real stat cards, Activity tab, client-side paging,
  new detail page at `/e/assessments/[id]` (wizard moved to `/e/assessments/draft`).
- Terminology unified to "invite" (Invites sent, Send invite). Region filter is now countries.
- Removed fabricated testimonials from the employer dashboard; fixed Talents hero copy; `.env.local` app name.
- Employer dashboard: hiring checklist (`employer-next-steps.tsx`).
- Pipeline page (route still `/e/shortlist`, nav label "Pipeline") with stage strip: Shortlisted, Invited, Accepted, Hired.
- Talent onboarding requires photo, resume and portfolio link; dashboard banner for existing talent missing any.
- Unlock panel on employer talent profile; `/e/billing` page and nav tab; public `/pricing` page (nav and footer links).
- `next.config.ts` allows `i.pravatar.cc` in non-production only.
- tsc, eslint, prettier clean.

## Open items, in suggested order

1. **Commit and open PRs** for both `fix/employer-phase0` branches (not requested yet). Run the new migration
   before deploying; deploy frontend and backend together. Older HANDOFF items still apply: backend PR for
   `feat/talent-assessment-experience`, practice questions import, env names, logo asset.
2. **Payments**: Paystack (NGN) and Stripe (USD) in test mode. Needs the user's account keys. Wire a webhook to
   `EmployerBillingService.activatePlan` and `addCredits`; add checkout to `/e/billing` and the plan cards
   (paid buttons currently email admin@skillsift.online). Validate prices with 5 to 10 employers first.
3. **Close the name-search leak**: discovery `search` matches full names, so an employer can confirm a surname
   on a locked profile. Restrict locked search to first names.
4. **Not browser-tested**: new onboarding step (photo, resume, portfolio), talent dashboard banner, 402
   out-of-unlocks path, Activity tab and paging on assessments, pipeline stage clicks (Invited, Accepted, Hired),
   external assessment taken as a candidate, talent-side view of an invited assessment. No unit test for the
   new `saveProfile` required-field checks.
5. **Phase 1 leftovers**: empty states with one clear next action on Roles, Assessments and Pipeline; wizard
   sidebar ticks look fine in code but re-check; LinkedIn change copy and 180-day lock on first set;
   Apply-button UX on Talents filters; duplicate-invite warning in UI; offers tab shows "—" for score and salary;
   pipeline hub only counts the first 100 invites.
6. **Missing backend**: `/employer/hire-feedback` and `/talent/track-record` return 404 (frontend treats it as
   "no data", so no visible bug); build or keep hidden.
7. **Retention features**: new-match alerts for saved searches or roles, saved-talent updates.
8. **AI keys**: backend only reads `OPENROUTER_API_KEY`, `OPENROUTER_BASE_URL`, `OPENROUTER_MODEL`. The pasted
   Anthropic key is invalid, the OpenRouter key is a placeholder, the Gemini key works but is unused by code.
   Open-text answers score 0 until a working OpenRouter key is added or Gemini is supported. All pasted
   secrets are in a past chat: rotate them.
9. **Assessment question quality review** (deferred by the user until the employer flow is done). See memory
   notes: no repeated questions on retake, question-writing standards, admin-managed resources.
10. Employer verification: unverified employers get 403 on invites and talent search; verification needs
    email verified, LinkedIn URL, resolvable website.

## Talent side (from earlier work, unchanged)

Shipped: onboarding gate, practice test, skill assessment with server timer and autosave, advanced assessment
with queued scoring, certificates (public `/c/[code]`, PDF, QR, 12-month validity), dashboard by stage,
career resources, notifications, waitlist, no-repeat question rule.

Backend cleanup backlog (not blocking): inline-mode retake lock on transient scoring failure; revoked
certificate can still notify; certificates module tidy-up and tests; importer edge cases; forward-only `down()`
migrations; throttle practice check endpoint.

Known small issues: advanced intro says 30 minutes but timer is 50:00; local email sending fails (invalid key);
`/c/<bad code>` returns 200 with a not-found card; some older pages may say "SkillBridge".

Deferred to the admin phase: question-bank human review, admin-managed resources (free/paid, price, ordering),
question sustainability (variants, cooldown, AI-drafted bulk content).

Product decisions still open: scoring and promotion rule (95% core plus 70% probe is near-perfect);
talent-side payments (first certificate free, what is paid); launch with fewer tracks (only
`frontend_developer` has questions and resources); competency-to-resources mapping without AI; talent
engagement ideas (streaks, profile-viewed signals, percentile).

## Local test data

- `employer_test_1` has 2 roles, 2 assessments (one external "QA External"), 1 shortlisted talent (Noah Lewis,
  accepted invite so unlocked), Bob Johnson unlocked via credit, 2 welcome credits left.
- 44 seeded job_ready talents (22 tracks x 2) with placeholder avatar, resume and portfolio.
- `talent_test_3` has a hand-inserted certificate `TESTCERT23` despite a failed skill attempt; `talent_test_10`
  passed skill at 95% (used for advanced testing). Reset via `pnpm db:reset` if needed.

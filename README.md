# LifeTerrain Research & Training — Course & Enrollment Platform

A full-stack platform for LifeTerrain Research & Training (India) to publish
paid courses/workshops, take enrollments + payments (Razorpay), and keep
enrolled participants notified by email and WhatsApp — including automatic
day-before reminders.

**Brand theme**: deep forest green, gold/amber accent, leaf green — matched
to the course brochure design.

## Structure
- `apps/web` — public site (Next.js): home, course listings, course detail,
  register & pay, login, "my enrollments" dashboard
- `apps/admin` — staff dashboard (Next.js): manage courses, view enrollments,
  send broadcast notifications
- `packages/ui` — shared Atomic Design component library (atoms → molecules
  → organisms) used by both apps
- `services/functions` — Firebase Cloud Functions: Razorpay order creation +
  payment verification, email/WhatsApp senders, scheduled reminder job,
  Firestore triggers
- `firestore.rules`, `firestore.indexes.json`, `firebase.json` — backend config

## Quick start
See `docs/SETUP.md` for full instructions. Short version:
```bash
pnpm install
cp apps/web/.env.local.example apps/web/.env.local
cp apps/admin/.env.local.example apps/admin/.env.local
pnpm dev
```

## Docs
- `docs/ARCHITECTURE.md` — why this stack, how the payment flow works
- `docs/DATA_MODEL.md` — Firestore collections and fields
- `docs/SETUP.md` — environment variables, Firebase bootstrap, deploy steps

## Admin panel (`apps/admin`)
Beyond Courses, Enrollments and Notifications, the admin panel now manages
all the content the public site used to hardcode:
- **Gallery** — add/edit/delete photos, set category (drives the filter
  pills on `/gallery`)
- **Testimonials** — add/edit/delete, publish/unpublish toggle, display order
- **Team** — resource-person profiles shown on the homepage and About page
- **FAQs** — the homepage FAQ accordion
- **Subscribers** / **Enquiries** — read-only views of newsletter sign-ups
  and contact-form submissions, which were previously being collected with
  no way to see them

The public site (`apps/web`) reads all four content types from Firestore
via `apps/web/lib/content.ts`, falling back to a small placeholder set if
a collection is still empty — so the site never renders a blank section
before an admin has added real content.

## Notes / next steps
- Sample content for the three currently-announced courses (EIA workshop,
  GHG Accounting & Carbon Credits master class, Green Tech & IP workshop)
  should be entered via the admin Courses page — see `docs/SETUP.md` §7.
- WhatsApp sending uses the Meta Cloud API; swap `sendWhatsApp.ts` for
  Twilio if that's easier to get approved.
- This is a complete, working scaffold — wire up your real Firebase project
  and API keys, run `pnpm dev`, and it's ready to take real enrollments.

## Motion & interaction layer (packages/ui/src/atoms/Reveal.tsx)
Every major section fades/slides in on scroll (`Reveal`), grids of cards
stagger in one-by-one (`StaggerGroup`/`StaggerItem`), the hero has a
parallax background + a scroll-cue, cards lift on hover, nav links get an
animated underline, and buttons give press feedback. The course detail page
uses `CourseTimeline` — a click-through day selector — instead of a flat
grid, so a 10-day curriculum reads as a sequence rather than a wall of text.

**Still needs real content to feel fully "yours" rather than a polished
scaffold**: instructor bios/credentials, real testimonials, an actual
photo gallery from past sessions, and a blog/updates feed — all flagged
inline in `apps/web/app/page.tsx` and `app/about/page.tsx` where the
placeholder copy and stock Unsplash images currently sit.

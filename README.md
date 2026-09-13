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

## Notes / next steps
- Sample content for the three currently-announced courses (EIA workshop,
  GHG Accounting & Carbon Credits master class, Green Tech & IP workshop)
  should be entered via the admin Courses page — see `docs/SETUP.md` §7.
- WhatsApp sending uses the Meta Cloud API; swap `sendWhatsApp.ts` for
  Twilio if that's easier to get approved.
- This is a complete, working scaffold — wire up your real Firebase project
  and API keys, run `pnpm dev`, and it's ready to take real enrollments.

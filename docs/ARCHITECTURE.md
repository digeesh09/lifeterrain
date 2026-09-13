# Architecture

## Monorepo layout (pnpm workspaces + Turborepo)

```
lifeterrain/
├── apps/
│   ├── web/        Next.js 14 — public marketing site + enrollment flow
│   └── admin/       Next.js 14 — admin dashboard (courses, enrollments, notifications)
├── packages/
│   └── ui/          Shared design system, built Atomic-Design style:
│                       atoms/     Button, Input, Badge, Card, Spinner
│                       molecules/ CourseCard, FormField, SectionHeading
│                       organisms/ Navbar, Footer, Hero, CourseGrid, RegistrationForm
├── services/
│   └── functions/   Firebase Cloud Functions (Node/TypeScript) — payments,
│                     notifications, Firestore triggers, scheduled reminders
├── firestore.rules / firestore.indexes.json / firebase.json
└── docs/
```

Why this split: `apps/web` and `apps/admin` are two very different audiences
(public visitors vs. staff) with different auth models, so they're separate
deployable Next.js apps rather than one app with route guards. Both import
the **same** `@lifeterrain/ui` package, so the brand (colors, buttons, cards)
never drifts between them. `services/functions` is the only thing that can
touch money or send notifications — neither Next.js app talks to Razorpay or
the WhatsApp API directly.

## Why Firebase (recommended over raw MySQL)

- **Auth is built in** — email/password + Google sign-in for participants,
  and custom claims (`admin: true`) for staff — no separate auth service to run.
- **Firestore's realtime listeners** power the admin dashboard's live
  courses/enrollments tables with zero polling code.
- **Cloud Functions** double as your backend API *and* your cron
  (`pubsub.schedule`) for the "remind enrolled people the day before" feature,
  so there's no separate server/queue to host.
- **Firebase Hosting** deploys both Next.js apps and Cloud Functions from one
  `firebase deploy`, which matters for a small org without dedicated DevOps.
- If you outgrow it, Firestore data exports cleanly and the Functions layer
  can be swapped for a Node/Express + MySQL service later without touching
  `apps/web` or `apps/admin` — they only ever call `/createOrder`,
  `/verifyPayment`, `/notifyEnrolled`, which can be re-pointed at any backend.

## Payment flow

1. Visitor fills `RegistrationForm` → client creates a Firestore
   `enrollments/{id}` doc with `status: "pending_payment"`.
2. Client calls Cloud Function `createOrder` (server re-reads the *current*
   course fee — never trusts a client-sent amount) → gets a Razorpay order.
3. Razorpay Checkout opens; on success the client calls `verifyPayment`.
4. `verifyPayment` checks the HMAC signature server-side, and **only then**
   flips `status` to `"confirmed"` (Firestore rules block clients from ever
   writing that field themselves).
5. Confirmation email + WhatsApp message fire immediately;
   `dailyCourseReminders` (scheduled function) reminds confirmed enrollees
   the day before each course start.

## Data model

See `DATA_MODEL.md`.

# Setup

## 1. Prerequisites
- Node 20+, pnpm 9 (`npm i -g pnpm`)
- A Firebase project (Blaze plan — required for Cloud Functions' outbound
  network calls to Razorpay/WhatsApp)
- A Razorpay account (test mode keys to start)
- A WhatsApp Cloud API app (Meta for Developers) + a verified sender number,
  or swap `sendWhatsApp.ts` for Twilio if you'd rather use that
- An SMTP account for transactional email (e.g. Gmail app password,
  Zoho Mail, or a transactional provider like Resend/SES)

## 2. Install
```bash
pnpm install
```

## 3. Configure environment
```bash
cp apps/web/.env.local.example apps/web/.env.local
cp apps/admin/.env.local.example apps/admin/.env.local
# fill in your Firebase web app config + Razorpay public key id in both
```

Cloud Functions config (server-side secrets, never exposed to the browser):
```bash
firebase functions:config:set \
  razorpay.key_id="rzp_test_xxx" razorpay.key_secret="xxx" \
  smtp.host="smtp.example.com" smtp.port="587" smtp.user="you@example.com" smtp.pass="xxx" \
  whatsapp.token="xxx" whatsapp.phone_id="xxx"
```

## 4. Bootstrap Firebase
```bash
firebase login
cp .firebaserc.example .firebaserc   # edit with your project id
firebase deploy --only firestore:rules,firestore:indexes
```

## 5. Create your first admin
Sign up once through `apps/admin`'s login page with a real account, then
from the Firebase console → Functions, manually run `grantAdminRole` once
via the emulator or a temporary script (the callable function itself
requires an *existing* admin, so the very first one must be set directly
via the Admin SDK — a one-line Node script using
`admin.auth().setCustomUserClaims(uid, { admin: true })` works fine).

## 6. Run locally
```bash
pnpm dev            # runs web (3000) + admin (3001) in parallel
cd services/functions && npm run serve   # Firebase emulator for functions
```

## 7. Seed courses
Log into `apps/admin` → Courses → "Add New Course" and enter the three
programmes from the brochure (EIA Workshop, GHG Accounting & Carbon Credits
Master Class, Green Tech & IP Workshop) — or bulk-import via a script against
the `courses` collection using the shape in `DATA_MODEL.md`.

## 8. Deploy
```bash
pnpm build
firebase deploy
```

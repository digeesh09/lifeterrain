# Firestore Data Model

## `courses/{slug}`
| field | type | notes |
|---|---|---|
| title | string | |
| description | string | |
| startDate / endDate | string | human-formatted, shown on cards |
| startDateISO | string (ISO) | used for sorting & the reminder cron |
| time | string | e.g. "7:30 – 8:30 PM IST" |
| mode | string | e.g. "Online \| Live Interactive" |
| fee | number | in ₹ |
| earlyBirdFee / earlyBirdDeadline | number / ISO string | optional |
| seatsLeft | number | optional, decremented on confirmed enrollment |
| status | "upcoming" \| "open" \| "closed" \| "completed" | |
| curriculum | array<{day, heading, points[]}> | powers the day-by-day breakdown |
| resourcePersons | array<{name, role, photoUrl}> | |
| meetingLink | string | optional, used in reminder messages |

## `enrollments/{autoId}`
| field | type | notes |
|---|---|---|
| name, email, phone | string | applicant details |
| qualification, organisation, hearAbout | string | optional |
| courseSlug, courseTitle | string | denormalised for easy display |
| amount | number | fee actually charged |
| status | "pending_payment" \| "confirmed" \| "cancelled" | only Cloud Functions may set "confirmed" |
| paymentId, orderId | string | Razorpay identifiers, set on confirmation |
| createdAt, confirmedAt | Timestamp | |

## Firebase Auth custom claims
- `admin: true` — set via the `grantAdminRole` callable function; required
  to load anything under `apps/admin`.

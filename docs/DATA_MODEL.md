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

## `galleryPhotos/{autoId}`
| field | type | notes |
|---|---|---|
| url | string | hosted image link |
| alt | string | caption / accessibility text |
| category | string | drives the filter pills on `/gallery` |
| addedAt | string (YYYY-MM-DD) | set automatically on save; homepage shows the newest N |

Managed from the admin **Gallery** page. Public site falls back to a small
placeholder set if this collection is empty.

## `testimonials/{autoId}`
| field | type | notes |
|---|---|---|
| quote, name, role | string | |
| published | boolean | only `true` testimonials render on the homepage |
| order | number | display sequence, lower first |

Managed from the admin **Testimonials** page.

## `teamMembers/{autoId}`
| field | type | notes |
|---|---|---|
| name, role, bio, photoUrl | string | |
| order | number | display sequence, lower first |

Managed from the admin **Team** page. Shown on the homepage and About page.

## `faqs/{autoId}`
| field | type | notes |
|---|---|---|
| question, answer | string | |
| order | number | display sequence, lower first |

Managed from the admin **FAQs** page. Shown in the homepage FAQ accordion.

## `newsletterSubscribers/{autoId}`
| field | type | notes |
|---|---|---|
| email | string | |
| createdAt | Timestamp | |

Created by the homepage newsletter form (`apps/web/app/actions.ts`). Viewed
read-only from the admin **Subscribers** page.

## `enquiries/{autoId}`
| field | type | notes |
|---|---|---|
| name, email, message | string | |
| createdAt | Timestamp | |

Created by the public Contact page. Viewed read-only from the admin
**Enquiries** page.

## Firebase Auth custom claims
- `admin: true` — set via the `grantAdminRole` callable function; required
  to load anything under `apps/admin`.

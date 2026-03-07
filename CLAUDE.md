# Spirit Atelier

E-commerce + service booking platform for a spiritual retail business built with Next.js App Router.

## Tech Stack

- **Framework:** Next.js 16.1.6 (App Router, React 19)
- **Language:** TypeScript (strict mode, path alias `@/*` -> `src/*`)
- **Database:** PostgreSQL via Prisma 7 (schema at `prisma/schema.prisma`, generated client at `src/generated/prisma`)
- **Auth:** NextAuth.js v5 beta with JWT sessions + Credentials provider (`src/lib/auth.ts`). Roles: ADMIN, CUSTOMER
- **Email:** Nodemailer (SMTP via env vars). Templates in `src/lib/email/templates.ts`, triggers in `src/lib/email/trigger.ts`
- **Styling:** Tailwind CSS v4. Custom palette: navy, cream, blush, mauve. Fonts: Poppins (body), Lora (accents)
- **Icons:** FontAwesome (solid, regular, brands)

## Build & Dev

```bash
npm run dev        # Start dev server
npm run build      # Production build
npx prisma db push # Push schema changes
npx prisma studio  # Database GUI
```

## Data Architecture

**Hybrid static + database approach:**
- Products and services are defined as static TypeScript objects in `src/lib/data.ts` (not in DB)
- Stock levels, orders, users, bookings, reviews, blog posts, discounts are all in PostgreSQL
- Reviews combine static seed reviews (from `data.ts`) with user-submitted DB reviews on product pages

## Project Structure

```
src/
  app/
    (storefront)/     # Customer-facing pages (shop, cart, account, loyalty, etc.)
    admin/            # Admin panel (protected by ADMIN role)
    api/              # API routes
  lib/
    auth.ts           # NextAuth config
    data.ts           # Static product/service/FAQ data
    prisma.ts         # Prisma client singleton
    loyalty-utils.ts  # Tier calculations and benefits
    order-utils.ts    # Order number formatting, product resolution
    AuthContext.tsx    # Auth state, loyalty operations (client)
    BookingContext.tsx # Booking holds and confirmations (client)
    CartContext.tsx    # Cart, wishlist, checkout (client)
    CurrencyContext.tsx # Multi-currency support
    email/
      send.ts         # SMTP transport
      templates.ts    # Email template rendering
      trigger.ts      # Email trigger functions
      layout.ts       # Email HTML layout wrapper
```

## Loyalty Program ("Ritual Credits")

### Tiers (based on lifetime credits)
| Tier | Threshold | Key Benefits |
|------|-----------|-------------|
| Seeker | 0-499 | Base earning, birthday credits, reviews & referrals |
| Keeper | 500-1,499 | 24hr early access to drops, Instagram story recognition |
| Elder | 1,500+ | 72hr early access, 1.5x earn rate, Instagram feed recognition |

### Earning Credits
- **Purchases:** 1 credit per $1 spent
- **Reviews:** 100 credits (must have purchased product, min 100 chars, one per product)
- **Referrals:** 200 credits for referrer when friend completes first purchase; 200 for friend on signup
- **Birthday:** 150 credits, claimable once per year during birthday month
- **Welcome bonus:** 50 credits on account creation

### Redeeming Credits
- 250 credits = $5 off
- 500 credits = $10 off
- Applied at checkout, stacks with discount codes
- Redemption reduces `currentCredits` only (not `lifetimeCredits`, so tier is unaffected)

### Key State (`src/lib/AuthContext.tsx`)
- `currentCredits` / `lifetimeCredits` / `pointsHistory` / `referralCode` / `referralCount`
- `purchasedProducts` / `reviewedProducts` / `birthdayMonth` / `birthdayClaimed`
- `lockedCurrency` (locks after first purchase) / `instagramHandle`

## Reviews System

### Flow
1. Customer purchases product -> product appears in "eligible for review" list
2. Customer submits review (1-5 stars, 100+ char text) via `/account/rewards`
3. Review created with `approved: false`, customer earns 100 credits immediately
4. Admin approves/rejects in `/admin/reviews`, can add response
5. Approved reviews display on product page with "Verified Purchase" badge
6. Name of Reviewer is displayed on product page as First Name Last Initial. (Mary T.)(Henry S.)

### Display
- Product pages (`/shop/[id]`) combine static reviews (owner/seed) + approved DB reviews
- Reviewer names shown as "First Last-Initial" for privacy
- Admin responses shown nested below each review
- Average rating aggregated across both sources via `GET /api/reviews/ratings`

## Admin Panel (`/admin`)

All admin pages require `role: "ADMIN"`. Uses Next.js Server Actions for mutations.

| Section | Path | Features |
|---------|------|----------|
| Dashboard | `/admin` | Monthly orders/revenue, active bookings, pending reviews, low stock alerts |
| Orders | `/admin/orders` | Search, filter by status, update status, tracking numbers, refunds, CSV export |
| Bookings | `/admin/bookings` | Filter by status/date, update status, Google Meet links |
| Users | `/admin/users` | Search, view profiles, adjust credits (with audit trail), delete accounts |
| Inventory | `/admin/inventory` | Per-variation stock levels, adjust/set stock quantities |
| Schedule | `/admin/schedule` | Booking window settings, weekly recurring blocks, date-specific blocks |
| Reviews | `/admin/reviews` | Approve/reject, add admin responses, filter pending/approved |
| Blog | `/admin/blog` | Create/edit/delete posts, 6 categories, featured toggle, sort ordering |
| Discounts | `/admin/discounts` | Create codes (% or fixed), usage limits, per-customer limits, expiry dates |
| Emails | `/admin/emails` | Preview 17 templates, send test emails, customize body/subject, version history |
| Settings | `/admin/settings` | Change admin password |

## Booking System

- Services defined statically in `data.ts` (Tarot Reading, Norse Rune Reading, Combined)
- Holds are client-managed (localStorage) with server validation, 10-minute expiry
- Confirmed bookings stored in DB with Google Calendar integration
- Schedule blocks (recurring weekly + date-specific) control availability
- Admin configures lead time, max range, and max bookings per week

## Cart & Checkout

- Guest cart: localStorage. Logged-in cart: PostgreSQL (merged on login)
- Wishlist: same pattern (localStorage for guests, DB for logged-in)
- Checkout applies credit redemption + discount codes, records purchase, triggers emails
- Multi-currency support (CAD, USD, GBP, AUD, EUR) with currency locking after first purchase

## Email System

17 email templates split into customer and admin notifications:
- **Customer:** order confirmation, shipping, booking confirmation/reminder/cancellation/reschedule, loyalty welcome, birthday, referral, tier upgrade, wishlist back-in-stock
- **Admin:** new order, new booking, booking reminder/cancellation/reschedule, Instagram handle submission

Templates support variable placeholders (`{{firstName}}`, `{{orderNumber}}`, etc.), admin-customizable overrides with version history, and opt-out preferences per category (loyalty, newsletters).

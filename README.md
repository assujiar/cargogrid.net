<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/c154037a-e8bc-46f4-8946-30eee9695e60

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set Supabase and optional SMTP keys in Vercel Environment Variables, mirroring `.env.example` for local `.env.local` development
3. Run the app:
   `npm run dev`

## Email blasting (admin portal → "Email Blasting")

Marketing campaigns sent over the same SMTP mailbox as the transactional mail,
throttled to a fixed number of messages per hour.

**How a send actually works.** Pressing send does not send anything. It calls
`queue_email_campaign()`, which writes one row per recipient with its own
`scheduled_for`, spread at the campaign's rate — 25/hour means one message every
2m24s, not 25 at the top of the hour. A worker then drains whatever is due.
That indirection is what makes the throttle hold across restarts and redeploys,
and what lets a campaign be paused, resumed or cancelled mid-flight. Closing the
browser does not stop a running campaign.

The rate limit is enforced in `claim_due_email_recipients()` against rows
actually sent in the last 60 minutes, so calling the dispatcher more often
cannot make it send faster — it only shortens how long a due message waits.

**Two limits, not one.** `rate_per_hour` belongs to a campaign; eight campaigns
at 20/hour that overlap would put 160 messages an hour through one authenticated
mailbox, which is how a shared-mailbox provider decides to throttle or suspend
the account — taking the transactional mail down with it. So there is also an
account-wide ceiling in `email_settings.global_rate_per_hour` (default 25) that
the sum has to fit under. It is editable at the top of the campaigns screen.
When campaigns compete for it, the most overdue message wins.

**Setup**

1. Run `supabase_email_marketing_migration.sql` once in the Supabase SQL Editor
   (after `supabase_migration.sql` and `supabase_admin_access.sql`).
2. Mint a dispatcher key and register it:

   ```bash
   openssl rand -hex 32
   ```
   ```sql
   SELECT public.register_email_worker_key('<the string>', 'vercel-cron');
   ```
3. Put the same string in Vercel as `EMAIL_WORKER_SECRET`, then redeploy.
4. Point a scheduler at `POST /api/email/dispatch` with
   `Authorization: Bearer <EMAIL_WORKER_SECRET>`. Any one of these is enough:
   - **Supabase pg_cron** — no plan limits, runs every 5 minutes. The commented
     block at the end of the migration file sets it up.
   - **Vercel Cron** — already declared in `vercel.json`, authenticated with
     Vercel's own `CRON_SECRET`. Note the Hobby plan runs cron only *once a day*.
   - Any external pinger (cron-job.org, GitHub Actions).

   Running more than one is harmless: the database enforces the rate, and an
   advisory lock makes overlapping runs a no-op for the loser.

   Without a scheduler nothing breaks — campaigns just advance only when an
   admin presses "Kirim Batch Sekarang".

**Deliverability.** Every message carries a plain-text alternative,
`List-Unsubscribe` with one-click POST, and a footer unsubscribe link. Hard
bounces and opt-outs go to `email_suppressions`, which is checked at queue time,
so a re-imported CSV cannot resurrect an address that already said no. The
composer's "Cek Spam" button scores the draft and looks up the sending domain's
SPF, DKIM and DMARC records — those three matter more than every content rule
combined.

**Reading the tracker honestly.** Open rate under-reports: Gmail and Apple Mail
Privacy Protection strip or proxy the pixel, and proxy prefetches record opens
nobody performed. Clicks are the reliable metric. Bounce figures cover
rejections during the SMTP conversation; a mailbox that accepts and bounces
asynchronously is only counted if a DSN is forwarded to `POST /api/email/bounce`
(same bearer secret as the dispatcher).

**Testing.**

```bash
npm run test:email   # rendering, merge-tag escaping, spam scoring, CSV import
```

## Analytics & visitor tracking

GA4 and Google Tag Manager are wired to Google Consent Mode v2. Both are opt-in
per deployment: with `NEXT_PUBLIC_GA_MEASUREMENT_ID` and `NEXT_PUBLIC_GTM_ID`
unset, no Google script is injected at all, so local dev and previews never
reach production reporting.

**Setup**

1. Set `NEXT_PUBLIC_GA_MEASUREMENT_ID` (and optionally `NEXT_PUBLIC_GTM_ID`) in
   Vercel — see `.env.example` for what each one does and how they interact.
2. Run `supabase_ga_tracking_migration.sql` once in the Supabase SQL Editor to
   add the attribution columns and update `create_inquiry()`. A project created
   fresh from `supabase_migration.sql` already has them.
3. In GA4, mark `generate_lead` as a key event.

**How consent works.** The tag boots denied-by-default from an inline script at
the top of `<body>` (`CONSENT_BOOTSTRAP_SCRIPT` in `src/lib/gtag.ts`) — it has
to run before gtag.js, or cookies are written before the visitor has chosen. A
visitor who declines is still measured, cookielessly and without identifiers.
Consent can be withdrawn any time via "Preferensi Cookie" in the footer.

**Events sent:** `page_view` (SPA-aware), `scroll_depth` (25/50/75/90),
`cta_click`, `contact_click` (whatsapp/email/phone), outbound `click`,
`form_start`, `generate_lead`, `consent_update`. When GTM is enabled each is
mirrored as a `cg_`-prefixed dataLayer event for ad pixels to trigger on.

**No PII ever goes to Google** — only qualification enums. The GA4 client ID is
stored beside the lead in Supabase (when analytics consent was granted), which
is what joins a submitted form back to the campaign and pages that produced it.

**Testing.** Against a production build (the consent bootstrap is
server-rendered, so `next dev` is not representative):

```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-TEST NEXT_PUBLIC_GTM_ID=GTM-TEST npm run build
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-TEST NEXT_PUBLIC_GTM_ID=GTM-TEST npx next start -p 3111 &
npm run test:tracking
```

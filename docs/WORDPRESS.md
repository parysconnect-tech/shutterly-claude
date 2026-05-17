# Shutterly ↔ WordPress integration

Shutterly is built to live happily alongside a WordPress site. The bridge plugin is included in this repo at [`wordpress-plugin/shutterly-bridge/`](../wordpress-plugin/shutterly-bridge/).

## What the bridge does

1. **REST ping** — `GET /wp-json/shutterly/v1/ping` lets Shutterly verify the connection.
2. **SSO sync** — on every WP login, POSTs the user to `POST /api/wp/sync-user` so Shutterly has a matching account.
3. **Shortcodes** for embedding:
   - `[shutterly_signup_link]` — pill button to your sign-up page.
   - `[shutterly_course slug="..."]` — course card.
   - `[shutterly_dashboard]` — iframe of `/dashboard` for logged-in users.
4. **Signed server-to-server POSTs** via a shared secret + HMAC (helper: `shutterly_signed_post()`).

## Install (5 minutes)

1. Copy `wordpress-plugin/shutterly-bridge/` into `wp-content/plugins/` of your WP site.
2. In WP admin, **Plugins → Activate** "Shutterly Bridge".
3. **Settings → Shutterly**:
   - Base URL = your Shutterly domain (e.g. `https://learn.shutterly.co.za`).
   - Shared secret = a 32+ character random string. Copy the *same* value into your Shutterly `.env` as `WP_SHARED_SECRET`.
4. Tick **Sync on login**.
5. Confirm: visit `https://your-wp-site.com/wp-json/shutterly/v1/ping` and you should get `{ok: true}`.

## Recommended free WordPress plugins (and what they do)

| Need | Free plugin | What Shutterly uses it for |
|---|---|---|
| Authentication / SSO | [JWT Authentication for WP REST API](https://wordpress.org/plugins/jwt-authentication-for-wp-rest-api/) + Shutterly bridge | WP identity → Shutterly account |
| Multilingual | [Polylang](https://wordpress.org/plugins/polylang/) | EN/AF post slugs that match Shutterly locales |
| Page builder | [Elementor](https://wordpress.org/plugins/elementor/) | Drop the `[shutterly_*]` shortcodes onto any page |
| Forms | [Fluent Forms](https://wordpress.org/plugins/fluentform/) | Lead capture / brief intake |
| Memberships (free) | [Restrict User Access](https://wordpress.org/plugins/restrict-user-access/) | Lock posts to verified students |
| Caching | [LiteSpeed Cache](https://wordpress.org/plugins/litespeed-cache/) or [W3 Total Cache](https://wordpress.org/plugins/w3-total-cache/) | Keep WP fast |
| Security | [Wordfence Security](https://wordpress.org/plugins/wordfence/) | Brute-force protection, file scans |
| Analytics | [Site Kit by Google](https://wordpress.org/plugins/google-site-kit/) | GA4 + Search Console in one |
| SEO | [Rank Math](https://wordpress.org/plugins/seo-by-rank-math/) | Sitemap, meta, schema |
| Image optimisation | [ShortPixel Image Optimizer](https://wordpress.org/plugins/shortpixel-image-optimiser/) | Compress every upload |
| Backup | [UpdraftPlus](https://wordpress.org/plugins/updraftplus/) | Full WP backup to free Google Drive tier |

You do **not** need all of these. Pick what you'll actually use.

## How requests are signed

Server-to-server calls from WordPress to Shutterly are HMAC-signed:

```
X-Shutterly-Timestamp: 1750000000000
X-Shutterly-Signature: hex( hmac_sha256( WP_SHARED_SECRET, timestamp + "." + body ) )
```

Shutterly's `/api/wp/verify` endpoint checks the signature and rejects requests older than five minutes.

## Sending Shutterly events to WordPress

Add this to your Shutterly app to POST a card to a custom WP REST route:

```ts
await fetch(`${process.env.WP_BASE_URL}/wp-json/shutterly/v1/event`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Shutterly-Key': process.env.WP_SHARED_SECRET!
  },
  body: JSON.stringify({ kind: 'badge_awarded', userEmail, badgeSlug })
});
```

The bridge plugin can be extended to handle `/event` and write a WP post, BuddyBoss activity entry, or Slack/Discord webhook.

## Single sign-on flow

```
Browser ──login──▶ WordPress
                     │
                     └─ Shutterly Bridge (wp_login hook)
                          │  POST /api/wp/sync-user  (with X-Shutterly-Key)
                          ▼
                       Shutterly upserts User row, returns id
                     │
WordPress             Browser is then redirected to Shutterly's
shows logged-in    ── signin endpoint with a one-time WP nonce
state on WP side       (advanced — extend the bridge if you need this).
```

For most setups, "Sync on login" is enough. Users sign into Shutterly separately, but their email + role stay in lockstep with WordPress.

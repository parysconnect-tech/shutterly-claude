=== Shutterly Bridge ===
Contributors: shutterly
Tags: photography, learning, lms, elementor, sso, bridge
Requires at least: 6.0
Tested up to: 6.6
Requires PHP: 7.4
Stable tag: 0.1.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Connects your WordPress site to the Shutterly photography learning platform.

== Description ==

Shutterly Bridge lets your WordPress site and your Shutterly install behave like one product:

* Embed course cards, the signup CTA and (optionally) the student dashboard via shortcodes.
* Sync WordPress users into Shutterly automatically on login.
* Expose a tiny REST endpoint (`/wp-json/shutterly/v1/ping`) so Shutterly can verify the connection.
* Sign cross-site requests with a shared secret + HMAC.

== Installation ==

1. Drop the `shutterly-bridge/` folder into `wp-content/plugins/` (or zip and upload via the WP admin).
2. Activate "Shutterly Bridge" in the Plugins screen.
3. Go to **Settings → Shutterly** and paste your Shutterly base URL + shared secret.
4. Tick "Sync on login" if you want WordPress to be the identity provider.

== Shortcodes ==

* `[shutterly_course slug="see-like-a-photographer" title="See Like a Photographer"]`
* `[shutterly_signup_link label="Start the course free"]`
* `[shutterly_dashboard]`

== Changelog ==

= 0.1.0 =
* Initial release: settings page, REST ping, SSO sync, three shortcodes.

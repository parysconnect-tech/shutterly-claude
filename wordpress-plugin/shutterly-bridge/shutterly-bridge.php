<?php
/**
 * Plugin Name:       Shutterly Bridge
 * Plugin URI:        https://shutterly.co.za
 * Description:       Connects your WordPress site to the Shutterly photography learning platform. Adds shortcodes, syncs users on login, and exposes a tiny REST surface for cross-site checks.
 * Version:           0.1.0
 * Requires at least: 6.0
 * Requires PHP:      7.4
 * Author:            Shutterly
 * License:           GPL-2.0-or-later
 * Text Domain:       shutterly
 */

if (!defined('ABSPATH')) {
    exit;
}

define('SHUTTERLY_OPTION_KEY', 'shutterly_settings');

/* -------------------------------------------------------------------------
 * Settings page
 * ------------------------------------------------------------------------- */

add_action('admin_menu', function () {
    add_options_page(
        'Shutterly Bridge',
        'Shutterly',
        'manage_options',
        'shutterly',
        'shutterly_render_settings'
    );
});

add_action('admin_init', function () {
    register_setting('shutterly', SHUTTERLY_OPTION_KEY, [
        'sanitize_callback' => 'shutterly_sanitize_settings',
        'default' => [
            'base_url'      => '',
            'shared_secret' => '',
            'sync_on_login' => 0,
            'default_role'  => 'student'
        ]
    ]);
});

function shutterly_sanitize_settings($input) {
    return [
        'base_url'      => esc_url_raw(trim($input['base_url'] ?? '')),
        'shared_secret' => sanitize_text_field(trim($input['shared_secret'] ?? '')),
        'sync_on_login' => !empty($input['sync_on_login']) ? 1 : 0,
        'default_role'  => sanitize_text_field($input['default_role'] ?? 'student')
    ];
}

function shutterly_settings() {
    $defaults = ['base_url' => '', 'shared_secret' => '', 'sync_on_login' => 0, 'default_role' => 'student'];
    return wp_parse_args(get_option(SHUTTERLY_OPTION_KEY, []), $defaults);
}

function shutterly_render_settings() {
    if (!current_user_can('manage_options')) return;
    $s = shutterly_settings();
    ?>
    <div class="wrap">
        <h1>Shutterly Bridge</h1>
        <p>Connect this WordPress site to your Shutterly install.</p>
        <form method="post" action="options.php">
            <?php settings_fields('shutterly'); ?>
            <table class="form-table" role="presentation">
                <tr>
                    <th scope="row"><label for="shutterly_base_url">Shutterly base URL</label></th>
                    <td><input id="shutterly_base_url" name="<?php echo SHUTTERLY_OPTION_KEY; ?>[base_url]" type="url"
                               value="<?php echo esc_attr($s['base_url']); ?>" class="regular-text"
                               placeholder="https://learn.shutterly.co.za" /></td>
                </tr>
                <tr>
                    <th scope="row"><label for="shutterly_shared_secret">Shared secret</label></th>
                    <td>
                        <input id="shutterly_shared_secret" name="<?php echo SHUTTERLY_OPTION_KEY; ?>[shared_secret]"
                               type="password" value="<?php echo esc_attr($s['shared_secret']); ?>" class="regular-text" />
                        <p class="description">Must match WP_SHARED_SECRET in your Shutterly .env file.</p>
                    </td>
                </tr>
                <tr>
                    <th scope="row">Sync on login</th>
                    <td>
                        <label>
                            <input type="checkbox" name="<?php echo SHUTTERLY_OPTION_KEY; ?>[sync_on_login]"
                                   value="1" <?php checked(1, $s['sync_on_login']); ?> />
                            When a WordPress user logs in, create or update their Shutterly account.
                        </label>
                    </td>
                </tr>
                <tr>
                    <th scope="row">Default role</th>
                    <td>
                        <select name="<?php echo SHUTTERLY_OPTION_KEY; ?>[default_role]">
                            <option value="student" <?php selected('student', $s['default_role']); ?>>Student</option>
                            <option value="instructor" <?php selected('instructor', $s['default_role']); ?>>Instructor</option>
                        </select>
                    </td>
                </tr>
            </table>
            <?php submit_button(); ?>
        </form>

        <h2>Shortcodes</h2>
        <ul>
            <li><code>[shutterly_course slug="see-like-a-photographer"]</code> — embed a course card</li>
            <li><code>[shutterly_dashboard]</code> — embed the student dashboard for the current user</li>
            <li><code>[shutterly_signup_link]</code> — a "Start the course free" button</li>
        </ul>

        <h2>Health</h2>
        <p>Public ping URL: <code><?php echo esc_html(rest_url('shutterly/v1/ping')); ?></code></p>
    </div>
    <?php
}

/* -------------------------------------------------------------------------
 * REST surface
 * ------------------------------------------------------------------------- */

add_action('rest_api_init', function () {
    register_rest_route('shutterly/v1', '/ping', [
        'methods'  => 'GET',
        'permission_callback' => '__return_true',
        'callback' => function () {
            return rest_ensure_response([
                'ok' => true,
                'version' => '0.1.0',
                'site' => get_bloginfo('name')
            ]);
        }
    ]);
});

/* -------------------------------------------------------------------------
 * SSO: sync WordPress user to Shutterly on login.
 * ------------------------------------------------------------------------- */

add_action('wp_login', function ($user_login, $user) {
    $s = shutterly_settings();
    if (empty($s['sync_on_login']) || empty($s['base_url']) || empty($s['shared_secret'])) return;

    $role = 'subscriber';
    if (in_array('administrator', (array) $user->roles, true)) $role = 'administrator';
    elseif (in_array('editor', (array) $user->roles, true)) $role = 'editor';
    elseif (in_array('author', (array) $user->roles, true)) $role = 'author';

    $payload = [
        'wpUserId' => (int) $user->ID,
        'email'    => $user->user_email,
        'name'     => $user->display_name,
        'role'     => $role
    ];

    wp_remote_post(trailingslashit($s['base_url']) . 'api/wp/sync-user', [
        'timeout' => 5,
        'headers' => [
            'Content-Type'    => 'application/json',
            'X-Shutterly-Key' => $s['shared_secret']
        ],
        'body' => wp_json_encode($payload)
    ]);
}, 10, 2);

/* -------------------------------------------------------------------------
 * Shortcodes
 * ------------------------------------------------------------------------- */

add_shortcode('shutterly_signup_link', function ($atts) {
    $s = shutterly_settings();
    $atts = shortcode_atts(['label' => 'Start the course free'], $atts);
    if (empty($s['base_url'])) return '';
    $href = esc_url(trailingslashit($s['base_url']) . 'signup');
    return sprintf(
        '<a class="button button-primary" style="display:inline-block;padding:14px 28px;border-radius:9999px;background:#f57f04;color:#1a0e00;text-decoration:none;font-weight:600" href="%s">%s</a>',
        $href,
        esc_html($atts['label'])
    );
});

add_shortcode('shutterly_course', function ($atts) {
    $s = shutterly_settings();
    $atts = shortcode_atts(['slug' => 'see-like-a-photographer', 'title' => 'See Like a Photographer'], $atts);
    if (empty($s['base_url'])) return '';
    $href = esc_url(trailingslashit($s['base_url']) . 'courses/' . sanitize_title($atts['slug']));
    return sprintf(
        '<a href="%s" style="display:block;padding:24px;border:1px solid #e5e5e5;border-radius:18px;background:#fff;color:#000;text-decoration:none">' .
        '<strong style="font-size:18px">%s</strong><br/><span style="color:#666">Free photography course on Shutterly →</span></a>',
        $href,
        esc_html($atts['title'])
    );
});

add_shortcode('shutterly_dashboard', function () {
    $s = shutterly_settings();
    if (empty($s['base_url'])) return '';
    return sprintf(
        '<iframe src="%s" style="width:100%%;min-height:720px;border:0;border-radius:18px" loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>',
        esc_url(trailingslashit($s['base_url']) . 'dashboard')
    );
});

/* -------------------------------------------------------------------------
 * Helper: signed request (for server-to-server calls).
 * ------------------------------------------------------------------------- */

function shutterly_signed_post($path, $body) {
    $s = shutterly_settings();
    if (empty($s['base_url']) || empty($s['shared_secret'])) {
        return new WP_Error('shutterly_not_configured', 'Shutterly bridge is not configured.');
    }
    $payload = wp_json_encode($body);
    $timestamp = (string) (int) round(microtime(true) * 1000);
    $sig = hash_hmac('sha256', $timestamp . '.' . $payload, $s['shared_secret']);

    return wp_remote_post(trailingslashit($s['base_url']) . ltrim($path, '/'), [
        'timeout' => 8,
        'headers' => [
            'Content-Type'           => 'application/json',
            'X-Shutterly-Timestamp'  => $timestamp,
            'X-Shutterly-Signature'  => $sig
        ],
        'body' => $payload
    ]);
}

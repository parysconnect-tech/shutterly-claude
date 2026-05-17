export default function PrivacyPage() {
  return (
    <article className="container-narrow prose prose-shutterly py-16 max-w-3xl">
      <h1 className="heading-display text-4xl">Privacy policy</h1>
      <p className="text-sm text-muted-fg">Last updated: {new Date().toLocaleDateString('en-ZA')}</p>
      <p>
        This is a starter privacy policy. <strong>Replace it with one that reflects your actual data practices before launch.</strong> If your audience is in South Africa, align with POPIA. If you have any EU/UK visitors, align with GDPR.
      </p>
      <h2>What we collect</h2>
      <ul>
        <li>Your email address and chosen display name.</li>
        <li>The photographs you upload to the platform.</li>
        <li>Lesson and challenge progress (what you've done, when).</li>
        <li>Basic analytics (page views, no personally identifying info).</li>
      </ul>
      <h2>What we do not do</h2>
      <ul>
        <li>We do not sell your data.</li>
        <li>We do not train any AI model on your photographs.</li>
        <li>We do not display advertising.</li>
      </ul>
      <h2>Your rights</h2>
      <p>
        You can request export or deletion of your account by emailing <a href="mailto:hello@shutterly.co.za">hello@shutterly.co.za</a>.
      </p>
    </article>
  );
}

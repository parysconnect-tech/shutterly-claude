export default function TermsPage() {
  return (
    <article className="container-narrow prose prose-shutterly py-16 max-w-3xl">
      <h1 className="heading-display text-4xl">Terms of use</h1>
      <p className="text-sm text-muted-fg">Last updated: {new Date().toLocaleDateString('en-ZA')}</p>
      <p>
        Starter terms — replace before going live.
      </p>
      <h2>What you can do</h2>
      <ul>
        <li>Use Shutterly for free, for personal learning.</li>
        <li>Submit photographs to challenges (you keep the copyright).</li>
        <li>Quote or share course concepts in your own teaching, with credit.</li>
      </ul>
      <h2>What we ask</h2>
      <ul>
        <li>Do not republish lesson copy verbatim without permission.</li>
        <li>Do not upload photographs you do not own the rights to.</li>
        <li>Keep the gallery a kind, photo-first space.</li>
      </ul>
    </article>
  );
}

import { NoteLayout } from '@/components/Site';

export default function Page() {
  return (
    <NoteLayout
      kicker="Notes / Melbourne"
      title="Weekend escapes to the south."
      lede="A second city that keeps pulling me back — Dandenong mornings and St Kilda afternoons."
    >
      <p>Melbourne has become my go-to escape. Just a short flight from Adelaide, but it feels like a different world — bigger, faster, and full of corners worth exploring.</p><h2>Dandenong Ranges</h2><p>In January 2025, I drove up into the Dandenong Ranges. The air gets cooler as you climb, and suddenly you're surrounded by mountain ash and tree ferns. It's the kind of place that makes you forget you were in a city ten minutes ago.</p><img src="/assets/gallery/melbourne-dandenong.jpg" alt="Dandenong Ranges" loading="lazy"/><h2>St Kilda at sunset</h2><p>New Year's Eve 2024 at St Kilda Beach. Not the fireworks-over-the-city kind of celebration — just the pier, the palm trees, and the sky doing its thing. Sometimes that's enough.</p><img src="/assets/gallery/melbourne-stkilda.jpg" alt="St Kilda Beach" loading="lazy"/>
    </NoteLayout>
  );
}

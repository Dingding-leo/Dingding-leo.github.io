import { ArticleImage, NoteLayout } from '@/components/Site';
import { noteMetadata } from '@/config/notes';

export const metadata = noteMetadata('cairns');

export default function Page() {
  return (
    <NoteLayout slug="cairns">
      <p>July 2025. Mid-year break, bags packed, heading to Cairns. The humidity hits you the moment you step off the plane, and suddenly winter feels very far away.</p><h2>Barron Gorge</h2><p>The waterfall was roaring — wet season had been generous. Standing at the lookout, mist on your face, watching water carve through ancient rock. It's the kind of moment that recalibrates your sense of scale.</p><ArticleImage src="/assets/gallery/cairns-barron.jpg" alt="Barron Gorge"/><h2>Great Barrier Reef</h2><p>Out on the reef. The colours underwater don't look real — electric blues, neon corals, fish that seem designed by someone with too much imagination. The reef stretches further than you can comprehend from the surface.</p><ArticleImage src="/assets/gallery/cairns-marina.jpg" alt="Great Barrier Reef"/><p>Three days of tropical air, then back to Adelaide. The kind of trip that carries you through the rest of winter.</p>
    </NoteLayout>
  );
}

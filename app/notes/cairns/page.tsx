import { ArticleImage, NoteLayout } from '@/components/NoteLayout';
import { noteMetadata } from '@/config/notes';

export const metadata = noteMetadata('cairns');

export default function Page() {
  return (
    <NoteLayout slug="cairns">
      <p>
        July 2025. Mid-year break, bags packed, heading north from Adelaide to
        Cairns. Humid air replaced winter as soon as the doors opened.
      </p>
      <h2>Barron Gorge</h2>
      <p>
        Water filled the gorge below the lookout, throwing mist back across
        dark rock. It was a landscape measured by flow and scale.
      </p>
      <ArticleImage
        src="/assets/gallery/cairns-barron.jpg"
        alt="Water rushing through dark rock and rainforest at Barron Gorge"
      />
      <h2>Great Barrier Reef</h2>
      <p>
        Out on the reef, electric blues, coral forms, and passing fish replaced
        the horizon visible from shore.
      </p>
      <ArticleImage
        src="/assets/gallery/cairns-marina.jpg"
        alt="Fish and coral visible beneath blue water on the Great Barrier Reef"
      />
      <p>Three tropical days, then back to Adelaide and winter.</p>
    </NoteLayout>
  );
}

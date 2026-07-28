import { ArticleImage, NoteLayout } from '@/components/NoteLayout';
import { noteMetadata } from '@/config/notes';

export const metadata = noteMetadata('melbourne');

export default function Page() {
  return (
    <NoteLayout slug="melbourne">
      <p>
        Melbourne has become a familiar escape from Adelaide: a faster city
        with quiet landscapes waiting beyond its streets.
      </p>
      <h2>Dandenong Ranges</h2>
      <p>
        In January 2025, I drove into the Dandenong Ranges. The air cooled as
        mountain ash and tree ferns closed around the road.
      </p>
      <ArticleImage
        src="/assets/gallery/melbourne-dandenong.jpg"
        alt="Mountain ash and tree ferns in the Dandenong Ranges"
      />
      <h2>St Kilda at sunset</h2>
      <p>
        New Year&apos;s Eve 2024 at St Kilda Beach: the pier, palm trees, and
        the last colour holding above the water.
      </p>
      <ArticleImage
        src="/assets/gallery/melbourne-stkilda.jpg"
        alt="St Kilda pier and palm trees beneath a New Year's Eve sunset"
        thumbWidth={600}
        fullWidth={1440}
        fullHeight={1920}
      />
    </NoteLayout>
  );
}

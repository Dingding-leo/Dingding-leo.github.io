import {
  ArticleFigure,
  FieldNote,
  NoteLayout,
} from '@/components/NoteLayout';
import { noteMetadata } from '@/config/notes';

export const metadata = noteMetadata('melbourne');

export default function Page() {
  return (
    <NoteLayout slug="melbourne">
      <p>
        Melbourne has become a familiar escape from Adelaide: a faster city
        with quieter landscapes beyond its streets. These two frames sit at
        different edges of that experience—one above the suburbs in the
        Dandenong Ranges, the other close to a single figure beside the water at
        St Kilda.
      </p>
      <h2>Above the city</h2>
      <p>
        In January 2025, the camera looked out through gum trees toward the
        suburbs below. A narrow track drops through the foreground; warm light
        catches grass and trunks on the right; the distance fades into a pale
        haze. The view is expansive, but the trees keep it framed.
      </p>
      <ArticleFigure
        src="/assets/gallery/melbourne-dandenong.jpg"
        alt="A sunlit track and gum trees above distant suburbs in the Dandenong Ranges"
        caption="Dandenong Ranges, January 2025 — late light above the suburbs."
      />
      <FieldNote>
        The first photograph looks outward across distance. The second stays
        close, letting one figure hold the frame.
      </FieldNote>
      <h2>St Kilda at sunset</h2>
      <p>
        On New Year&apos;s Eve 2024, a person in a red-and-black hood stands at
        the right edge, looking upward beside the water. Behind them, shallow
        waves cross the beach while a low pier, marina masts, and small lamps
        gather along the horizon. The human figure—not the skyline—is what
        gives the evening its centre.
      </p>
      <ArticleFigure
        src="/assets/gallery/melbourne-stkilda.jpg"
        alt="A person in a red-and-black hood beside the water at St Kilda, with marina lights beyond"
        caption="St Kilda, New Year’s Eve 2024 — a close figure against water and marina light."
        thumbWidth={600}
        fullWidth={1440}
        fullHeight={1920}
      />
      <p>
        One view is organised by depth; the other by presence. That contrast,
        more than a checklist of places, is the pair of moods in the title.
      </p>
    </NoteLayout>
  );
}

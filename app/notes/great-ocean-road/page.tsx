import {
  ArticleFigure,
  FieldNote,
  NoteLayout,
} from '@/components/NoteLayout';
import { noteMetadata } from '@/config/notes';

export const metadata = noteMetadata('great-ocean-road');

export default function Page() {
  return (
    <NoteLayout slug="great-ocean-road">
      <p>
        December 22, 2024. Summer break, a full tank of petrol, and the Great
        Ocean Road stretching ahead. The two photographs kept here avoid a
        complete itinerary. They record the coast through shape and weather:
        layered limestone first, then an open horizon farther along.
      </p>
      <h2>Limestone at the water&apos;s edge</h2>
      <p>
        The first frame is built in horizontal layers. Eroded gold rock crosses
        the foreground; larger cliffs and offshore stacks sit beyond it; a low
        strip of Southern Ocean separates the stone from a sky that occupies
        most of the image. Repetition, rather than one named landmark, gives the
        coast its scale.
      </p>
      <ArticleFigure
        src="/assets/gallery/great-ocean-road.jpg"
        alt="Layered limestone cliffs and offshore stacks beneath broken cloud along the Great Ocean Road"
        caption="Great Ocean Road, December 2024 — weathered limestone repeated toward the water."
      />
      <FieldNote>
        In both photographs, the sky is larger than the landmark. Weather
        supplies the continuity between separate stops.
      </FieldNote>
      <h2>The horizon farther on</h2>
      <p>
        The second image removes almost all of that texture. A dark cloud bank
        lowers over pale blue water, with a brighter opening near the horizon
        and coastal scrub forming a narrow foreground edge. After the dense
        limestone, the emptier composition lets distance become the subject.
      </p>
      <ArticleFigure
        src="/assets/gallery/gor-otway.jpg"
        alt="A grey cloud bank over the ocean, framed by coastal scrub along the Great Ocean Road"
        caption="Farther along the coast — cloud, water, and a thin line of scrub."
      />
      <p>
        One road produced two different ways of measuring the same coast:
        through the accumulated detail of rock, and through the spare geometry
        of a horizon.
      </p>
    </NoteLayout>
  );
}

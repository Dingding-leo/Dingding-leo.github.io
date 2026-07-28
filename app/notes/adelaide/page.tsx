import {
  ArticleFigure,
  FieldNote,
  NoteLayout,
} from '@/components/NoteLayout';
import { noteMetadata } from '@/config/notes';

export const metadata = noteMetadata('adelaide');

export default function Page() {
  return (
    <NoteLayout slug="adelaide">
      <p>
        Adelaide is where I landed and where I&apos;m learning to call home.
        These two photographs do not try to summarise the city. One looks up
        into a public celebration; the other looks down into a rocky gorge on a
        study break.
      </p>
      <h2>Fireworks over Adelaide</h2>
      <p>
        On New Year&apos;s Eve 2023, I framed the sky rather than the River
        Torrens itself. Orange fireworks open against deep navy; smoke catches
        stray red sparks; a row of street lamps remains at the lower edge. The
        bridge and skyline sit outside the picture, leaving light and haze to
        carry the event.
      </p>
      <ArticleFigure
        src="/assets/gallery/adelaide-riverbank.jpg"
        alt="Orange fireworks and smoke above Adelaide on New Year's Eve 2023"
        caption="New Year’s Eve, 2023 — the riverbank remembered through what happened above it."
        fullWidth={1919}
        fullHeight={1080}
      />
      <FieldNote>
        The riverbank is outside the frame. The smoke, lamps, and deep-blue sky
        are enough to locate the night.
      </FieldNote>
      <h2>Morialta on a study break</h2>
      <p>
        Morialta changes the scale in the opposite direction. The camera looks
        steeply down across pale, fractured rock toward three hikers beside a
        small cascade. Dark water traces the stone below them, while dry scrub
        and grass trees fill the higher ground. The people are small, but they
        give the gorge its measure.
      </p>
      <ArticleFigure
        src="/assets/gallery/adelaide-morialta.jpg"
        alt="Three hikers standing on rock below a small cascade in Morialta Conservation Park"
        caption="Morialta Conservation Park — rock, water, and three figures for scale."
      />
      <p>
        Placed together, the pictures hold two versions of home: a city night
        made almost abstract by light, and a nearby landscape made legible by
        human scale. Both reward looking a little longer.
      </p>
    </NoteLayout>
  );
}

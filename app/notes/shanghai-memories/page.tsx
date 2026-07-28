import {
  ArticleFigure,
  FieldNote,
  NoteLayout,
} from '@/components/NoteLayout';
import { noteMetadata } from '@/config/notes';

export const metadata = noteMetadata('shanghai-memories');

export default function Page() {
  return (
    <NoteLayout slug="shanghai-memories">
      <p>
        July 2024. This note is deliberately narrow. It does not try to turn one
        photograph into a complete portrait of Shanghai; it keeps a single,
        theatrical frame from Shanghai Disney Resort and lets its visible
        details carry the memory.
      </p>
      <h2>A stage in full colour</h2>
      <p>
        A costumed performer in red stands near the centre beneath a grid of
        magenta, blue, and white lamps. Oversized animal silhouettes rise along
        both sides: a tall giraffe and elephants on the left, a bright cropped
        face on the right. Between them, a pale stage screen creates a quiet
        field around the performer.
      </p>
      <ArticleFigure
        src="/assets/gallery/shanghai-disney.jpg"
        alt="A costumed performer in red beneath magenta and blue stage lights at Shanghai Disney Resort"
        caption="Shanghai Disney Resort, July 2024 — one performer held inside a frame of colour and scale."
        fullHeight={1080}
      />
      <FieldNote>
        This is not a city overview. It is one bright fragment, kept at the
        scale the photograph can honestly support.
      </FieldNote>
      <p>
        The composition works because the stage is busy without losing its
        centre. Dark rigging and speakers collect near the ceiling, saturated
        figures press in from the edges, and the performer remains isolated
        against the lightest surface. The picture moves from shadow to colour
        and then to the single figure.
      </p>
      <p>
        A trip contains more than any one image can prove. This page keeps the
        scale honest: not all of Shanghai, just a vivid July moment that was
        worth returning to.
      </p>
    </NoteLayout>
  );
}

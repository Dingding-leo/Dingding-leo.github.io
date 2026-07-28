import {
  ArticleFigure,
  FieldNote,
  NoteLayout,
} from '@/components/NoteLayout';
import { noteMetadata } from '@/config/notes';

export const metadata = noteMetadata('sydney');

export default function Page() {
  return (
    <NoteLayout slug="sydney">
      <p>
        October 2022. I had recently arrived in Australia, and Sydney was one of
        my first big trips. The photographs move through three kinds of built
        and natural space: a modern university facade, the shells of the Opera
        House, and the low horizon of Kamay Botany Bay.
      </p>
      <h2>University of Sydney</h2>
      <p>
        My campus frame is not the sandstone quadrangle usually associated with
        the university. It looks up at a modern facade of glass, dark panels,
        and horizontal metal fins. Trees soften the edges, while the words
        “The University of Sydney” anchor the building at ground level.
      </p>
      <ArticleFigure
        src="/assets/gallery/sydney-usyd.jpg"
        alt="A modern glass and metal building at the University of Sydney"
        caption="University of Sydney, October 2022 — a modern facade recorded in lines and layers."
      />
      <FieldNote>
        The campus photograph is a useful correction: the place in front of the
        camera matters more than the landmark image expected in advance.
      </FieldNote>
      <h2>Opera House beneath cloud</h2>
      <p>
        At the harbour, the Opera House is seen from close to its broad steps.
        White tiled shells rise into a heavy grey sky, their dark undersides
        turning the familiar silhouette into a sequence of sharp openings.
        People scattered across the steps provide the scale.
      </p>
      <ArticleFigure
        src="/assets/gallery/sydney-opera.jpg"
        alt="The white shells of the Sydney Opera House beneath a heavy grey sky"
        caption="Sydney Opera House — familiar geometry made heavier by the weather above it."
      />
      <h2>Kamay Botany Bay</h2>
      <p>
        At Kamay Botany Bay, the composition becomes lower and quieter. Wet
        green leaves fill the foreground, grey water takes most of the frame,
        and a low built structure sits on the left beneath a grassed roof. A
        dark headland closes the far side of the bay.
      </p>
      <ArticleFigure
        src="/assets/gallery/sydney-botany.jpg"
        alt="Grey water, a low coastal structure, and a distant headland at Kamay Botany Bay"
        caption="Kamay Botany Bay — water and headland replacing the vertical lines of the city."
      />
      <p>
        The three frames move from vertical facade, to sculptural landmark, to
        open water. Together they remain an early chapter in a country I am
        still learning to call home.
      </p>
    </NoteLayout>
  );
}

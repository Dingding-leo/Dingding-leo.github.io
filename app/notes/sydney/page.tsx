import { ArticleImage, NoteLayout } from '@/components/NoteLayout';
import { noteMetadata } from '@/config/notes';

export const metadata = noteMetadata('sydney');

export default function Page() {
  return (
    <NoteLayout slug="sydney">
      <p>
        October 2022. I had recently arrived in Australia, and Sydney was one of
        my first big trips: new light, sandstone architecture, and the scale of
        the harbour.
      </p>
      <h2>University of Sydney</h2>
      <p>
        The quadrangle at USyd held sandstone, ivy, and cloisters in the same
        frame. It felt older and quieter than the city around it.
      </p>
      <ArticleImage
        src="/assets/gallery/sydney-usyd.jpg"
        alt="Sandstone arches and ivy around the University of Sydney quadrangle"
      />
      <h2>Kamay Botany Bay</h2>
      <p>
        Toward the coast, the city gave way to sandstone cliffs and a wider
        horizon. I stopped there to watch the water.
      </p>
      <ArticleImage
        src="/assets/gallery/sydney-botany.jpg"
        alt="Sandstone coast and open water at Kamay Botany Bay"
      />
      <p>
        The trip remains an early chapter in a country I am still learning to
        call home.
      </p>
    </NoteLayout>
  );
}

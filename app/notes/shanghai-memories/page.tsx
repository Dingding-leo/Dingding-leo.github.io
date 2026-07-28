import { ArticleImage, NoteLayout } from '@/components/NoteLayout';
import { noteMetadata } from '@/config/notes';

export const metadata = noteMetadata('shanghai-memories');

export default function Page() {
  return (
    <NoteLayout slug="shanghai-memories">
      <p>
        July 2024. Shanghai moved quickly from one frame to the next: a castle
        at dusk, narrow streets after dark, and food stalls between them.
      </p>
      <h2>Shanghai Disney Resort</h2>
      <p>
        As daylight left the park, the castle lights appeared against the blue
        sky. Crowds and music filled the foreground while the towers held the
        centre of the frame.
      </p>
      <ArticleImage
        src="/assets/gallery/shanghai-disney.jpg"
        alt="Shanghai Disney castle illuminated against the evening sky"
        fullHeight={1080}
      />
      <p>
        Away from the landmark, the memory becomes smaller: narrow streets,
        food stalls, and the continuous sound of the city. That contrast is the
        Shanghai I kept.
      </p>
    </NoteLayout>
  );
}

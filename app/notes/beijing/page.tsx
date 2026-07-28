import { ArticleImage, NoteLayout } from '@/components/NoteLayout';
import { noteMetadata } from '@/config/notes';

export const metadata = noteMetadata('beijing');

export default function Page() {
  return (
    <NoteLayout slug="beijing">
      <p>
        July 2024. After Shanghai, I took the train to Beijing for two tightly
        packed days.
      </p>
      <h2>Universal Beijing Resort</h2>
      <p>
        July 9 moved through the Wizarding World, Jurassic Park, and Kung Fu
        Panda. Each gate replaced the last scene with another carefully built
        world.
      </p>
      <ArticleImage
        src="/assets/gallery/beijing-universal.jpg"
        alt="Colourful themed buildings and visitors at Universal Beijing Resort"
      />
      <h2>Tiananmen Square</h2>
      <p>
        The next evening, Tiananmen Square opened into a much wider frame. The
        distance between its buildings and the people crossing the square made
        its scale visible.
      </p>
      <ArticleImage
        src="/assets/gallery/beijing-tiananmen.jpg"
        alt="Tiananmen Square and its illuminated buildings at dusk"
      />
      <p>Two days could only be an introduction. 下次再来吧。</p>
    </NoteLayout>
  );
}

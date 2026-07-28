import { ArticleImage, NoteLayout } from '@/components/NoteLayout';
import { noteMetadata } from '@/config/notes';

export const metadata = noteMetadata('great-ocean-road');

export default function Page() {
  return (
    <NoteLayout slug="great-ocean-road">
      <p>
        December 22, 2024. Summer break, a full tank of petrol, and the Great
        Ocean Road stretching ahead.
      </p>
      <h2>The Twelve Apostles</h2>
      <p>
        At Port Campbell National Park, the wind pressed in from the Southern
        Ocean while the limestone stacks held their place offshore. The scene
        felt quieter and larger than its familiar photographs.
      </p>
      <ArticleImage
        src="/assets/gallery/great-ocean-road.jpg"
        alt="Limestone stacks rising from the Southern Ocean at the Twelve Apostles"
      />
      <h2>Great Otway National Park</h2>
      <p>
        Further inland, the landscape shifts. The Otway rainforest is dense and
        cool: tree ferns, ancient myrtle beech, and damp earth replacing the
        exposed coast.
      </p>
      <ArticleImage
        src="/assets/gallery/gor-otway.jpg"
        alt="Tree ferns and dense green forest in Great Otway National Park"
      />
      <p>One road, with limestone and salt on one side and rainforest on the other.</p>
    </NoteLayout>
  );
}

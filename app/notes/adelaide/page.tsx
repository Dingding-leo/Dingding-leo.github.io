import { ArticleImage, NoteLayout } from '@/components/Site';
import { noteMetadata } from '@/config/notes';

export const metadata = noteMetadata('adelaide');

export default function Page() {
  return (
    <NoteLayout slug="adelaide">
      <p>Adelaide is where I landed and where I'm learning to call home. It's a city that doesn't shout — it asks you to slow down enough to notice the small things.</p><h2>The riverbank at golden hour</h2><p>The Riverbank Pedestrian Bridge on New Year's Eve 2023. The light hit the water just right — city skyline on one side, the Torrens on the other. One of those evenings where you don't need a reason to stay a little longer.</p><ArticleImage src="/assets/gallery/adelaide-riverbank.jpg" alt="Adelaide Riverbank"/><h2>Morialta on a study break</h2><p>When the books get heavy, Morialta Conservation Park is 20 minutes away. The waterfalls, the rock faces, the trail that winds up through the gorge — it's the kind of reset that makes the rest of the week feel manageable.</p><ArticleImage src="/assets/gallery/adelaide-morialta.jpg" alt="Morialta Conservation Park"/>
    </NoteLayout>
  );
}

import { ArticleImage, NoteLayout } from '@/components/NoteLayout';
import { noteMetadata } from '@/config/notes';

export const metadata = noteMetadata('adelaide');

export default function Page() {
  return (
    <NoteLayout slug="adelaide">
      <p>
        Adelaide is where I landed and where I&apos;m learning to call home. It
        is a city that leaves enough quiet to notice the small things.
      </p>
      <h2>The riverbank at golden hour</h2>
      <p>
        The Riverbank Pedestrian Bridge on New Year&apos;s Eve 2023. The light
        reached across the water, with the skyline on one side and the Torrens
        on the other. I stayed a little longer.
      </p>
      <ArticleImage
        src="/assets/gallery/adelaide-riverbank.jpg"
        alt="Golden light over the River Torrens beside Adelaide's riverbank footbridge"
        fullWidth={1919}
        fullHeight={1080}
      />
      <h2>Morialta on a study break</h2>
      <p>
        When the books get heavy, a walk through Morialta changes the scale of
        the day: waterfalls, rock faces, and a trail winding into the gorge.
      </p>
      <ArticleImage
        src="/assets/gallery/adelaide-morialta.jpg"
        alt="Rock faces and a waterfall along a trail in Morialta Conservation Park"
      />
    </NoteLayout>
  );
}

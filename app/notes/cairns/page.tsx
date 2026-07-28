import {
  ArticleFigure,
  FieldNote,
  NoteLayout,
} from '@/components/NoteLayout';
import { noteMetadata } from '@/config/notes';

export const metadata = noteMetadata('cairns');

export default function Page() {
  return (
    <NoteLayout slug="cairns">
      <p>
        July 2025. Mid-year break, bags packed, heading north from Adelaide to
        Cairns. Humid air replaced winter as soon as the doors opened. Two
        photographs carry most of the trip now: a rainforest gorge viewed from
        above, then reef water with no land or horizon left in sight.
      </p>
      <h2>Barron Gorge</h2>
      <p>
        From the lookout, the gorge was larger than the water moving through
        it. A narrow fall traces exposed pale rock while rainforest fills both
        sides, and a low branch closes the top of the frame. The small scale of
        the cascade makes the rock walls feel steeper rather than less
        significant.
      </p>
      <ArticleFigure
        src="/assets/gallery/cairns-barron.jpg"
        alt="A narrow waterfall crossing exposed rock in the rainforest at Barron Gorge"
        caption="Barron Gorge — a narrow line of water inside a much larger rainforest frame."
      />
      <FieldNote>
        In the first photograph, water is the smallest element. In the second,
        it becomes the entire field of view.
      </FieldNote>
      <h2>Great Barrier Reef</h2>
      <p>
        Underwater, the picture softens. A striped fish holds near the right
        edge, a darker fish passes closer to the reef, and coral forms dissolve
        into blue toward the distance. There is no clean skyline to divide the
        image; depth arrives through fading colour and the changing clarity of
        each shape.
      </p>
      <ArticleFigure
        src="/assets/gallery/cairns-marina.jpg"
        alt="Fish and coral visible beneath blue water on the Great Barrier Reef"
        caption="Great Barrier Reef — fish, coral, and distance measured through blue water."
      />
      <p>
        The two frames reverse each other: first I looked down into a gorge;
        then the camera looked outward through water. Three tropical days, then
        back to Adelaide and winter.
      </p>
    </NoteLayout>
  );
}

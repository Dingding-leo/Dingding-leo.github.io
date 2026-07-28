import {
  ArticleFigure,
  FieldNote,
  NoteLayout,
} from '@/components/NoteLayout';
import { noteMetadata } from '@/config/notes';

export const metadata = noteMetadata('beijing');

export default function Page() {
  return (
    <NoteLayout slug="beijing">
      <p>
        July 2024. After Shanghai, I took the train to Beijing for two tightly
        packed days. The photographs that remain come from the end of each day:
        one across dark water inside a constructed world, the other from behind
        a crowd facing a much larger public space.
      </p>
      <h2>Universal Beijing Resort</h2>
      <p>
        July 9 moved through the Wizarding World, Jurassic Park, and Kung Fu
        Panda. By night, illuminated facades, an arched bridge, and a line of
        globe lamps gathered along the water. Their reflections break into gold
        and blue strokes, making the park look less like a single attraction
        than a compact city assembled for the evening.
      </p>
      <ArticleFigure
        src="/assets/gallery/beijing-universal.jpg"
        alt="Illuminated park buildings and an arched bridge reflected in water at Universal Beijing Resort"
        caption="Universal Beijing Resort, July 9 — architecture and lamplight doubled by the water."
      />
      <FieldNote>
        Both frames depend on repetition: lamps across the park, then lamps and
        people receding across the square.
      </FieldNote>
      <h2>Tiananmen Square</h2>
      <p>
        The following evening, the camera stood behind a dense crowd waiting at
        barriers. Beyond them, repeating lamps recede toward the square while a
        flagpole cuts through a blue-grey sky. The open ground is visible only
        in bands between people, railings, and distant buildings; that layering
        is what makes the scale apparent.
      </p>
      <ArticleFigure
        src="/assets/gallery/beijing-tiananmen.jpg"
        alt="A crowd waiting behind barriers beneath lamps at Tiananmen Square after dusk"
        caption="Tiananmen Square, the following evening — a wide space seen from within the queue."
      />
      <p>
        One evening was designed to compress many worlds into a few streets;
        the next made distance impossible to ignore. Two days could only be an
        introduction. 下次再来吧。
      </p>
    </NoteLayout>
  );
}

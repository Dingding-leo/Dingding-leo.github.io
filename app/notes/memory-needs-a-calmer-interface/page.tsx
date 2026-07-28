import {
  FieldNote,
  NoteLayout,
  ProjectArticleFigure,
} from '@/components/NoteLayout';
import { noteMetadata } from '@/config/notes';

const slug = 'memory-needs-a-calmer-interface';

export const metadata = noteMetadata(slug);

export default function Page() {
  return (
    <NoteLayout slug={slug}>
      <p>
        I began Denki with a small frustration: spaced repetition can be an
        extraordinarily thoughtful way to learn, yet using it can still feel
        like managing another inbox. Anki proved the value of the method and
        remains an important tool; I was not interested in pretending otherwise.
        I wanted to explore a different interface around the same serious work:
        quieter, more legible, and less eager to turn every review into a
        performance metric.
      </p>
      <p>
        The name is simply Denki. It is a general-purpose learning tool, not a
        Japanese-language product and has no language or cultural affiliation.
        What matters to me is the idea behind it: a calm,
        local-first studio where cards, notes, and the rhythm of returning to
        material can sit together.
      </p>

      <ProjectArticleFigure
        artwork="denki"
        alt="An editorial still life of blank study cards arranged beside a glowing review timeline"
        caption="Denki’s editorial artwork — a quiet sequence of cards and intervals, not a literal product screenshot."
      />

      <h2>Calm is part of the system</h2>
      <p>
        A calmer interface is not only a visual preference. Review already asks
        the learner to tolerate uncertainty: Do I know this? How well? When
        should I see it again? If the screen adds clutter, ambiguous controls,
        or constant celebration, it competes with that judgement. Denki instead
        organises material into classes and decks, supports standard and cloze
        cards, renders Markdown, and keeps working space close by. There is an
        on-card scratchpad for a quick diagram or equation, as well as deck-level
        notes for longer observations.
      </p>
      <p>
        Those features are deliberately ordinary. The point is not to invent a
        new ceremony around studying. It is to reduce the distance between
        encountering a question, working through it, and deciding honestly how
        well it was recalled.
      </p>

      <h2>Make the algorithm visible, not theatrical</h2>
      <p>
        Under the surface, Denki implements the FSRS 4.5 scheduling model. Its
        default target retention is 90 percent, and the setting is adjustable.
        The interface asks for confidence on a five-point scale, then maps those
        answers onto FSRS&apos;s four canonical grades: one becomes Again, two
        becomes Hard, three becomes Good, and four or five becomes Easy, with a
        further stability bonus for a perfect five. That translation is a
        product decision, not mathematical decoration; it lets the prompt use
        language that feels natural while keeping the scheduler internally
        consistent.
      </p>
      <p>
        After an answer is revealed, Denki shows the interval each confidence
        choice would produce. Those previews use the learner&apos;s current
        scheduler settings and a fixed, no-fuzz calculation so they remain
        stable on screen rather than shifting between renders. I like this
        balance: the learner can see the consequence of a choice without being
        asked to admire the machinery.
      </p>

      <FieldNote label="Design principle">
        A scheduling model should shape the rhythm of study, but the interface
        should still explain what will happen next.
      </FieldNote>

      <h2>Local-first is a promise with consequences</h2>
      <p>
        Cards, decks, preferences, and review history live in IndexedDB through
        Dexie. There is no required account, hosted database, or analytics
        tracker, and the app is designed to work offline. That keeps the default
        relationship unusually direct: the learner creates the material, and
        the browser stores it.
      </p>
      <p>
        But local-first does not mean magically safe. Browser storage can be
        cleared, a device can fail, and local data does not automatically become
        cross-device sync. Denki asks the browser for persistent-storage
        protection, offers full JSON export and restore, and gently reminds a
        learner to make a backup once a collection is substantial and the last
        export is stale. The restore path also revives date values rather than
        treating them as strings, because that quiet type error could otherwise
        make restored cards disappear from due-date queries. Data safety is not
        a settings-page afterthought; it is part of the product.
      </p>

      <h2>Keep the doors open</h2>
      <p>
        Denki accepts Anki packages and CSV files because a learning tool should
        not demand that someone abandon work already done. Standard and cloze
        material can move in, and an individual deck can move back out as CSV.
        AI card generation is optional rather than structural: the learner
        chooses an OpenAI-compatible provider and supplies their own key. The
        submitted source text goes to that selected provider only when the
        feature is invoked. Without it, the rest of the studio remains useful
        and local.
      </p>
      <p>
        Development has also been openly agent-assisted. The repository contains
        explicit guidance for coding agents: inspect before changing, verify
        with types, tests, and production builds, protect destructive actions,
        and favour maintainable components. Agents accelerated implementation
        and review; they did not remove the need to decide what Denki should
        value or to inspect the result.
      </p>

      <h2>What remains unresolved</h2>
      <p>
        The tradeoffs are real. Local browser storage is private and fast, but
        less convenient than seamless multi-device sync. Importers must cope
        with formats they do not control. A five-point confidence scale gives
        useful nuance, but ultimately compresses into four FSRS grades. Optional
        AI can save setup time, yet generated cards still require editorial
        judgement. And a beautiful study surface cannot rescue weak questions
        or replace the work of retrieval.
      </p>
      <p>
        I think those tensions are healthier when they remain visible. Denki is
        not a promise to make memory effortless. It is an attempt to make the
        effort feel deliberate: fewer distractions, clearer consequences, and
        enough ownership that a learner can understand where their knowledge
        lives and when it will return.
      </p>
    </NoteLayout>
  );
}

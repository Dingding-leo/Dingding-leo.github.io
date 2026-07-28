import {
  FieldNote,
  NoteLayout,
  ProjectArticleFigure,
} from '@/components/NoteLayout';
import { noteMetadata } from '@/config/notes';

const slug = 'no-account-between-me-and-the-board';

export const metadata = noteMetadata(slug);

export default function Page() {
  return (
    <NoteLayout slug={slug}>
      <p>
        KnightClub began with a product question: how much of a serious chess
        studio can live between one player and one board? The answer I am
        pursuing is deliberately local. A game should not need an identity
        service before it can begin, and studying a mistake should not require
        sending that mistake to somebody else&apos;s server.
      </p>

      <h2>The absence is part of the product</h2>
      <p>
        KnightClub has no account, subscription, advertising, telemetry, or
        online multiplayer. It also has no chat, clubs, social feed, public
        rating pool, or live tournament system. Those omissions are not a
        temporary empty state waiting for growth. They define the space: play
        locally, review locally, practise locally, and keep the history on the
        device that created it.
      </p>
      <p>
        That boundary changes the interface. There is no sign-in wall to cross,
        no profile to complete, and no dashboard designed around other
        people&apos;s activity. The useful things can stay close to the board:
        legal click-or-drag play, clocks, local opponents, PGN and FEN transfer,
        completed games, position analysis, progressive full-game review, and
        practice drawn from a player&apos;s own errors.
      </p>

      <ProjectArticleFigure
        artwork="knightclub-editorial"
        alt="A white knight illuminated on a wooden chessboard beside a rain-streaked window"
        caption="An editorial image for KnightClub’s portfolio presentation—not a screenshot of the live interface."
      />

      <FieldNote label="Product boundary">
        Privacy here is not a promise to collect data carefully. The stronger
        choice is to avoid creating an account or telemetry channel in the
        first place.
      </FieldNote>

      <h2>Local does not mean limitless</h2>
      <p>
        Keeping work on-device does not remove the need for limits. In the
        browser, KnightClub uses bounded localStorage rather than pretending it
        is an infinite database. Saved games, completed reviews, training
        prompts, imported files, active sessions, and full-review length all
        have explicit caps. Large histories are opened on demand and handed to
        short-lived workers instead of being parsed every time the board
        appears.
      </p>
      <p>
        The chess engine follows the same rule. The first board paint does not
        start Stockfish. A known legal opening cue or a position with only one
        legal reply can be resolved without it. When browser play or review
        genuinely needs Stockfish 18 Lite, the first use may download roughly
        seven megabytes of WebAssembly; that runtime is then cached for later
        offline use. The download is a real cost, so the interface should not
        quietly pay it before the player asks.
      </p>

      <h2>Keep the engine in its lane</h2>
      <p>
        In the website, Stockfish runs in a dedicated Web Worker, never on the
        React interface thread. Live bot moves are deliberately small searches:
        one thread, 16 MB of hash, and hard time and node ceilings for each
        level. A later request can cancel an older one, and stale results are
        checked against both the request and the exact board position before
        they can change a game. On desktop, a separately installed native
        Stockfish executable sits behind the Tauri command boundary instead.
      </p>
      <p>
        These constraints matter more to me than an impressive depth number.
        An engine that monopolises a laptop, returns into the wrong position,
        or makes the board hesitate is not intelligence serving the player. It
        is simply another system demanding attention. Bounded work makes the
        relationship legible: the board remains the product; Stockfish is a
        tool invited in for a specific job.
      </p>

      <h2>The honest edge of the current build</h2>
      <p>
        KnightClub is still a vertical slice, not the finished version of every
        idea in its product specification. Browser storage can still be cleared
        by the browser, the optional engine needs a network connection on first
        use, and the desktop path asks the player to install Stockfish
        separately. Broader backup and restore, duplicate-game handling,
        indexed opening and position queries, durable cross-restart analysis
        jobs, and deeper tactical proof remain unfinished. Local-first is not
        the same as indestructible, and an offline promise should not hide those
        limits.
      </p>

      <h2>An agent-assisted build, with a visible trail</h2>
      <p>
        Development has been agent-assisted. The repository includes an
        autonomous development directive that asks an agent to inspect the
        existing work, implement one bounded slice at a time, add regression
        tests, run the full verification suite, and record what remains. It
        would be misleading to imply that I manually typed every line. It
        would be equally misleading to treat generated code as finished merely
        because it exists.
      </p>
      <p>
        My responsibility is the product boundary and what is allowed to ship:
        private by default, original rather than imitative, measurable before
        optimisation, defensive around imported data, and honest when analysis
        cannot prove a claim. Tests, architecture notes, change history, and
        the running build provide a more useful account of the work than a
        mythology of solitary authorship.
      </p>

      <h2>Back to the board</h2>
      <p>
        The measure of KnightClub is not how much infrastructure it can place
        around chess. It is how much of that infrastructure can disappear at
        the right moment. If the board opens quickly, the engine waits until it
        is needed, the analysis explains its evidence, and a player can leave
        with their games still in their possession, then the quiet boundary is
        doing its work: no account between me and the board.
      </p>
    </NoteLayout>
  );
}

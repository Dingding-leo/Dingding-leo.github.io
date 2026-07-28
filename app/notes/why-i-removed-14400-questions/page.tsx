import {
  FieldNote,
  NoteLayout,
  ProjectArticleFigure,
} from '@/components/NoteLayout';
import { noteMetadata } from '@/config/notes';

const slug = 'why-i-removed-14400-questions';

export const metadata = noteMetadata(slug);

export default function Page() {
  return (
    <NoteLayout slug={slug}>
      <p>
        At one point, ScholarBank could advertise a catalogue of 15,204
        multiple-choice questions. Fourteen thousand four hundred of them came
        from a deterministic expansion system. The number looked substantial,
        the catalogue could be searched, and the software could verify that
        every record had the fields it needed. I removed that expanded core
        anyway.
      </p>
      <p>
        This was not a technical failure. It was a product decision about what
        a question count is allowed to imply. A large bank suggests variety,
        judgement, and a depth of practice that the number alone cannot prove.
        If I could not defend those implications, keeping the number would make
        the interface more confident than the evidence behind it.
      </p>

      <ProjectArticleFigure
        artwork="scholarbank"
        alt="An editorial illustration of layered ScholarBank practice cards and a circular progress marker"
        caption="An editorial image for ScholarBank’s portfolio presentation—not a screenshot or evidence of learner outcomes."
      />

      <h2>A validator is not a classroom</h2>
      <p>
        Structural validation is useful. ScholarBank&apos;s checks can catch
        duplicate identifiers, malformed options, missing explanations,
        impossible answer indexes, broken classifications, and catalogue totals
        that drift away from the source. They can confirm that a route returns
        the intended question and that protected content is not exposed through
        a public catalogue response. Those are real safeguards.
      </p>
      <p>
        They are not calibration. A passing schema cannot tell me whether a
        question is genuinely easy for one school-year cohort and difficult for
        another. It cannot show that a distractor is plausible, that a passage
        demands the intended skill, or that a timing estimate survives contact
        with learners. Those claims need independent review, pilot
        item-analysis, accessibility and rights checks, versioned evidence, and
        a correction process. Deterministic expansion made consistent records;
        it did not create that evidence.
      </p>

      <FieldNote label="Release rule">
        Code can prove that an item is well formed. It cannot, by itself, prove
        that the item is fair, representative, or calibrated.
      </FieldNote>

      <h2>A smaller number with a clearer boundary</h2>
      <p>
        The current product defines 804 released multiple-choice questions,
        alongside 12 separate, timed writing tasks. I keep the writing tasks
        outside the multiple-choice count because writing is not another answer
        bubble. It needs a prompt, independent composition, and a different
        review ritual. The remaining catalogue is still not an official
        provider paper, a scholarship-outcome guarantee, or an empirically
        calibrated simulation.
      </p>
      <p>
        I also separated two pieces of information that preparation products
        often blur: the student&apos;s current school year and the year they
        hope to enter. The target entry year belongs to planning—school dates,
        provider context, and how far backwards to work. Practice difficulty
        should begin with the learner&apos;s current year. A student planning
        for a later entry does not suddenly acquire the knowledge of that later
        cohort. ScholarBank can remember both facts without pretending they mean
        the same thing.
      </p>

      <h2>Make the learning loop trustworthy</h2>
      <p>
        Removing the expanded catalogue shifted my attention from inventory to
        delivery. Protected questions are delivered through a server-side
        session rather than poured into the browser. The server checks the
        requested scope and access, and correctness is recalculated from the
        canonical bank instead of trusting a score submitted by the client.
      </p>
      <p>
        Feedback is deliberately deferred until the whole set is complete.
        In-progress session reads omit unseen content and answer keys; only a
        completed review can include the worked explanation and reusable
        strategy. That choice protects the bank from being harvested one answer
        at a time, but it also preserves the continuity of an attempt. The
        learner finishes the set before the interface changes from asking to
        teaching.
      </p>

      <h2>Progress without a prediction costume</h2>
      <p>
        I simplified the default progress model as well. One account can begin
        practising and build one history of answers, pace, sessions, and
        streaks without first constructing a family hierarchy or selecting a
        learner profile. The dashboard can use that history to suggest a weaker
        subject or a timed set. That is a practical next step, not a claim to
        know a student&apos;s future.
      </p>
      <p>
        Even the headline practice indicator is rule-based. After enough
        activity for the interface to show it, a fixed formula weights recorded
        accuracy and adds a bounded amount for the size of the evidence base.
        It is not an AI model, percentile estimate, provider score, or
        scholarship prediction. Before 20 answered questions, ScholarBank
        withholds the number and asks for a broader baseline instead. Naming the
        indicator modestly is part of making it honest.
      </p>

      <h2>What I still do not know</h2>
      <p>
        A narrower release does not resolve the hard questions. I do not yet
        have independent evidence that every difficulty label is right, that
        the collection is balanced for real cohorts, or that the recommendations
        improve outcomes. The separate editorial draft pack remains outside the
        learner-facing release until its review gates are satisfied. Billing
        foundations exist in the code, but the current beta should not be
        described as an operating paid service.
      </p>
      <p>
        Removing 14,400 questions made ScholarBank numerically smaller and
        conceptually stronger. The useful question is no longer “How large can
        the bank look?” It is “What can each part of the product truthfully
        claim?” For now, 804 questions, 12 writing tasks, a guarded feedback
        loop, and visible uncertainty are a better answer than five digits of
        unearned confidence.
      </p>
    </NoteLayout>
  );
}

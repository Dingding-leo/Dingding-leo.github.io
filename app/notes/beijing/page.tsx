import { NoteLayout } from '@/components/Site';

export default function Page() {
  return (
    <NoteLayout
      kicker="Notes / Beijing"
      title="A whirlwind 48 hours in the capital."
      lede="Universal Studios by day, Tiananmen by dusk — Beijing doesn't do things halfway."
    >
      <p>July 2024. After Shanghai, I took the train up to Beijing. Two days, zero downtime, and a camera roll full of moments that blurred together in the best way.</p><h2>Universal Beijing Resort</h2><p>On July 9th, we went all in at Universal. The Wizarding World, Jurassic Park, Kung Fu Panda — the scale of it is absurd. Walking through the entrance gates felt like stepping into a movie I'd been watching my whole life.</p><img src="/assets/gallery/beijing-universal.jpg" alt="Universal Beijing Resort" loading="lazy"/><h2>Tiananmen Square</h2><p>The next day, standing in Tiananmen Square as the evening settled in. It's vast in a way that photos can't capture. You stand there and feel small — not in a bad way, just aware of how much history has passed through this exact ground.</p><img src="/assets/gallery/beijing-tiananmen.jpg" alt="Tiananmen Square" loading="lazy"/><p>Two days wasn't enough. But that's Beijing — it gives you just enough to make sure you'll come back. 下次再来吧。</p>
    </NoteLayout>
  );
}

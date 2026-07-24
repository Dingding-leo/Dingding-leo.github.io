import { NoteLayout } from '@/components/Site';

export default function Page() {
  return (
    <NoteLayout
      kicker="Notes / Shanghai"
      title="Magic in the madness."
      lede="Disney by day, streets by night. Shanghai doesn't give you a moment to breathe."
    >
      <p>July 2024. Shanghai was never going to be a quiet trip. The city moves at its own speed, and you either keep up or get swept along. I chose the former.</p><h2>Shanghai Disney Resort</h2><p>The castle at dusk. No matter how old you are, there's something about standing in front of that castle while the lights come on. The crowds, the music, the sheer scale of it — Disney knows how to make you forget the outside world for a few hours.</p><img src="/assets/gallery/shanghai-disney.jpg" alt="Shanghai Disney Resort" loading="lazy"/><p>In between the landmarks, it's the in-between moments that stay: narrow streets, random food stalls, the hum of a city that never really goes quiet. 魔都 is real — equal parts chaos and charm.</p>
    </NoteLayout>
  );
}

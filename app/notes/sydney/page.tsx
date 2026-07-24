import { NoteLayout } from '@/components/Site';

export default function Page() {
  return (
    <NoteLayout
      kicker="Notes / Sydney"
      title="The city that started it all."
      lede="October 2022 — sandstone quadrangles, harbour light, and my first real taste of Australia."
    >
      <p>October 2022. I'd just arrived in Australia, and Sydney was one of my first big trips. Everything felt new — the light, the architecture, the sheer scale of the harbour.</p><h2>University of Sydney</h2><p>Walking through the quadrangle at USyd felt like stepping into another century. Sandstone, ivy, cloisters — the kind of campus that makes you want to study harder just to deserve being there.</p><img src="/assets/gallery/sydney-usyd.jpg" alt="University of Sydney quadrangle" loading="lazy"/><h2>Kamay Botany Bay</h2><p>Out towards the coast, where the city ends and the sandstone cliffs begin. A quieter side of Sydney — fewer people, more horizon. The kind of place that makes you want to just sit and watch the water.</p><img src="/assets/gallery/sydney-botany.jpg" alt="Kamay Botany Bay" loading="lazy"/><p>Looking back now from 2026, that trip feels like the beginning. A first chapter in a country I'm still learning to call home.</p>
    </NoteLayout>
  );
}

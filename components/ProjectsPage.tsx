import { LegacyPageShell } from '@/components/LegacyPages';
import { ProjectDeck } from '@/components/ProjectDeck';
import { projects } from '@/config/site';
import styles from './LegacyPages.module.css';

export function ProjectsPage() {
  return (
    <LegacyPageShell
      kicker="19:43 · The Opening / Projects"
      title="Useful things, built and shipped."
      copy="A growing collection of learning tools, local-first software, and practical experiments shaped by real interests."
      scene="mountain"
      returnHref="/#opening"
    >
      <div className={styles.projectSummary} aria-label="Project summary">
        <span>{projects.length} projects</span>
        <span>
          {projects.filter((project) => project.liveUrl).length} live projects
        </span>
        <span>Built across web and desktop</span>
      </div>
      <ProjectDeck
        className={styles.projectsDeck}
        deckProjects={projects}
        label="Project collection"
      />
    </LegacyPageShell>
  );
}

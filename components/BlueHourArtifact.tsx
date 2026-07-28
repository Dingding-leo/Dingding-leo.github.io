import artifactStyles from './BlueHourArtifact.module.css';
import type { BlueHourScene } from './BlueHourJumpShell';

const artifactDimensions: Record<
  BlueHourScene,
  { width: number; height: number }
> = {
  lighthouse: { width: 420, height: 405 },
  mountain: { width: 420, height: 413 },
  tide: { width: 420, height: 391 },
  waterfall: { width: 403, height: 420 },
  afterlight: { width: 420, height: 419 },
};

export function BlueHourArtifact({
  scene,
  className = '',
  priority = false,
}: {
  scene: BlueHourScene;
  className?: string;
  priority?: boolean;
}) {
  const dimensions = artifactDimensions[scene];

  return (
    <figure
      className={`${artifactStyles.artifact} ${className}`}
      data-scene={scene}
      aria-hidden="true"
    >
      <img
        src={`/assets/artifacts/${scene}-sticker.webp`}
        alt=""
        width={dimensions.width}
        height={dimensions.height}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
      />
    </figure>
  );
}

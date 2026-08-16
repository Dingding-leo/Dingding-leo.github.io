import { BlueHourArtifact } from './BlueHourArtifact';
import styles from './BlueHourJumpShell.module.css';

export type BlueHourScene =
  | 'afterlight'
  | 'tide'
  | 'mountain'
  | 'waterfall'
  | 'lighthouse';

const sceneFocalPoints: Record<
  BlueHourScene,
  { desktop: string; mobile: string }
> = {
  lighthouse: { desktop: '54% 50%', mobile: '59% 50%' },
  mountain: { desktop: '55% 50%', mobile: '69% 50%' },
  tide: { desktop: '54% 50%', mobile: '70% 50%' },
  waterfall: { desktop: '52% 50%', mobile: '62% 50%' },
  afterlight: { desktop: '54% 50%', mobile: '71% 50%' },
};

export function BlueHourPicture({
  scene,
  priority = true,
}: {
  scene: BlueHourScene;
  priority?: boolean;
}) {
  const focalPoint = sceneFocalPoints[scene];

  return (
    <picture
      className={styles.scenePicture}
      data-scene={scene}
      style={
        {
          '--jump-scene-position': focalPoint.desktop,
          '--jump-scene-mobile-position': focalPoint.mobile,
        } as React.CSSProperties
      }
    >
      <source
        type="image/avif"
        srcSet={`/assets/blue-hour/${scene}-720.avif 720w, /assets/blue-hour/${scene}-1200.avif 1200w, /assets/blue-hour/${scene}-1672.avif 1672w`}
        sizes="100vw"
      />
      <source
        type="image/webp"
        srcSet={`/assets/blue-hour/${scene}-720.webp 720w, /assets/blue-hour/${scene}-1200.webp 1200w, /assets/blue-hour/${scene}-1672.webp 1672w`}
        sizes="100vw"
      />
      <img
        src={`/assets/blue-hour/${scene}-1200.jpg`}
        alt=""
        width={1200}
        height={675}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
      />
    </picture>
  );
}

export function BlueHourHero({
  scene,
  kicker,
  title,
  copy,
  meta,
}: {
  scene: BlueHourScene;
  kicker: React.ReactNode;
  title: React.ReactNode;
  copy: React.ReactNode;
  meta?: React.ReactNode;
}) {
  return (
    <section className={styles.hero} data-scene={scene}>
      <BlueHourPicture scene={scene} />
      <span className={styles.sceneMotion} aria-hidden="true" />
      <div className={`container ${styles.heroInner}`}>
        <p className={styles.kicker}>{kicker}</p>
        <h1>{title}</h1>
        <p className={styles.lede}>{copy}</p>
        {meta && <p className={styles.meta}>{meta}</p>}
      </div>
      <BlueHourArtifact
        scene={scene}
        className={styles.heroArtifact}
      />
    </section>
  );
}

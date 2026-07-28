import styles from './BlueHourJumpShell.module.css';

export type BlueHourScene =
  | 'afterlight'
  | 'tide'
  | 'mountain'
  | 'waterfall'
  | 'lighthouse';

export function BlueHourPicture({
  scene,
  priority = true,
}: {
  scene: BlueHourScene;
  priority?: boolean;
}) {
  return (
    <picture className={styles.scenePicture} aria-hidden="true">
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
    <section className={styles.hero}>
      <BlueHourPicture scene={scene} />
      <div className={`container ${styles.heroInner}`}>
        <p className={styles.kicker}>{kicker}</p>
        <h1>{title}</h1>
        <p className={styles.lede}>{copy}</p>
        {meta && <p className={styles.meta}>{meta}</p>}
      </div>
    </section>
  );
}

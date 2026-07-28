import type { Metadata } from 'next';

export function pageMetadata({
  title,
  description,
  image,
  imageAlt,
}: {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
}): Metadata {
  const socialImage = {
    url: image,
    width: 1200,
    height: 675,
    alt: imageAlt,
  };

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      images: [socialImage],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [socialImage],
    },
  };
}

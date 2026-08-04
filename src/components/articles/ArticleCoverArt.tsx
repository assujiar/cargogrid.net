import Image from "next/image";

/**
 * Article cover art.
 *
 * Each article has a hand-made illustration at
 * public/article-illustration/<slug>.png. `object-position: top` because
 * every one of these puts its title and primary subject in the upper
 * portion, with supporting detail panels below — cropping from the top
 * keeps the identifying part of the picture in frame at the shorter sizes.
 */

export default function ArticleCoverArt({ seed, height = 150 }: { seed: string; height?: number }) {
  return (
    <div style={{ position: "relative", width: "100%", height }}>
      <Image
        src={`/article-illustration/${seed}.png`}
        alt=""
        fill
        sizes="(min-width: 1024px) 768px, 100vw"
        style={{ objectFit: "cover", objectPosition: "top" }}
      />
    </div>
  );
}

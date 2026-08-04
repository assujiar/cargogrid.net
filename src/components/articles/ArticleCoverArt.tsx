import Image from "next/image";

/**
 * Article cover art.
 *
 * Each article has a hand-made illustration at
 * public/article-illustration/<slug>.png, natively a 4:3 landscape. The
 * wrapper is sized off that same ratio and the image uses `object-fit:
 * contain`, so the whole illustration always shows — no cropping — at
 * whatever width the caller's layout gives it.
 */

export default function ArticleCoverArt({ seed }: { seed: string }) {
  return (
    <div style={{ position: "relative", width: "100%", aspectRatio: "4 / 3" }}>
      <Image
        src={`/article-illustration/${seed}.png`}
        alt=""
        fill
        sizes="(min-width: 1024px) 768px, 100vw"
        style={{ objectFit: "contain" }}
      />
    </div>
  );
}

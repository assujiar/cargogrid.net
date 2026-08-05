import React from "react";
interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const LOGO_SRC = "/cargogrid_vertical.svg";

export default function Logo({ className = "", size = "md" }: LogoProps) {
  let logoSize = "h-12 w-auto";

  if (size === "sm") {
    logoSize = "h-10 w-auto";
  } else if (size === "lg") {
    logoSize = "h-16 w-auto";
  } else if (size === "xl") {
    logoSize = "h-20 w-auto";
  }

  return (
    // No id here on purpose. The logo renders in both the header and the
    // footer, so a fixed id put two elements with the same id on every page --
    // invalid HTML that breaks in-page anchors and trips accessibility tooling,
    // and invisible until something tries to address one of them.
    <div className={`flex items-center ${className}`} data-cargogrid-logo="">
      <img
        src={LOGO_SRC}
        alt="CargoGrid"
        // Intrinsic ratio of the source SVG's viewBox (300x225). The rendered
        // size still comes from the `h-* w-auto` classes; these attributes only
        // give the browser an aspect ratio to reserve space with before the
        // asset arrives, so the logo never shifts the layout in.
        width={400}
        height={300}
        className={`${logoSize} object-contain`}
        loading="eager"
      />
    </div>
  );
}
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
    <div className={`flex items-center ${className}`} id="cargogrid-logo-wrapper">
      <img
        src={LOGO_SRC}
        alt="CargoGrid"
        className={`${logoSize} object-contain`}
        loading="eager"
      />
    </div>
  );
}
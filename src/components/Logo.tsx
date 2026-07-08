import React from "react";
import cargoGridVerticalLogo from "./cargogrid_vertical.svg";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export default function Logo({ className = "", size = "md" }: LogoProps) {
  const sizeClass = {
    sm: "h-10 w-auto",
    md: "h-12 w-auto",
    lg: "h-16 w-auto",
    xl: "h-20 w-auto"
  }[size];

  return (
    <img
      src={cargoGridVerticalLogo}
      alt="CargoGrid Operating System"
      className={`${sizeClass} ${className}`}
      id="cargogrid-logo-wrapper"
      loading="eager"
    />
  );
}

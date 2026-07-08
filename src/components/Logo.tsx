import React from "react";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export default function Logo({ className = "", size = "md" }: LogoProps) {
  let iconSize = "w-9 h-9";
  let textSize = "text-xl";
  let subtitleSize = "text-[8px]";

  if (size === "sm") {
    iconSize = "w-7 h-7";
    textSize = "text-lg";
    subtitleSize = "text-[7px]";
  } else if (size === "lg") {
    iconSize = "w-11 h-11";
    textSize = "text-2xl";
    subtitleSize = "text-[9px]";
  } else if (size === "xl") {
    iconSize = "w-14 h-14";
    textSize = "text-3xl";
    subtitleSize = "text-[11px]";
  }

  return (
    <div className={`flex items-center gap-2.5 ${className}`} id="cargogrid-logo-wrapper">
      {/* Premium modern logistics isometric cube icon */}
      <div 
        className={`flex items-center justify-center rounded-xl bg-slate-100 shadow-[2px_2px_5px_rgba(0,0,0,0.08),-2px_-2px_5px_rgba(255,255,255,0.9)] border border-white/60 ${iconSize} flex-shrink-0`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-5/6 h-5/6 text-slate-800"
        >
          {/* Outermost Hexagonal isometric grid boundary */}
          <path
            d="M12 2L21 7.2V16.8L12 22L3 16.8V7.2L12 2Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
            className="text-slate-800"
          />
          {/* Inner connector lines forming the 3 cubes of the grid */}
          <path
            d="M12 2V12M12 12L21 7.2M12 12L3 7.2M12 12V22M12 22L3 16.8M12 22L21 16.8"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
            className="text-slate-400"
          />
          {/* Accent block highlighting the core grid intersection (logistics node) */}
          <path
            d="M12 12L16.5 9.6V14.4L12 16.8L7.5 14.4V9.6L12 12Z"
            fill="#ff5e14"
            fillOpacity="0.85"
            stroke="#ff5e14"
            strokeWidth="1"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col text-left leading-none">
        <div className="flex items-baseline font-sans font-black tracking-tight select-none">
          <span className={`${textSize} text-slate-900`}>Cargo</span>
          <span className={`${textSize} text-brand-teal ml-0.5`}>Grid</span>
        </div>
        <span className={`${subtitleSize} font-mono font-black tracking-[0.25em] text-slate-400 uppercase mt-0.5`}>
          Operating System
        </span>
      </div>
    </div>
  );
}

"use client";

import React, { useEffect, useRef, useState } from "react";

/**
 * One shared IntersectionObserver backs every <Reveal>, instead of each
 * instance (and each Framer Motion whileInView) setting up its own. Cards in
 * a grid of a dozen+ items collapse from a dozen observers + a JS animation
 * engine down to one observer + a plain CSS transition per element.
 */
let sharedObserver: IntersectionObserver | null = null;
const visibleCallbacks = new WeakMap<Element, () => void>();

function getSharedObserver(): IntersectionObserver | null {
  if (typeof window === "undefined") return null;
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visibleCallbacks.get(entry.target)?.();
            sharedObserver?.unobserve(entry.target);
            visibleCallbacks.delete(entry.target);
          }
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
    );
  }
  return sharedObserver;
}

interface RevealProps {
  children: React.ReactNode;
  /** Stagger delay in milliseconds, e.g. index * 100 for a grid of cards. */
  delayMs?: number;
  className?: string;
  id?: string;
}

export default function Reveal({ children, delayMs = 0, className = "", id }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = getSharedObserver();
    if (!observer) {
      setVisible(true);
      return;
    }
    visibleCallbacks.set(node, () => setVisible(true));
    observer.observe(node);
    return () => {
      observer.unobserve(node);
      visibleCallbacks.delete(node);
    };
  }, []);

  return (
    <div
      ref={ref}
      id={id}
      className={`reveal ${visible ? "reveal-visible" : ""} ${className}`.trim()}
      style={delayMs ? { transitionDelay: `${delayMs}ms` } : undefined}
    >
      {children}
    </div>
  );
}

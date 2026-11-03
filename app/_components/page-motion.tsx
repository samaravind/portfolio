"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { useProjectTransitionActive } from "./project-transition";

export default function PageMotion() {
  const pathname = usePathname();
  const progress = useRef<HTMLDivElement>(null);
  const scrolling = useRef<Lenis | null>(null);
  const transitioning = useProjectTransitionActive();

  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.085,
      wheelMultiplier: 0.85,
      anchors: true,
      stopInertiaOnNavigate: true,
    });
    scrolling.current = lenis;
    const updateProgress = () => {
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const amount = height > 0 ? Math.min(1, Math.max(0, window.scrollY / height)) : 0;
      if (progress.current) progress.current.style.transform = `scaleX(${amount})`;
    };
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    updateProgress();

    return () => {
      lenis.destroy();
      scrolling.current = null;
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, [pathname]);

  useEffect(() => {
    if (transitioning) scrolling.current?.stop();
    else scrolling.current?.start();
  }, [transitioning, pathname]);

  return <div ref={progress} className="progress" style={{ transform: "scaleX(0)" }} aria-hidden="true" />;
}

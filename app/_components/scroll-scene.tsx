"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Keep scroll depth separate from the inner scene's pointer tilt. */
export default function ScrollScene({ children, enabled = true }: { children: ReactNode; enabled?: boolean }) {
  const scene = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = scene.current;
    const frame = element?.closest(".project-visual");
    if (!enabled || !element || !frame) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false, frameId = 0, previous = 0, current = 0, target = 0;

    const paint = () => {
      element.style.setProperty("--scene-y", `${current * -18}px`);
      element.style.setProperty("--scene-tilt", `${current * -3.5}deg`);
    };
    const animate = (time: number) => {
      const delta = Math.min((time - previous) / 1000, .05);
      previous = time;
      current += (target - current) * (1 - Math.exp(-10 * delta));
      if (Math.abs(target - current) < .0005) current = target;
      paint();
      frameId = current === target ? 0 : requestAnimationFrame(animate);
    };
    const update = () => {
      if (reduced.matches || !visible || document.hidden) {
        cancelAnimationFrame(frameId);
        frameId = 0;
        if (reduced.matches) { current = target = 0; paint(); }
        return;
      }
      // Measure the stationary parent so the transform cannot feed back into itself.
      const bounds = frame.getBoundingClientRect();
      target = Math.max(-1, Math.min(1, (window.innerHeight / 2 - bounds.top - bounds.height / 2) / (window.innerHeight / 2 + bounds.height / 2)));
      if (!frameId) { previous = performance.now(); frameId = requestAnimationFrame(animate); }
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update(); }, { rootMargin: "120px" });
    observer.observe(frame);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    document.addEventListener("visibilitychange", update);
    reduced.addEventListener("change", update);
    return () => {
      cancelAnimationFrame(frameId);
      observer.disconnect();
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      document.removeEventListener("visibilitychange", update);
      reduced.removeEventListener("change", update);
      element.style.removeProperty("--scene-y");
      element.style.removeProperty("--scene-tilt");
    };
  }, [enabled]);

  return <div ref={scene} className="scene-parallax">{children}</div>;
}

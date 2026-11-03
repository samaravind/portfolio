"use client";

import { useEffect, useRef, useState } from "react";
import Icon from "./icon";

const tools = ["Python", "Next.js", "React", "FastAPI", "TensorFlow", "Convex"];

export default function ToolkitStrip() {
  const strip = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!strip.current) return;
    let visible = false;
    const update = () => setActive(visible && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    });
    observer.observe(strip.current);
    document.addEventListener("visibilitychange", update);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  return (
    <div ref={strip} className="expertise-strip page-width">
      <span className="tiny-label">Working with</span>
      <div className="toolkit-motion">
        <div className="toolkit-viewport" tabIndex={0} role="region" aria-label="Technology toolkit. Motion pauses while focused." data-running={active && !paused}>
          <div className="toolkit-track">
            {[0, 1, 2].map(copy => (
              <ul className="toolkit-group" key={copy} aria-hidden={copy > 0 ? true : undefined}>
                {tools.map(tool => <li key={tool}>{tool}<span aria-hidden="true" /></li>)}
              </ul>
            ))}
          </div>
        </div>
        <button className="toolkit-toggle" onClick={() => setPaused(value => !value)} aria-pressed={paused} aria-label={paused ? "Play toolkit animation" : "Pause toolkit animation"}>
          <Icon name={paused ? "play" : "pause"} size={13} />
        </button>
      </div>
    </div>
  );
}

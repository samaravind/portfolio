import type { Project } from "../_data/projects";
import type { CSSProperties } from "react";
import ScrollScene from "./scroll-scene";

export default function ProjectVisual({ project, view = 0, motion = true }: { project: Project; view?: number; motion?: boolean }) {
  const commerce = project.slug === "fixx-market";

  return (
    <div className={`project-visual visual-${commerce ? 0 : 1}`} aria-hidden="true">
      <div className="visual-label"><span>{commerce ? "FIXX / COMMERCE" : "DUCKY / RESEARCH"}</span><span>EXPLORATION {project.number}</span></div>
      <div className="scene-orbit" />
      <ScrollScene enabled={motion}>{commerce ? (
        <div className="scene-object real-project-scene">
          <div className="concept-browser screenshot-browser">
            <div className="browser-bar"><i /><i /><i /><span>fixx market / storefront</span></div>
            <img src="/projects/fixx-market/storefront.png" alt="" width={1264} height={712} />
          </div>
          <div className="floating-screen"><div className="mini-screen-label"><span>THE COLLECTION</span><span>↗</span></div><img src="/projects/fixx-market/watches.png" alt="" width={1264} height={712} loading="lazy" /></div>
        </div>
      ) : (
        <div className="scene-object"><div className="research-window"><div className="research-top"><span>DUCKY · RESEARCH ENVIRONMENT</span><i /></div><div className="research-command"><span>~/explore</span> {view === 0 ? "input.mechanisms" : view === 1 ? "esm.context" : "security.concepts"}<span>_</span></div><div className="signal-bars">{Array.from({length:24},(_,i) => <i key={i} style={{"--bar-height":`${15 + ((i * 23 + 7) % 45)}px`,"--bar-delay":`${i * -.11}s`} as CSSProperties} />)}</div><div className="research-rows"><span>EXPLORATION<b>KEYSTROKE MECHANISMS</b></span><span>CONTEXT<b>ENABLED ESM ALGORITHM</b></span><span>FOCUS<b>INFORMATION SECURITY</b></span></div></div><div className="keyboard-plane">{Array.from({length:30},(_,i)=><i key={i} />)}</div></div>
      )}</ScrollScene>
      <span className="concept-caption">{commerce ? "Actual frontend preview" : "Conceptual research visualization"}</span>
    </div>
  );
}

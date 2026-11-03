"use client";
import { useEffect, useRef, useState } from "react";
import type { Project } from "../_data/projects";
import ProjectVisual from "./project-visual";
import Icon from "./icon";

export type ProjectImage = { src: string; alt: string; caption: string };
const researchTabs = [
  { title: "Input mechanisms", description: "An exploration of the relationship between keyboard input and software." },
  { title: "Algorithm context", description: "Enabled ESM Algorithm is the named context of the academic project." },
  { title: "Security concepts", description: "Understanding the information-security implications of keystroke capture." },
];

export default function ProjectShowcase({ project, images = [], video }: { project: Project; images?: ProjectImage[]; video?: { src: string; poster?: string; caption: string } }) {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [zoomed, setZoomed] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (!playing) return;
    const interval = window.setInterval(() => setActive(current => (current + 1) % researchTabs.length), 2600);
    return () => window.clearInterval(interval);
  }, [playing]);

  return <div className="project-showcase">
    {images.length > 0 ? <div className="media-gallery">
      {images.map((image, index) => <figure key={image.src}>
        <button onClick={() => { setZoomed(index); dialog.current?.showModal(); }} aria-label={`Enlarge ${image.alt}`}><img src={image.src} alt={image.alt} width={1264} height={712} loading="lazy" /><span><Icon /></span></button>
        <figcaption>{image.caption}</figcaption>
      </figure>)}
      <dialog ref={dialog} className="image-dialog" aria-label="Project screenshot" data-lenis-prevent onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
        <button className="dialog-close" onClick={() => dialog.current?.close()} aria-label="Close image"><Icon name="close" /></button>
        <img src={images[zoomed].src} alt={images[zoomed].alt} /><p>{images[zoomed].caption}</p>
      </dialog>
    </div> : <>
      <div className="showcase-controls">
        <div role="tablist" aria-label="Project preview">{researchTabs.map((tab, index) => <button key={tab.title} role="tab" id={`preview-tab-${index}`} aria-controls="project-preview-panel" aria-selected={active === index} tabIndex={active === index ? 0 : -1} onKeyDown={event => {
          if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
            event.preventDefault();
            const next = (active + (event.key === "ArrowRight" ? 1 : -1) + researchTabs.length) % researchTabs.length;
            setActive(next); setPlaying(false); document.getElementById(`preview-tab-${next}`)?.focus();
          }
        }} onClick={() => { setActive(index); setPlaying(false); }}><span>0{index + 1}</span>{tab.title}</button>)}</div>
        <button className="showcase-play" onClick={() => setPlaying(!playing)} aria-pressed={playing}><Icon name={playing ? "pause" : "play"} size={15} />{playing ? "Pause walkthrough" : "Play walkthrough"}</button>
      </div>
      <div id="project-preview-panel" role="tabpanel" aria-labelledby={`preview-tab-${active}`} className="showcase-stage">
        <ProjectVisual project={project} view={active} />
        <div className="showcase-description" key={active}><span>0{active + 1} / 03</span><h3>{researchTabs[active].title}</h3><p>{researchTabs[active].description}</p><small>Illustrative visualization of the research topic, not a live capture tool.</small></div>
      </div>
    </>}
    {video && <figure className="project-video">
      <div className="video-heading"><span className="eyebrow">THE INTERFACE TOUR</span><h3>See it in motion.</h3></div>
      <video controls playsInline preload="metadata" poster={video.poster} aria-label={`${project.title} frontend interface tour`}><source src={video.src} type="video/mp4" />Your browser cannot play this video. <a href={video.src}>Download the walkthrough.</a></video>
      <figcaption>{video.caption}</figcaption>
    </figure>}
  </div>;
}

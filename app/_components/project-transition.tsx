"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import type { Project } from "../_data/projects";
import ProjectVisual from "./project-visual";
import styles from "./project-transition.module.css";

type Flight = {
  project: Project;
  originPath: string;
  href: string;
  image?: string;
  scrollbarWidth: number;
  style: CSSProperties;
};

const APPROACH_MS = 1800;
const REVEAL_MS = 480;
const ProjectTransitionContext = createContext<(project: Project, source: Element, image?: string) => void>(() => {});
const MotionLockContext = createContext(false);

export function useProjectTransitionActive() {
  return useContext(MotionLockContext);
}

export function ProjectTransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [flight, setFlight] = useState<Flight | null>(null);
  const busy = useRef(false);
  const navigated = useRef(false);
  const arrived = flight?.href === pathname;

  function openProject(project: Project, source: Element, image?: string) {
    if (busy.current) return;
    const bounds = source.getBoundingClientRect();
    if (!bounds.width || !bounds.height) { router.push(`/projects/${project.slug}`); return; }
    busy.current = true;
    navigated.current = false;
    const perspective = Math.max(window.innerWidth, window.innerHeight) * 2;
    const arrivalZ = 160;
    const coverScale = Math.max(window.innerWidth / bounds.width, window.innerHeight / bounds.height) * 1.03;
    const scene = source.querySelector(".scene-object");
    const parallax = source.querySelector(".scene-parallax");
    const href = `/projects/${project.slug}`;
    router.prefetch(href);
    setFlight({
      project,
      originPath: pathname,
      href,
      image,
      scrollbarWidth: window.innerWidth - document.documentElement.clientWidth,
      style: {
        "--flight-width": `${bounds.width}px`,
        "--flight-height": `${bounds.height}px`,
        "--origin-x": `${bounds.left + bounds.width / 2 - window.innerWidth / 2}px`,
        "--origin-y": `${bounds.top + bounds.height / 2 - window.innerHeight / 2}px`,
        "--flight-perspective": `${perspective}px`,
        "--arrival-z": `${arrivalZ}px`,
        // Account for perspective magnification so every screen shape is covered.
        "--arrival-scale": coverScale * (perspective - arrivalZ) / perspective,
        "--source-radius": getComputedStyle(source).borderRadius,
        "--source-scene": scene ? getComputedStyle(scene).transform : "none",
        "--source-parallax": parallax ? getComputedStyle(parallax).transform : "none",
        "--approach-duration": `${APPROACH_MS}ms`,
        "--reveal-duration": `${REVEAL_MS}ms`,
      } as CSSProperties,
    });
  }

  function completeApproach() {
    if (!flight || navigated.current) return;
    navigated.current = true;
    router.push(flight.href, { scroll: false });
  }

  useEffect(() => {
    if (!flight) return;
    const previousOverflow = document.body.style.overflow;
    const previousPadding = document.body.style.paddingRight;
    // Keep the source card still when Lenis removes the scrollbar.
    document.body.style.paddingRight = `${parseFloat(getComputedStyle(document.body).paddingRight) + flight.scrollbarWidth}px`;
    document.body.style.overflow = "hidden";
    // Resizing or changing motion preferences should never leave a stale cover.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finish = () => {
      if (!navigated.current) { navigated.current = true; router.push(flight.href); }
      setFlight(null);
    };
    const recover = window.setTimeout(finish, 8000);
    const cancel = (event: KeyboardEvent) => { if (event.key === "Escape") finish(); };
    window.addEventListener("keydown", cancel);
    window.addEventListener("resize", finish);
    reduced.addEventListener("change", finish);
    return () => {
      window.clearTimeout(recover);
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPadding;
      window.removeEventListener("keydown", cancel);
      window.removeEventListener("resize", finish);
      reduced.removeEventListener("change", finish);
      busy.current = false;
    };
  }, [flight, router]);

  useEffect(() => {
    if (!flight || pathname === flight.originPath) return;
    if (pathname === flight.href) window.scrollTo({ top: 0, behavior: "instant" });
    // Animation events own the normal sequence; this also handles interrupted routes.
    const dismiss = window.setTimeout(() => setFlight(null), pathname === flight.href ? REVEAL_MS + 100 : 0);
    return () => window.clearTimeout(dismiss);
  }, [pathname, flight]);

  return (
    <ProjectTransitionContext.Provider value={openProject}>
      <MotionLockContext.Provider value={flight !== null}>
      {children}
      <span className={styles.status} role="status">{flight ? `Opening ${flight.project.title}` : ""}</span>
      {flight && (
        <div className={`${styles.overlay} ${arrived ? styles.revealing : ""}`} style={flight.style} aria-hidden="true" data-project-transition={arrived ? "revealing" : "approaching"} data-lenis-prevent onAnimationEnd={event => {
          if (event.target === event.currentTarget && arrived) setFlight(null);
        }}>
          <div className={styles.backdrop} />
          <div className={styles.stage}>
            <div className={styles.approach} onAnimationEnd={event => {
              if (event.target === event.currentTarget) completeApproach();
            }}>
              <div className={styles.preview}>
                {flight.image
                  ? <img className={styles.workspaceImage} src={flight.image} alt="" />
                  : <ProjectVisual project={flight.project} motion={false} />}
              </div>
            </div>
          </div>
        </div>
      )}
      </MotionLockContext.Provider>
    </ProjectTransitionContext.Provider>
  );
}

export function ProjectLink({ project, children, getPreview }: { project: Project; children: ReactNode; getPreview?: () => string | undefined }) {
  const openProject = useContext(ProjectTransitionContext);
  const link = useRef<HTMLAnchorElement>(null);

  return (
    <Link
      ref={link}
      href={`/projects/${project.slug}`}
      prefetch={true}
      className="project-link"
      aria-label={`View ${project.title} project details`}
      onPointerMove={(event) => {
        if (event.pointerType === "touch" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const visual = event.currentTarget.querySelector(".project-visual");
        if (!visual) return;
        const bounds = visual.getBoundingClientRect();
        const x = Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1));
        const y = Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height * 2 - 1));
        event.currentTarget.style.setProperty("--tilt-x", `${5 - y * 2}deg`);
        event.currentTarget.style.setProperty("--tilt-y", `${-7 + x * 3}deg`);
      }}
      onPointerLeave={(event) => { event.currentTarget.style.removeProperty("--tilt-x"); event.currentTarget.style.removeProperty("--tilt-y"); }}
      onNavigate={(event) => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !link.current) return;
        event.preventDefault();
        const visual = link.current.querySelector(".project-visual, .workspace-canvas") ?? link.current;
        let preview: string | undefined;
        try { preview = getPreview?.(); } catch { /* The regular project visual remains a safe fallback. */ }
        openProject(project, visual, preview);
      }}
    >
      {children}
    </Link>
  );
}

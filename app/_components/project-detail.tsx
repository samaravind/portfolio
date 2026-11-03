import type { ReactNode } from "react";
import Link from "next/link";
import { projects, type Project } from "../_data/projects";
import ProjectVisual from "./project-visual";
import SiteFooter from "./site-footer";
import Icon from "./icon";
import { ProjectLink } from "./project-transition";
import styles from "./project-detail.module.css";

export default function ProjectDetail({ project, subtitle, facts, children }: { project: Project; subtitle: string; facts: {label: string; value: string}[]; children: ReactNode }) {
  const nextProject = projects.find(item => item.slug !== project.slug)!;
  return <>
    <div className={styles.container}>
      <Link href="/#work" prefetch={true} className={styles.back}>← Back to selected work</Link>
      <header className={styles.hero}><div><p className="eyebrow"><span className="section-index">PROJECT / {project.number}</span> {project.type}</p><h1>{project.title}<span>.</span></h1><p>{subtitle}</p></div><a className={styles.explore} href="#showcase"><Icon name="down" size={24} /><span>EXPLORE<br />THE PROJECT</span></a></header>
      <div className={styles.heroVisual}><ProjectVisual project={project} /></div>
      <dl className={styles.facts}>{facts.map(fact => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}<div><dt>TECHNOLOGIES / CONTEXT</dt><dd>{project.tags.join(" · ")}</dd></div></dl>
    </div>
    <nav className={styles.chapterNav} aria-label="Project chapters"><span>{project.title}</span><div><a href="#overview">01 Overview</a><a href="#showcase">02 Showcase</a><a href="#implementation">03 Implementation</a><a href="#workflow">04 Workflow</a></div></nav>
    <div className={styles.container}>{children}<div className={styles.next}><p className="eyebrow">NEXT PROJECT</p><ProjectLink project={nextProject}><ProjectVisual project={nextProject} /><div><span>{nextProject.type}</span><h2>{nextProject.title}</h2></div><span className={styles.nextArrow}><Icon size={24} /></span></ProjectLink></div></div>
    <SiteFooter />
  </>;
}

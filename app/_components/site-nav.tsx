"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Icon from "./icon";
import styles from "./portfolio-shell.module.css";

const sections = [
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];

export default function SiteNav() {
  const home = usePathname() === "/";
  const [active, setActive] = useState("work");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!home) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      let current = "work";
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element && element.getBoundingClientRect().top <= window.innerHeight * .3) current = section.id;
      }
      if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 30) current = "contact";
      setActive(current);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); };
  }, [home]);

  return <header className={styles.header} onKeyDown={event => { if (event.key === "Escape") setOpen(false); }}>
    <div className={styles.headerInner}>
      <Link href="/" className={styles.identity} aria-label="Sam Aravind home" onClick={() => setOpen(false)}><span className={styles.monogram} aria-hidden="true">sa<span>.</span></span><span><span className={styles.name}>Sam Aravind<span>.</span></span><span className={styles.role}>FULL-STACK WEB DEVELOPER</span></span></Link>
      <nav className={`${styles.navigation} ${open ? styles.isOpen : ""}`} aria-label="Main navigation" id="main-navigation">{sections.map(section => <Link key={section.id} href={`${home ? "" : "/"}#${section.id}`} onClick={() => setOpen(false)} aria-current={(home ? active : "work") === section.id ? "location" : undefined}>{section.label}</Link>)}</nav>
      <div className={styles.actions}><a className={styles.resume} href="/Sam-Aravind-Resume.pdf" download>Résumé <Icon name="down" size={15} /></a><button className={styles.menu} aria-label={open ? "Close navigation" : "Open navigation"} aria-controls="main-navigation" aria-expanded={open} onClick={() => setOpen(value => !value)}><Icon name={open ? "close" : "menu"} size={20} /></button></div>
    </div>
  </header>;
}

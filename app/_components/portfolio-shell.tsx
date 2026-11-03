import type { ReactNode } from "react";
import SiteNav from "./site-nav";
import styles from "./portfolio-shell.module.css";

export default function PortfolioShell({ children }: { children: ReactNode }) {
  return <div className={styles.shell} id="top">
    <SiteNav />
    <main className={styles.content} id="main-content" tabIndex={-1}>{children}</main>
  </div>;
}

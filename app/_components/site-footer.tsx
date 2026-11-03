import Icon from "./icon";
import styles from "./site-footer.module.css";

export default function SiteFooter() {
  return <footer className={styles.footer} id="contact">
    <div className={styles.contact}><div><p>LET’S CONNECT</p><h2>Have a project in mind?</h2><a href="mailto:samaravind.svv@gmail.com">samaravind.svv@gmail.com</a></div><a className={styles.contactArrow} href="mailto:samaravind.svv@gmail.com" aria-label="Email Sam Aravind"><Icon size={23} /></a></div>
    <div className={styles.bottom}><span>© 2026 Sam Aravind.R</span><a href="#top">Back to top ↑</a></div>
  </footer>;
}

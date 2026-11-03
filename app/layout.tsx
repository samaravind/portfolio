import type { Metadata } from "next";
import "lenis/dist/lenis.css";
import "@fontsource-variable/manrope";
import "./globals.css";
import PageMotion from "./_components/page-motion";
import PortfolioShell from "./_components/portfolio-shell";
import { ProjectTransitionProvider } from "./_components/project-transition";

export const metadata: Metadata = {
  title: "Sam Aravind — Full-Stack Web Developer",
  description: "Sam Aravind builds practical software and intelligent systems. Explore full-stack projects, security research, and the thinking behind the work.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body><a className="skip-link" href="#main-content">Skip to content</a><ProjectTransitionProvider><PageMotion /><PortfolioShell>{children}</PortfolioShell></ProjectTransitionProvider></body>
    </html>
  );
}

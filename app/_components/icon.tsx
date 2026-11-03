export default function Icon({ name = "arrow", size = 20 }: { name?: "arrow" | "down" | "play" | "pause" | "close" | "menu" | "code"; size?: number }) {
  const paths = { arrow: "M5 19 19 5M5 5h14v14", down: "M12 4v16M5 13l7 7 7-7", play: "m8 5 11 7-11 7V5Z", pause: "M8 5v14M16 5v14", close: "m6 6 12 12M6 18 18 6", menu: "M4 8h16M4 16h16", code: "m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16" };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name]} /></svg>;
}

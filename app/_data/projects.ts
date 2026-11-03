export const projects = [
  {
    slug: "fixx-market",
    number: "01",
    title: "Fixx Market",
    type: "Full-stack commerce",
    description: "A responsive ecommerce platform with product discovery, wishlists, carts, checkout, and authenticated order workflows.",
    tags: ["Next.js", "FastAPI", "Convex", "Clerk"],
  },
  {
    slug: "ducky-keylogger",
    number: "02",
    title: "Ducky Keylogger",
    type: "Security research",
    description: "An academic project exploring keystroke-capture mechanisms and security concepts using the Enabled ESM Algorithm.",
    tags: ["Security", "Research", "ESM Algorithm"],
  },
] as const;

export type Project = (typeof projects)[number];

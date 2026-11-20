export type Platform =
  | "x"
  | "instagram"
  | "github"
  | "linkedin"
  | "youtube"
  | "twitch"
  | "figma"
  | "notion"

export type Social = {
  platform: Platform
  label: string
  href: string
}

export type IntroPart = string | { text: string; href: string }

const intro: IntroPart[][] = [
  [
    "I care about how things look, how they feel, and who they bring together. Most of my time goes into communities: the people in them, and the tools that help them thrive.",
  ],
  [
    "I'm a Community Solutions Manager at ",
    { text: "Holodot", href: "https://holodot.app" },
    ".",
  ],
  [
    "I'm also designing ",
    { text: "Vylee", href: "https://vylee.xyz" },
    ", a new family of community apps made to work together seamlessly.",
  ],
]

export const site = {
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://sreeman.vylee.xyz",
  name: "Sreeman Reddy",
  handle: "@sreemanreddy",
  email: "contact@sreemanreddy.com",
  intro,
  bio: intro[0].map((part) => (typeof part === "string" ? part : part.text)).join(""),
  avatar: {
    light: "/avatar-light.jpg",
    dark: "/avatar-dark.jpg",
  },
}

export const socials: Social[] = [
  { platform: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/sreemanreddy" },
  { platform: "youtube", label: "YouTube", href: "https://www.youtube.com/@sreemanreddy" },
  { platform: "instagram", label: "Instagram", href: "https://instagram.com/sreemanreddy" },
  { platform: "github", label: "GitHub", href: "https://github.com/sreemanreddy" },
  { platform: "x", label: "X", href: "https://x.com/sreemanreddy" },
  { platform: "twitch", label: "Twitch", href: "https://www.twitch.tv/sreemanreddy" },
  { platform: "figma", label: "Figma Community", href: "https://www.figma.com/@sreemanreddy" },
  { platform: "notion", label: "Notion Marketplace", href: "https://www.notion.com/@sreemanreddy" },
]

import {
  siGithub,
  siInstagram,
  siNotion,
  siTwitch,
  siX,
  siYoutube,
} from "simple-icons"

import type { Platform } from "@/content/site"

const linkedinPath =
  "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"

const figmaPath =
  "M11.6 0H7.8a3.8 3.8 0 0 0 0 7.6h3.8zM12.4 0h3.8a3.8 3.8 0 0 1 0 7.6h-3.8zM11.6 8.4H7.6a3.6 3.6 0 0 0 0 7.2h4zM19.6 12a3.6 3.6 0 1 1-7.2 0 3.6 3.6 0 1 1 7.2 0zM7.8 16.4h3.8v3.8a3.8 3.8 0 1 1-3.8-3.8z"

const paths: Record<Platform, string> = {
  x: siX.path,
  instagram: siInstagram.path,
  github: siGithub.path,
  linkedin: linkedinPath,
  youtube: siYoutube.path,
  twitch: siTwitch.path,
  figma: figmaPath,
  notion: siNotion.path,
}

export function BrandIcon({ platform }: { platform: Platform }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d={paths[platform]} />
    </svg>
  )
}

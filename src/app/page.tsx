import { cn } from "cn"
import Image from "next/image"

import { BrandIcon } from "@/components/brand-icon"
import { Lens } from "@/components/lens"
import { buttonVariants } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { site, socials, type IntroPart } from "@/content/site"

type Fragment = { text: string; href?: string; whole?: string }

function lensPieces(parts: IntroPart[]) {
  const pieces: Fragment[][] = [[]]
  for (const part of parts) {
    if (typeof part !== "string") {
      pieces[pieces.length - 1].push({ text: part.text, href: part.href })
      continue
    }
    let whole: string | undefined = part
    for (const token of part.split(/(\s+)/)) {
      if (!token) continue
      if (/^\s+$/.test(token)) pieces.push([])
      else {
        pieces[pieces.length - 1].push({ text: token, whole })
        whole = undefined
      }
    }
  }
  return pieces.filter((piece) => piece.length > 0)
}

function Letters({ text, from = 0 }: { text: string; from?: number }) {
  return (
    <span aria-hidden>
      {Array.from(text).map((letter, i) => (
        <span
          key={i}
          data-lens
          className="inline-block"
          style={{ "--i": from + i } as React.CSSProperties}
        >
          {letter}
        </span>
      ))}
    </span>
  )
}

function Spoken({ text }: { text: string }) {
  return <span className="sr-only">{text}</span>
}

const linkHover = "underline-offset-4 [&:hover_[data-lens]]:underline"

function LensText({ parts }: { parts: IntroPart[] }) {
  let count = 0
  const next = (text: string) => {
    const from = count
    count += Array.from(text).length
    return from
  }
  return lensPieces(parts).map((piece, i) => (
    <span key={i}>
      {i > 0 && <span aria-hidden> </span>}
      <span className="inline-block whitespace-nowrap">
        {piece.map((fragment, j) =>
          fragment.href ? (
            <a
              key={j}
              href={fragment.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-foreground ${linkHover}`}
            >
              <Spoken text={fragment.text} />
              <Letters text={fragment.text} from={next(fragment.text)} />
            </a>
          ) : (
            <span key={j}>
              {fragment.whole && <Spoken text={fragment.whole} />}
              <Letters text={fragment.text} from={next(fragment.text)} />
            </span>
          )
        )}
      </span>
    </span>
  ))
}

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  url: site.url,
  sameAs: socials.map((s) => s.href),
}

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />

      <Lens>
        <header className="flex flex-col gap-8 motion-safe:animate-in motion-safe:duration-700 motion-safe:fade-in motion-safe:slide-in-from-bottom-4">
          <div
            data-lens
            className="aspect-square w-28 overflow-hidden rounded-3xl bg-muted select-none [-webkit-touch-callout:none]"
          >
            <Image
              src={site.avatar.light}
              alt={site.name}
              width={480}
              height={480}
              sizes="112px"
              priority
              draggable={false}
              className="size-full object-cover dark:hidden"
            />
            <Image
              src={site.avatar.dark}
              alt={site.name}
              width={480}
              height={480}
              sizes="112px"
              priority
              draggable={false}
              className="hidden size-full object-cover dark:block"
            />
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1 select-none">
              <h1 className="reveal text-3xl font-semibold tracking-tight sm:text-4xl">
                <LensText parts={[site.name]} />
              </h1>
              <a
                href={`mailto:${site.email}`}
                className={`w-fit whitespace-nowrap text-muted-foreground hover:text-foreground ${linkHover}`}
              >
                <Spoken text={site.email} />
                <Letters text={site.email} />
              </a>
            </div>

            <div className="flex flex-col gap-4 text-lg leading-relaxed text-muted-foreground select-none">
              {site.intro.map((paragraph, i) => (
                <p key={i}>
                  <LensText parts={paragraph} />
                </p>
              ))}
            </div>

            <nav aria-label="Elsewhere" className="flex flex-wrap gap-2">
              <TooltipProvider>
                {socials.map((s) => (
                  <Tooltip key={s.platform}>
                    <TooltipTrigger
                      render={
                        <a
                          data-lens
                          href={s.href}
                          target="_blank"
                          rel="me noopener noreferrer"
                          aria-label={s.label}
                          className={cn(
                            buttonVariants({ variant: "outline", size: "icon-lg" }),
                            "transition-[color,background-color,border-color,box-shadow]"
                          )}
                        />
                      }
                    >
                      <BrandIcon platform={s.platform} />
                    </TooltipTrigger>
                    <TooltipContent>{s.label}</TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider>
            </nav>
          </div>
        </header>
      </Lens>
    </main>
  )
}

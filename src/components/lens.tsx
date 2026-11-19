"use client"

import { useEffect, useRef } from "react"

const RADIUS = 240
const MAGNIFY = 0.1
const FOLLOW = 10
const FADE_IN = 7
const FADE_OUT = 8
const REST = 250

type Unit = { el: HTMLElement; x: number; y: number; last: string }

export function Lens({ children }: { children: React.ReactNode }) {
  const wrap = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = wrap.current?.firstElementChild as HTMLElement | null
    if (!root) return
    const wanted = matchMedia(
      "(pointer: fine) and (prefers-reduced-motion: no-preference)"
    )
    if (!wanted.matches) return

    let units: Unit[] = []
    const measure = () => {
      const base = root.getBoundingClientRect()
      units = Array.from(root.querySelectorAll<HTMLElement>("[data-lens]")).map(
        (el) => {
          el.style.transform = ""
          const r = el.getBoundingClientRect()
          return {
            el,
            x: r.left + r.width / 2 - base.left,
            y: r.top + r.height / 2 - base.top,
            last: "",
          }
        }
      )
    }
    let measured = false

    const target = { x: 0, y: 0 }
    const pos = { x: 0, y: 0 }
    let placed = false
    let want = 0
    let strength = 0
    let last = 0
    let frame = 0
    let rest = 0

    const tick = (now: number) => {
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 1 / 60
      last = now
      const follow = 1 - Math.exp(-dt * FOLLOW)
      pos.x += (target.x - pos.x) * follow
      pos.y += (target.y - pos.y) * follow
      const fade = want > strength ? FADE_IN : FADE_OUT
      strength += (want - strength) * (1 - Math.exp(-dt * fade))
      if (want === 0 && strength < 0.001) strength = 0

      const base = root.getBoundingClientRect()
      const cx = pos.x - base.left
      const cy = pos.y - base.top
      for (const u of units) {
        const dx = u.x - cx
        const dy = u.y - cy
        const r2 = (dx * dx + dy * dy) / (RADIUS * RADIUS)
        let transform = ""
        if (r2 < 1 && strength > 0) {
          const k = 1 - Math.sqrt(r2)
          const push = k ** 3 * strength * MAGNIFY
          const grow = k ** 4 * strength * MAGNIFY
          transform = `translate(${(dx * push).toFixed(2)}px, ${(dy * push).toFixed(2)}px) scale(${(1 + grow).toFixed(4)})`
        }
        if (transform !== u.last) {
          u.el.style.transform = transform
          u.last = transform
        }
      }

      const moving =
        Math.abs(target.x - pos.x) > 0.05 || Math.abs(target.y - pos.y) > 0.05
      if (moving || strength !== want) {
        frame = requestAnimationFrame(tick)
      } else {
        frame = 0
        last = 0
      }
    }
    const wake = () => {
      if (!frame) frame = requestAnimationFrame(tick)
    }

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return
      if (!measured) {
        measure()
        measured = true
      }
      target.x = e.clientX
      target.y = e.clientY
      if (!placed) {
        pos.x = target.x
        pos.y = target.y
        placed = true
      }
      want = 1
      wake()
      clearTimeout(rest)
      rest = window.setTimeout(onLeave, REST)
    }
    function onLeave() {
      clearTimeout(rest)
      want = 0
      wake()
    }
    const onResize = () => {
      if (measured) measure()
      wake()
    }

    const resize = new ResizeObserver(onResize)
    resize.observe(root)
    window.addEventListener("pointermove", onMove, { passive: true })
    document.documentElement.addEventListener("pointerleave", onLeave)
    window.addEventListener("blur", onLeave)
    window.addEventListener("scroll", wake, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      clearTimeout(rest)
      resize.disconnect()
      window.removeEventListener("pointermove", onMove)
      document.documentElement.removeEventListener("pointerleave", onLeave)
      window.removeEventListener("blur", onLeave)
      window.removeEventListener("scroll", wake)
      for (const u of units) u.el.style.transform = ""
    }
  }, [])

  return <div ref={wrap}>{children}</div>
}

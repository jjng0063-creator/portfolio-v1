import { useEffect, useRef, useState } from 'react'
import { profile, sections } from '@/data/profile'

// Mirrors the visible sections from src/data/site.json, so hiding or
// reordering a section in the admin panel moves its nav link with it.
const LINKS = sections.map(s => ({ id: s.id, label: s.navLabel || s.title }))

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState(LINKS[0]?.id ?? '')
  const sentinel = useRef(null)

  // A 1px marker sitting 24px down the page. Once it leaves the viewport the
  // header has something behind it and earns its background. IntersectionObserver
  // rather than a scroll listener: no work on the scroll frame, no re-render
  // storm on mobile.
  useEffect(() => {
    const el = sentinel.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { threshold: 0 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Which section the reader is actually looking at. Ratios are kept per id so
  // that when two sections straddle the viewport the larger one wins, instead
  // of the link flickering between them.
  useEffect(() => {
    const els = LINKS.map(l => document.getElementById(l.id)).filter(Boolean)
    if (!els.length) return

    const ratios = new Map()
    const io = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          ratios.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0)
        }
        let best = ''
        let bestRatio = 0
        for (const [id, ratio] of ratios) {
          if (ratio > bestRatio) {
            bestRatio = ratio
            best = id
          }
        }
        if (best) setActive(best)
      },
      { threshold: [0.1, 0.4, 0.75], rootMargin: '-72px 0px -40% 0px' }
    )

    els.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <>
      <div ref={sentinel} aria-hidden className="pointer-events-none absolute left-0 top-6 h-px w-px" />
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
          scrolled ? 'border-b border-border/60 bg-background/80 backdrop-blur-md' : ''
        }`}>
        <nav
          aria-label="Sections"
          className="mx-auto flex w-full max-w-5xl items-center gap-4 px-6 py-3">
          <a
            href="#top"
            className="shrink-0 rounded-md text-sm font-medium tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/60">
            {profile.name}
          </a>

          {/* Scrolls sideways under 640px rather than vanishing behind a
              breakpoint, which is what the old `hidden sm:flex` did.
              ml-auto rather than justify-end: an overflowing flex container
              with flex-end alignment spills past its *start* edge, and a
              scroll container cannot scroll backwards to reach it, so the
              first link becomes unclickable on narrow screens. */}
          <ul className="-mx-1 ml-auto flex min-w-0 items-center gap-0.5 overflow-x-auto px-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {LINKS.map(l => {
              const isActive = active === l.id
              return (
                <li key={l.id} className="shrink-0">
                  <a
                    href={`#${l.id}`}
                    aria-current={isActive ? 'true' : undefined}
                    className={`relative block rounded-md px-2 py-1.5 text-sm whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/60 ${
                      isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                    }`}>
                    {l.label}
                    <span
                      aria-hidden
                      className={`absolute inset-x-2 bottom-0.5 h-px origin-left bg-brand transition-transform duration-300 ease-out ${
                        isActive ? 'scale-x-100' : 'scale-x-0'
                      }`}
                    />
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>
      </header>
    </>
  )
}

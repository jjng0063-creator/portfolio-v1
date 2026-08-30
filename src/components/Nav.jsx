import { useEffect, useState } from 'react'
import { profile, sections } from '@/data/profile'

// Mirrors the visible sections from src/data/site.json, so hiding or
// reordering a section in the admin panel moves its nav link with it.
const LINKS = sections.map(s => ({ id: s.id, label: s.navLabel || s.title }))

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState(LINKS[0]?.id ?? '')

  // A 1px marker sitting 24px down the page. Once it leaves the viewport the
  // header has something behind it and earns its background. IntersectionObserver
  // rather than a scroll listener: no work on the scroll frame, no re-render
  // storm on mobile.
  useEffect(() => {
    // Rendered by App inside #smooth-content, not here: see the note there.
    const el = document.getElementById('nav-top-marker')
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { threshold: 0 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Which section the reader is actually looking at: whichever one covers most
  // of a band running from under the header to part-way down the viewport.
  useEffect(() => {
    const els = LINKS.map(l => document.getElementById(l.id)).filter(Boolean)
    if (!els.length) return

    const HEADER = 72
    const CROP = 0.4

    // Measured fresh on every callback rather than cached per entry. An
    // observer only reports a section when it crosses a threshold, so a stored
    // ratio is a snapshot from whenever that last happened, and it drifts
    // arbitrarily far from the truth while the section keeps moving.
    const pick = () => {
      const vh = window.innerHeight
      const doc = document.documentElement

      // The bottom crop stops a section that is barely peeking in from the
      // bottom edge from taking the highlight early. Once the document has run
      // out of scroll nothing can peek in any more, and keeping the crop there
      // leaves the final section permanently unreachable: it can never climb
      // further up the band, because the page has stopped moving.
      const atEnd = Math.ceil(window.scrollY + vh) >= doc.scrollHeight - 1
      const top = HEADER
      const bottom = atEnd ? vh : vh * (1 - CROP)

      // How much of the band each section covers, not intersectionRatio: a
      // ratio is a fraction of the section's own height, so a short section
      // sitting wholly inside the band would outrank a tall one filling it.
      let best = ''
      let bestCovered = 0
      for (const el of els) {
        const r = el.getBoundingClientRect()
        const covered = Math.min(r.bottom, bottom) - Math.max(r.top, top)
        // >= so that when two sections cover the band equally the lower one
        // wins: the reader has moved down into it, not back up out of it.
        if (covered > 0 && covered >= bestCovered) {
          bestCovered = covered
          best = el.id
        }
      }
      return best
    }

    const sync = () => {
      const next = pick()
      if (next) setActive(next)
    }

    const io = new IntersectionObserver(sync, {
      threshold: [0, 0.25, 0.5, 0.75, 1],
      rootMargin: `-${HEADER}px 0px -${CROP * 100}% 0px`,
    })
    els.forEach(el => io.observe(el))

    // The last section stops crossing thresholds before the page stops
    // scrolling, so nothing above would re-run pick() over the final stretch.
    // This marker sits below the footer and reports when the end is on screen.
    const end = document.getElementById('nav-end-marker')
    const endIo = end && new IntersectionObserver(sync, { threshold: 0 })
    if (endIo) endIo.observe(end)

    return () => {
      io.disconnect()
      if (endIo) endIo.disconnect()
    }
  }, [])

  return (
    <>
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

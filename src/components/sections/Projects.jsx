import { useEffect, useMemo, useState } from 'react'
import SkewedCarousel from '@/components/SkewedCarousel'
import Section from '@/components/Section'
import SectionHeading from '@/components/SectionHeading'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { projects } from '@/data/profile'

/*
 * TODO: these cards are typographic because there is nothing real to show yet.
 * A screenshot of each project (the attendance app mid-scan, the CharityLink
 * feed, the co-curricular dashboard) would carry this section far better than
 * a coloured panel. Drop them in public/uploads/ and render them here.
 */
function ProjectCard({ project }) {
  const [from, to] = project.accent ?? ['#0e5a49', '#0b4a52']

  return (
    <div
      className="relative flex h-full w-full flex-col justify-between overflow-hidden p-5 text-white"
      style={{ backgroundImage: `linear-gradient(155deg, ${from} 0%, ${to} 100%)` }}>
      {/* A lit top edge, so the card reads as a surface rather than a swatch. */}
      <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-white/25" />

      <div>
        <h3 className="text-balance text-base font-medium leading-snug">
          {project.title}
        </h3>
        <p className="mt-2 text-pretty text-sm leading-relaxed text-white/80">
          {project.blurb}
        </p>
      </div>

      <div>
        <div className="flex flex-wrap gap-1.5">
          {project.stack?.slice(0, 3).map(t => (
            <span
              key={t}
              className="rounded-md bg-black/25 px-2 py-0.5 text-[11px] text-white/90 backdrop-blur-sm">
              {t}
            </span>
          ))}
        </div>
        <p className="tnum mt-3 text-[11px] text-white/60">{project.year}</p>
      </div>
    </div>
  )
}

/** Carousel geometry per breakpoint. Cards and arc shrink on narrow screens. */
const SIZES = [
  { query: '(max-width: 640px)', cardWidth: 150, cardHeight: 210, spread: 300, visibleCards: 2 },
  { query: '(max-width: 1024px)', cardWidth: 180, cardHeight: 250, spread: 480, visibleCards: 3 },
  { query: null, cardWidth: 200, cardHeight: 280, spread: 720, visibleCards: 3 },
]

/** matchMedia rather than a resize listener: fires on breakpoint crossings
 *  only, instead of setting state on every pixel of a window drag. */
function useCarouselSize() {
  const [size, setSize] = useState(SIZES[SIZES.length - 1])

  useEffect(() => {
    const queries = SIZES.filter(s => s.query)
    const lists = queries.map(s => window.matchMedia(s.query))
    const sync = () => {
      const i = lists.findIndex(mq => mq.matches)
      setSize(i === -1 ? SIZES[SIZES.length - 1] : queries[i])
    }
    sync()
    lists.forEach(mq => mq.addEventListener('change', sync))
    return () => lists.forEach(mq => mq.removeEventListener('change', sync))
  }, [])

  return size
}

export default function Projects({ id, eyebrow, title, subtitle }) {
  const [active, setActive] = useState(0)
  const size = useCarouselSize()

  const items = useMemo(
    () => projects.map(p => ({ alt: p.title, content: <ProjectCard project={p} /> })),
    []
  )

  const current = projects[active] ?? projects[0]

  return (
    <Section id={id}>
      <SectionHeading eyebrow={eyebrow} title={title}>
        {subtitle}
      </SectionHeading>

      <div className="-mx-6 sm:mx-0">
        <SkewedCarousel
          items={items}
          cardWidth={size.cardWidth}
          cardHeight={size.cardHeight}
          spread={size.spread}
          visibleCards={size.visibleCards}
          rotation={60}
          inactiveScale={0.85}
          arc={18}
          loop
          onChange={setActive}
        />
      </div>

      {current && (
        <div
          aria-live="polite"
          className="mt-10 rounded-xl border border-border bg-card/50 p-6 sm:p-8">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h3 className="text-xl font-medium text-pretty">{current.title}</h3>
            <span className="tnum text-sm text-muted-foreground">
              {current.kind}, {current.year}
            </span>
          </div>

          <p className="mt-4 max-w-[68ch] text-pretty leading-relaxed text-muted-foreground">
            {current.description}
          </p>

          {current.stack?.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {current.stack.map(t => (
                <Badge key={t} variant="outline">
                  {t}
                </Badge>
              ))}
            </div>
          )}

          {current.links?.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-3">
              {current.links.map(l => (
                <Button key={l.href} size="sm" variant="outline" asChild>
                  <a href={l.href} target="_blank" rel="noreferrer">
                    {l.label}
                  </a>
                </Button>
              ))}
            </div>
          )}
        </div>
      )}
    </Section>
  )
}

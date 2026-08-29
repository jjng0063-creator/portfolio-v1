import { Button } from '@/components/ui/button'
import { profile } from '@/data/profile'

const initials = name =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase())
    .join('')

// Staggered purely in CSS (see [data-enter] in src/index.css). Nothing here
// waits on a script, so the hero paints with the document.
const enter = delay => ({ '--enter-delay': `${delay}ms` })

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(70%_55%_at_12%_0%,color-mix(in_oklab,var(--brand)_13%,transparent),transparent_72%)]"
      />
      <div className="mx-auto w-full max-w-5xl px-6 pb-20 pt-20 sm:pb-28 sm:pt-24">
        <div className="grid items-center gap-10 md:grid-cols-12 md:gap-12">
          {/* Photo sits above the copy on phones and to its right from md up,
              without moving ahead of the heading in the reading order. It is
              deliberately not animated: it is the largest paint on the page. */}
          <div className="order-first md:order-last md:col-span-5">
            <div className="relative mx-auto w-full max-w-[13rem] md:mx-0 md:max-w-none">
              <div
                aria-hidden
                className="absolute -bottom-3 -right-3 -z-10 size-full rounded-2xl border border-brand/35"
              />
              {profile.photo ? (
                <img
                  src={profile.photo}
                  alt={`${profile.name}, ${profile.role}`}
                  width={640}
                  height={800}
                  fetchPriority="high"
                  className="aspect-[4/5] w-full rounded-2xl object-cover ring-1 ring-border"
                />
              ) : (
                <div className="grid aspect-[4/5] w-full place-items-center rounded-2xl bg-muted text-5xl font-semibold tracking-tight ring-1 ring-border">
                  {initials(profile.name)}
                </div>
              )}
            </div>
          </div>

          <div className="md:col-span-7">
            {profile.availability && (
              <p
                data-enter=""
                style={enter(0)}
                className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
                {/* Static: the dot already says "available". A permanent ping
                    would repaint every frame the page is open to say it twice. */}
                <span className="size-1.5 shrink-0 rounded-full bg-brand ring-3 ring-brand/20" />
                <span className="tnum">{profile.availability}</span>
              </p>
            )}

            <h1
              data-enter=""
              style={enter(70)}
              className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              {profile.name}
              <span className="mt-2 block text-lg font-normal tracking-normal text-muted-foreground sm:text-2xl">
                {profile.role}
              </span>
            </h1>

            <p
              data-enter=""
              style={enter(140)}
              className="mt-6 max-w-[52ch] text-pretty leading-relaxed text-muted-foreground">
              {profile.tagline}
            </p>

            <div
              data-enter=""
              style={enter(210)}
              className="mt-8 flex flex-wrap items-center gap-3">
              <Button size="lg" className="h-11 px-5" asChild>
                <a href="#projects">View projects</a>
              </Button>
              {profile.resumeUrl && (
                <Button size="lg" variant="outline" className="h-11 px-5" asChild>
                  <a href={profile.resumeUrl} target="_blank" rel="noreferrer">
                    Résumé
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

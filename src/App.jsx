import Nav from '@/components/Nav'
import { useSmoothScroll } from '@/lib/smoothScroll'
import Hero from '@/components/sections/Hero'
import Footer from '@/components/Footer'
import { SECTION_COMPONENTS } from '@/components/sections'
import { sections } from '@/data/profile'

export default function App() {
  useSmoothScroll()

  return (
    <div className="relative min-h-svh bg-background text-foreground antialiased">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground">
        Skip to content
      </a>
      {/* Nav sits outside the wrapper on purpose. ScrollSmoother transforms
          #smooth-content, and a transformed ancestor makes position:fixed
          resolve against that ancestor instead of the viewport, so a header
          inside it would scroll away with the page. */}
      <Nav />

      <div id="smooth-wrapper">
        <div id="smooth-content" className="relative">
          {/*
           * The nav's two markers live here rather than inside Nav. While the
           * smoother runs, #smooth-wrapper is position:fixed and one viewport
           * tall, so anything positioned against a container outside it would
           * anchor to the viewport rather than to the document -- the end
           * marker would sit at the bottom of the screen instead of the bottom
           * of the page. Inside #smooth-content they track the document with
           * or without the plugin.
           */}
          <div
            id="nav-top-marker"
            aria-hidden
            className="pointer-events-none absolute left-0 top-6 h-px w-px"
          />
          <div
            id="nav-end-marker"
            aria-hidden
            className="pointer-events-none absolute bottom-0 left-0 h-px w-px"
          />

          <main id="main">
            <Hero />
            {sections.map(section => {
              const Component = SECTION_COMPONENTS[section.component]
              if (!Component) return null
              return (
                <Component
                  key={section.id}
                  id={section.id}
                  eyebrow={section.eyebrow}
                  title={section.title}
                  subtitle={section.subtitle}
                />
              )
            })}
          </main>
          <Footer />
        </div>
      </div>
    </div>
  )
}

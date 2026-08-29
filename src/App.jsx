import Nav from '@/components/Nav'
import Hero from '@/components/sections/Hero'
import Footer from '@/components/Footer'
import { SECTION_COMPONENTS } from '@/components/sections'
import { sections } from '@/data/profile'

export default function App() {
  return (
    <div className="relative min-h-svh bg-background text-foreground antialiased">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground">
        Skip to content
      </a>
      <Nav />
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
  )
}

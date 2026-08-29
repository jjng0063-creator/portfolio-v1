import { useReveal } from '@/lib/reveal'

export default function Section({ id, className = '', children }) {
  // One observer per section covers every [data-reveal] inside it, so the
  // individual sections never have to wire up motion themselves.
  const reveal = useReveal()

  return (
    <section
      id={id}
      className={`scroll-mt-24 border-t border-border/60 pt-20 pb-24 sm:pt-24 sm:pb-32 ${className}`.trim()}>
      <div ref={reveal} className="mx-auto w-full max-w-5xl px-6">
        {children}
      </div>
    </section>
  )
}

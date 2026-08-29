import Section from '@/components/Section'
import SectionHeading from '@/components/SectionHeading'
import { Button } from '@/components/ui/button'
import { contact } from '@/data/profile'

export default function Contact({ id, eyebrow, title, subtitle }) {
  return (
    <Section id={id}>
      <SectionHeading eyebrow={eyebrow} title={title}>
        {subtitle}
      </SectionHeading>

      <a
        data-reveal=""
        href={`mailto:${contact.email}`}
        className="inline-block rounded-md break-all text-2xl font-medium underline decoration-brand/50 decoration-2 underline-offset-8 transition-colors hover:decoration-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/60 sm:text-3xl">
        {contact.email}
      </a>

      {contact.links.length > 0 && (
        <div data-reveal="" className="mt-8 flex flex-wrap gap-3">
          {contact.links.map(l => (
            <Button key={l.href} variant="outline" asChild>
              <a href={l.href} target="_blank" rel="noreferrer">
                {l.label}
              </a>
            </Button>
          ))}
        </div>
      )}
    </Section>
  )
}

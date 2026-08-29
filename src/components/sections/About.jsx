import Section from '@/components/Section'
import SectionHeading from '@/components/SectionHeading'
import { profile } from '@/data/profile'

export default function About({ id, eyebrow, title, subtitle }) {
  const [lead, ...rest] = profile.about

  return (
    <Section id={id}>
      <SectionHeading eyebrow={eyebrow} title={title}>
        {subtitle}
      </SectionHeading>

      <div className="space-y-8">
        <p
          data-reveal=""
          className="max-w-[58ch] text-lg leading-relaxed text-pretty">
          {lead}
        </p>

        {rest.length > 0 && (
          // Column count follows the paragraph count, so a single trailing
          // paragraph does not sit next to an empty half.
          <div
            className={`grid gap-8 border-t border-border/60 pt-8 ${
              rest.length > 1 ? 'sm:grid-cols-2' : ''
            }`}>
            {rest.map((para, i) => (
              <p
                key={i}
                data-reveal=""
                className="max-w-[58ch] text-pretty leading-relaxed text-muted-foreground">
                {para}
              </p>
            ))}
          </div>
        )}
      </div>
    </Section>
  )
}

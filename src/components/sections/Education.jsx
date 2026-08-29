import Section from '@/components/Section'
import SectionHeading from '@/components/SectionHeading'
import { education } from '@/data/profile'

export default function Education({ id, eyebrow, title, subtitle }) {
  return (
    <Section id={id}>
      <SectionHeading eyebrow={eyebrow} title={title}>
        {subtitle}
      </SectionHeading>

      {/* Divided rows rather than cards: two entries do not need elevation to
          read as separate things, and a hairline per group beats a box each. */}
      <div className="border-t border-border/60">
        {education.map((ed, i) => (
          <article
            key={i}
            data-reveal=""
            className="grid gap-3 border-b border-border/60 py-8 md:grid-cols-12 md:gap-8">
            <div className="md:col-span-4">
              <h3 className="font-medium text-pretty">{ed.school}</h3>
              <p className="tnum mt-1 text-sm text-muted-foreground">{ed.period}</p>
            </div>

            <div className="md:col-span-8">
              <p className="text-pretty">{ed.degree}</p>
              {ed.grade && (
                <p className="tnum mt-1 text-sm text-muted-foreground">{ed.grade}</p>
              )}
              {ed.details?.length > 0 && (
                <ul className="mt-4 list-disc space-y-2 pl-4 text-sm leading-relaxed text-muted-foreground marker:text-brand/60">
                  {ed.details.map((d, j) => (
                    <li key={j} className="pl-1 text-pretty">
                      {d}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </article>
        ))}
      </div>
    </Section>
  )
}

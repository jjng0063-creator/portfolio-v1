import Section from '@/components/Section'
import SectionHeading from '@/components/SectionHeading'
import { skills } from '@/data/profile'

export default function Skills({ id, eyebrow, title, subtitle }) {
  return (
    <Section id={id}>
      <SectionHeading eyebrow={eyebrow} title={title}>
        {subtitle}
      </SectionHeading>

      {/* Group label left, items right. Keeps four groups scannable in one
          column of the eye rather than a 2x2 grid of badge clouds. */}
      <div className="border-t border-border/60">
        {skills.map(g => (
          <div
            key={g.group}
            data-reveal=""
            className="grid gap-3 border-b border-border/60 py-6 md:grid-cols-12 md:gap-8">
            <h3 className="self-center text-sm font-medium text-muted-foreground md:col-span-4">
              {g.group}
            </h3>
            <ul className="flex flex-wrap gap-2 md:col-span-8">
              {g.items.map((s, i) => (
                <li
                  key={`${s}-${i}`}
                  className="rounded-md border border-border px-2.5 py-1 text-sm">
                  {s}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  )
}

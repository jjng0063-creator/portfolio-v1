import Section from '@/components/Section'
import SectionHeading from '@/components/SectionHeading'
import { Badge } from '@/components/ui/badge'
import { experience } from '@/data/profile'

export default function Experience({ id, eyebrow, title, subtitle }) {
  return (
    <Section id={id}>
      <SectionHeading eyebrow={eyebrow} title={title}>
        {subtitle}
      </SectionHeading>

      <ol className="relative border-l border-border pl-8">
        {experience.map((job, i) => (
          <li key={i} className="group pb-12 last:pb-0">
            {/* Positioned against the <ol>, so the reveal transform below must
                stay off the <li> or it would become the containing block and
                pull every node off the rail. */}
            <span
              aria-hidden
              className="absolute -left-[6.5px] mt-2 size-3 rounded-full border-2 border-background bg-brand transition-transform duration-300 ease-out motion-safe:group-hover:scale-125"
            />

            <div data-reveal="">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="text-lg font-medium text-pretty">{job.role}</h3>
                <span className="tnum text-sm text-muted-foreground">{job.period}</span>
              </div>

              <p className="mt-1 text-sm text-muted-foreground">
                {job.company}
                {job.location ? `, ${job.location}` : ''}
              </p>

              {job.summary && (
                <p className="mt-4 max-w-[62ch] text-pretty leading-relaxed text-muted-foreground">
                  {job.summary}
                </p>
              )}

              {job.highlights?.length > 0 && (
                <ul className="mt-4 max-w-[62ch] list-disc space-y-2 pl-4 text-sm leading-relaxed text-muted-foreground marker:text-brand/60">
                  {job.highlights.map((h, j) => (
                    <li key={j} className="pl-1 text-pretty">
                      {h}
                    </li>
                  ))}
                </ul>
              )}

              {job.stack?.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {job.stack.map(t => (
                    <Badge key={t} variant="outline">
                      {t}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>
    </Section>
  )
}

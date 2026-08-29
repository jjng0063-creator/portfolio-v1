// Per-icon subpaths, not the package root. The root barrel re-exports every
// icon in the set, which made Rollup parse the whole library on each build
// (35s, and 19KB of icons in the bundle for the six actually used).
// '@phosphor-icons/react/<Name>' is a documented export path.
import { EnvelopeSimpleIcon } from '@phosphor-icons/react/EnvelopeSimple'
import { GithubLogoIcon } from '@phosphor-icons/react/GithubLogo'
import { LinkIcon } from '@phosphor-icons/react/Link'
import { LinkedinLogoIcon } from '@phosphor-icons/react/LinkedinLogo'
import { WhatsappLogoIcon } from '@phosphor-icons/react/WhatsappLogo'
import { XLogoIcon } from '@phosphor-icons/react/XLogo'

import Section from '@/components/Section'
import SectionHeading from '@/components/SectionHeading'
import { Button } from '@/components/ui/button'
import { contact } from '@/data/profile'
import { whatsappUrl } from '@/lib/contact'

// Keyed on the link label from src/data/site.json, so a link added through the
// admin panel picks up its mark automatically. Anything unrecognised falls back
// to a plain link glyph rather than rendering nothing.
const LINK_ICONS = {
  github: GithubLogoIcon,
  linkedin: LinkedinLogoIcon,
  x: XLogoIcon,
  twitter: XLogoIcon,
}

const iconFor = label => LINK_ICONS[label?.toLowerCase().replace(/\s+/g, '')] ?? LinkIcon

export default function Contact({ id, eyebrow, title, subtitle }) {
  const whatsapp = whatsappUrl(contact.whatsapp)

  // The address and the number are the destination, not the label. Showing
  // them as text put both in front of anyone scraping the rendered page.
  const channels = [
    contact.email && {
      key: 'email',
      label: 'Email',
      href: `mailto:${contact.email}`,
      Icon: EnvelopeSimpleIcon,
      primary: true,
    },
    whatsapp && {
      key: 'whatsapp',
      label: 'WhatsApp',
      href: whatsapp,
      Icon: WhatsappLogoIcon,
      external: true,
    },
    ...contact.links.map(l => ({
      key: l.href,
      label: l.label,
      href: l.href,
      Icon: iconFor(l.label),
      external: true,
    })),
  ].filter(Boolean)

  return (
    <Section id={id}>
      <SectionHeading eyebrow={eyebrow} title={title}>
        {subtitle}
      </SectionHeading>

      <div data-reveal="" className="flex flex-wrap gap-3">
        {channels.map(({ key, label, href, Icon, primary, external }) => (
          <Button
            key={key}
            size="lg"
            variant={primary ? 'default' : 'outline'}
            className="h-11 px-5"
            asChild>
            <a
              href={href}
              {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}>
              <Icon className="size-5" weight="regular" aria-hidden="true" />
              {label}
            </a>
          </Button>
        ))}
      </div>
    </Section>
  )
}

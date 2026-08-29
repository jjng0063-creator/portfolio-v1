// ============================================================================
//  Contact channel helpers. No React and no DOM at import time, so
//  scripts/check.mjs can exercise this directly.
// ============================================================================

/**
 * Build a wa.me link from a stored phone number.
 *
 * WhatsApp wants the full international number with no plus, spaces or
 * dashes, so the stored value is normalised down to digits.
 *
 * A number still carrying a trunk zero ('012-345 6789' rather than
 * '+60 12-345 6789') is rejected rather than linked. Stripping it to
 * '0123456789' would produce a link that resolves to a different subscriber
 * or to nothing, and a contact route that quietly goes to the wrong person is
 * worse than one that is visibly absent. The admin panel states the format.
 *
 * Returns null when the value cannot be trusted, so callers can simply not
 * render the channel.
 */
export function whatsappUrl(value) {
  if (typeof value !== 'string') return null

  const digits = value.replace(/\D/g, '')

  // E.164 allows at most 15 digits, and a country code plus a subscriber
  // number does not fit in fewer than 8. Outside that range it is a typo.
  if (digits.length < 8 || digits.length > 15) return null
  if (digits.startsWith('0')) return null

  return `https://wa.me/${digits}`
}

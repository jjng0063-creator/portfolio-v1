import { useEffect, useRef } from 'react'

/**
 * Reveals [data-reveal] descendants as they scroll into view.
 *
 * Progressive enhancement, deliberately. Nothing is hidden in the markup or by
 * a bare attribute selector: this effect adds data-reveal="out" itself, so if
 * the bundle fails, the browser has no IntersectionObserver, or the reader
 * asked for reduced motion, the page is simply readable. Hiding content in CSS
 * and depending on a script to bring it back risks showing a blank page, which
 * on a portfolio is worse than showing no animation at all.
 *
 * IntersectionObserver rather than a scroll listener: the browser does the
 * intersection work itself and no scroll frame touches React state.
 */
export function useReveal({ stagger = 70, threshold = 0.15 } = {}) {
  const ref = useRef(null)

  useEffect(() => {
    const root = ref.current
    if (!root || typeof IntersectionObserver === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // Anything already on screen stays as it is. Hiding it just to fade it
    // back in would flash content the reader is currently looking at.
    const fold = window.innerHeight * 0.9
    const targets = [...root.querySelectorAll('[data-reveal]')].filter(
      el => el.getBoundingClientRect().top > fold
    )
    if (!targets.length) return

    targets.forEach(el => {
      el.dataset.reveal = 'out'
    })

    const show = el => {
      el.dataset.reveal = 'in'
    }

    const observer = new IntersectionObserver(
      entries => {
        entries
          .filter(entry => entry.isIntersecting)
          .forEach((entry, i) => {
            entry.target.style.setProperty('--reveal-delay', `${i * stagger}ms`)
            show(entry.target)
            observer.unobserve(entry.target)
          })
      },
      { threshold, rootMargin: '0px 0px -8% 0px' }
    )

    targets.forEach(el => observer.observe(el))

    // If the observer has not reported by now the renderer is throttling it
    // (background tab, hidden view, some embedded browsers). Show everything
    // rather than leave the section blank.
    const failsafe = window.setTimeout(() => {
      targets.forEach(show)
      observer.disconnect()
    }, 2000)

    return () => {
      window.clearTimeout(failsafe)
      observer.disconnect()
    }
  }, [stagger, threshold])

  return ref
}

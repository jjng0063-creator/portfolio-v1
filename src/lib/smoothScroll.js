import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollSmoother } from 'gsap/ScrollSmoother'

gsap.registerPlugin(ScrollTrigger, ScrollSmoother)

// Matches scroll-mt-24 on the sections, so a link lands a section's heading in
// the same place whether or not the smoother is running.
const HEADER_OFFSET = 96

/**
 * Eases the page scroll, by way of GSAP's ScrollSmoother.
 *
 * The native scrollbar and scroll position stay real: the plugin translates
 * #smooth-content to lag behind them. That is what keeps IntersectionObserver
 * working -- getBoundingClientRect and observer roots both account for an
 * ancestor's transform, so the reveals in src/lib/reveal.js and the nav's
 * active-section tracking carry on measuring the position a reader can see.
 *
 * Nothing here is load-bearing. Under reduced motion the hook returns before
 * creating anything and the page scrolls natively, which is also what happens
 * if the bundle never arrives.
 */
export function useSmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const smoother = ScrollSmoother.create({
      wrapper: '#smooth-wrapper',
      content: '#smooth-content',
      smooth: 1,
      // Native scrolling on touch. Phone scrolling is already smooth, and
      // taking it over costs the browser's own overscroll and address-bar
      // behaviour for nothing.
      smoothTouch: false,
      // No data-speed / data-lag parallax is in the markup, so skip the work
      // of scanning for it on every refresh.
      effects: false,
      normalizeScroll: false,
      // A phone hiding its address bar counts as a resize; without this the
      // plugin re-measures mid-scroll and the page jumps.
      ignoreMobileResize: true,
    })

    // html { scroll-behavior: smooth } and the smoother would be two easings
    // fighting over the same scroll position. The rule stays in the stylesheet
    // for the no-script and reduced-motion paths; it is only stood down while
    // the plugin is actually running.
    const html = document.documentElement
    const previousBehavior = html.style.scrollBehavior
    html.style.scrollBehavior = 'auto'

    // ScrollSmoother has no anchor handling of its own -- the source has no
    // href/anchor logic at all -- so an in-page link would set the native
    // scroll position directly and jump the content instead of easing to it.
    const onClick = event => {
      if (event.defaultPrevented || event.button !== 0) return
      // Leave "open in a new tab" and friends to the browser.
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

      const link = event.target.closest?.('a[href^="#"]')
      if (!link) return

      const hash = link.getAttribute('href')
      if (!hash || hash === '#') return

      // getElementById rather than querySelector: an id is not required to be
      // a valid CSS selector, and a stray character would throw here.
      const target = document.getElementById(hash.slice(1))
      if (!target) return

      event.preventDefault()
      smoother.scrollTo(target, true, `top ${HEADER_OFFSET}px`)
      // Keep the address bar and the back button in step with the plain
      // anchor behaviour this is standing in for.
      history.pushState(null, '', hash)
    }

    document.addEventListener('click', onClick)

    return () => {
      document.removeEventListener('click', onClick)
      smoother.kill()
      html.style.scrollBehavior = previousBehavior
    }
  }, [])
}

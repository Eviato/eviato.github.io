import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0)
      return
    }

    // React renders the target after the browser's own load-time fragment
    // scroll would have already happened, so do it ourselves.
    const target = document.getElementById(hash.slice(1))
    target?.scrollIntoView()
  }, [pathname, hash])

  return null
}

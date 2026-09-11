import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Terminal, Menu, X } from 'lucide-react'

const LINKS = [
  { href: '/#services', label: 'Services' },
  { href: '/#stack', label: 'Stack' },
  { href: '/#about', label: 'About' },
  { to: '/blog', label: 'Blog' },
]

function NavLink({ link, className, onClick }) {
  if (link.to) {
    return (
      <Link to={link.to} className={className} onClick={onClick}>
        {link.label}
      </Link>
    )
  }
  return (
    <a href={link.href} className={className} onClick={onClick}>
      {link.label}
    </a>
  )
}

export default function Nav() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-bg/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="flex size-8 items-center justify-center rounded-md border border-border bg-surface text-accent">
            <Terminal size={16} strokeWidth={2.25} />
          </span>
          <span className="font-mono text-[15px]">dawtio</span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-muted md:flex">
          {LINKS.map((link) => (
            <NavLink key={link.label} link={link} className="transition hover:text-ink" />
          ))}
        </nav>

        <a
          href="/#contact"
          className="hidden rounded-md bg-ink px-4 py-2 text-sm font-medium text-bg transition hover:bg-accent md:inline-block"
        >
          Get in touch
        </a>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="text-ink md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-border bg-bg px-6 py-4 text-sm md:hidden">
          {LINKS.map((link) => (
            <NavLink
              key={link.label}
              link={link}
              className="py-2 text-muted hover:text-ink"
              onClick={() => setOpen(false)}
            />
          ))}
          <a
            href="/#contact"
            className="mt-2 rounded-md bg-ink px-4 py-2 text-center font-medium text-bg"
            onClick={() => setOpen(false)}
          >
            Get in touch
          </a>
        </nav>
      )}
    </header>
  )
}

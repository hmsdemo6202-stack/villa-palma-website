'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_LINKS = [
  { href: '/',           label: 'Home' },
  { href: '/rooms',      label: 'Rooms' },
  { href: '/restaurant', label: 'Dining' },
  { href: '/gallery',    label: 'Gallery' },
  { href: '/promotions', label: 'Promos' },
  { href: '/about',      label: 'About' },
  { href: '/contact',    label: 'Contact' },
]

export default function SiteNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  function isActive(href: string) {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <header style={{ backgroundColor: '#1a0e08' }} className="sticky top-0 z-50 border-b border-[#2d1c14]">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between py-4">

        {/* Logo */}
        <Link
          href="/"
          className="font-serif text-sm tracking-[0.22em] uppercase font-bold hover:opacity-80 transition-opacity shrink-0"
          style={{ color: '#f5ede4', letterSpacing: '0.22em' }}
        >
          Cabalum Hotel
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-7">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-[11px] uppercase tracking-[0.18em] transition-colors relative pb-0.5"
              style={{
                color: isActive(href) ? '#c9a96e' : '#7a5a4a',
                borderBottom: isActive(href) ? '1px solid #c9a96e' : '1px solid transparent',
              }}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* CTAs */}
        <div className="hidden lg:flex items-center gap-4 shrink-0">
          <Link
            href="/rooms"
            className="text-[10px] font-bold uppercase tracking-[0.2em] px-5 py-2.5 hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#c9a96e', color: '#1a0e08' }}
          >
            Book Now
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(v => !v)}
          className="lg:hidden p-1.5"
          style={{ color: '#7a5a4a' }}
          aria-label="Toggle menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden border-t px-6 py-6" style={{ backgroundColor: '#110a05', borderColor: '#2d1c14' }}>
          <nav className="grid grid-cols-2 gap-y-4 gap-x-4 mb-6">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="text-[11px] uppercase tracking-[0.18em] py-1"
                style={{ color: isActive(href) ? '#c9a96e' : '#7a5a4a' }}
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="pt-4 flex gap-4 items-center" style={{ borderTop: '1px solid #2d1c14' }}>
            <Link
              href="/rooms"
              onClick={() => setOpen(false)}
              className="text-[10px] font-bold uppercase tracking-[0.2em] px-5 py-2.5"
              style={{ backgroundColor: '#c9a96e', color: '#1a0e08' }}
            >
              Book Now
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}

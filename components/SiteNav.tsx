'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

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
  const [open,      setOpen]      = useState(false)
  const [user,      setUser]      = useState<{ email: string; name: string } | null>(null)
  const [dropdown,  setDropdown]  = useState(false)
  const dropRef                    = useRef<HTMLDivElement>(null)
  const pathname                   = usePathname()
  const router                     = useRouter()
  const supabase                   = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user: u } }) => {
      if (u) {
        const name = u.user_metadata?.full_name ?? u.email?.split('@')[0] ?? 'Guest'
        setUser({ email: u.email ?? '', name })
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_ev, session) => {
      const u = session?.user
      if (u) {
        const name = u.user_metadata?.full_name ?? u.email?.split('@')[0] ?? 'Guest'
        setUser({ email: u.email ?? '', name })
      } else {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setDropdown(false)
      }
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  async function signOut() {
    await supabase.auth.signOut()
    setDropdown(false)
    router.push('/')
  }

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
              className={`text-[11px] uppercase tracking-[0.18em] transition-colors relative pb-0.5 hover:text-[#c9a96e] ${isActive(href) ? '' : 'hover:opacity-100'}`}
              style={{
                color: isActive(href) ? '#c9a96e' : '#b09080',
                borderBottom: isActive(href) ? '1px solid #c9a96e' : '1px solid transparent',
              }}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Auth + CTA */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          {user ? (
            <div ref={dropRef} className="relative">
              <button
                onClick={() => setDropdown(v => !v)}
                className="flex items-center gap-2 text-[10px] uppercase tracking-[0.15em] px-3 py-2 rounded-lg transition-colors"
                style={{ color: '#c9a96e', border: '1px solid #2d1c14' }}
              >
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold"
                  style={{ backgroundColor: '#b85c38', color: '#fff' }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </span>
                <span className="max-w-[100px] truncate">{user.name}</span>
                <svg className="w-3 h-3 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {dropdown && (
                <div
                  className="absolute right-0 top-full mt-1 w-52 rounded-xl shadow-lg border overflow-hidden"
                  style={{ backgroundColor: '#1a0e08', borderColor: '#2d1c14' }}
                >
                  <div className="px-4 py-3" style={{ borderBottom: '1px solid #2d1c14' }}>
                    <p className="text-[9px] uppercase tracking-widest" style={{ color: '#7a5a4a' }}>Signed in as</p>
                    <p className="text-xs font-medium truncate mt-0.5" style={{ color: '#c9a96e' }}>{user.email}</p>
                  </div>
                  <div className="py-1">
                    <Link
                      href="/account"
                      onClick={() => setDropdown(false)}
                      className="block px-4 py-2.5 text-[11px] uppercase tracking-widest transition-colors hover:opacity-80"
                      style={{ color: '#f5ede4' }}
                    >
                      My Account
                    </Link>
                    <button
                      onClick={signOut}
                      className="block w-full text-left px-4 py-2.5 text-[11px] uppercase tracking-widest transition-colors hover:opacity-80"
                      style={{ color: '#ef4444' }}
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="text-[10px] uppercase tracking-[0.2em] px-4 py-2.5 transition-colors hover:opacity-80"
                style={{ color: '#c9a96e' }}
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-2.5 rounded-lg transition-opacity hover:opacity-90"
                style={{ backgroundColor: '#2d1c14', color: '#c9a96e', border: '1px solid #3d2a1c' }}
              >
                Register
              </Link>
            </>
          )}
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
          <div className="pt-4 flex flex-wrap gap-3 items-center" style={{ borderTop: '1px solid #2d1c14' }}>
            {user ? (
              <>
                <span className="text-[10px] uppercase tracking-widest" style={{ color: '#7a5a4a' }}>
                  Hi, {user.name}
                </span>
                <Link
                  href="/account"
                  onClick={() => setOpen(false)}
                  className="text-[10px] uppercase tracking-[0.15em] px-4 py-2"
                  style={{ color: '#c9a96e' }}
                >
                  My Account
                </Link>
                <button
                  onClick={() => { setOpen(false); signOut() }}
                  className="text-[10px] uppercase tracking-[0.15em] px-4 py-2"
                  style={{ color: '#ef4444' }}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="text-[10px] uppercase tracking-[0.15em] px-4 py-2"
                  style={{ color: '#c9a96e' }}
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setOpen(false)}
                  className="text-[10px] uppercase tracking-[0.15em] px-4 py-2 rounded-lg"
                  style={{ color: '#c9a96e', border: '1px solid #3d2a1c', backgroundColor: '#2d1c14' }}
                >
                  Register
                </Link>
              </>
            )}
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

'use client'
import { useState } from 'react'
import Link from 'next/link'

const PORTAL_URL = process.env.NEXT_PUBLIC_PORTAL_URL ?? ''

export default function SiteNav() {
  const [open, setOpen] = useState(false)

  return (
    <header className="bg-[#2d1c14] sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between py-4">
        {/* Logo */}
        <Link href="/" className="font-serif text-sm tracking-[0.2em] text-[#f0e0d0] uppercase font-bold hover:text-white transition-colors">
          Cabalum Hotel
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm text-[#8a6a5a] hover:text-[#c8a898] transition-colors">Home</Link>
          <Link href="/rooms" className="text-sm text-[#8a6a5a] hover:text-[#c8a898] transition-colors">Rooms</Link>
          <Link href="/#experience" className="text-sm text-[#8a6a5a] hover:text-[#c8a898] transition-colors">Dining</Link>
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <a href={`${PORTAL_URL}/guest/login`}
            className="text-sm text-[#8a6a5a] hover:text-[#c8a898] transition-colors">
            Sign In
          </a>
          <Link href="/signup"
            className="text-sm bg-terra text-white px-4 py-2 rounded-lg hover:bg-terra-dark transition-colors font-medium">
            Book Now
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button onClick={() => setOpen(v => !v)} className="md:hidden text-[#8a6a5a] hover:text-[#c8a898]">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[#1e1209] border-t border-[#3d2418] px-6 py-4 space-y-3">
          <Link href="/" onClick={() => setOpen(false)} className="block text-sm text-[#c8a898] py-1">Home</Link>
          <Link href="/rooms" onClick={() => setOpen(false)} className="block text-sm text-[#c8a898] py-1">Rooms</Link>
          <Link href="/#experience" onClick={() => setOpen(false)} className="block text-sm text-[#c8a898] py-1">Dining</Link>
          <div className="pt-2 border-t border-[#3d2418] flex gap-3">
            <a href={`${PORTAL_URL}/guest/login`} className="text-sm text-[#8a6a5a] py-1">Sign In</a>
            <Link href="/signup" onClick={() => setOpen(false)} className="text-sm bg-terra text-white px-4 py-1.5 rounded-lg">Book Now</Link>
          </div>
        </div>
      )}
    </header>
  )
}

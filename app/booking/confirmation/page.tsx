'use client'
import { Suspense, useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import SiteNav from '@/components/SiteNav'
import Footer from '@/components/Footer'
import Link from 'next/link'

type Reservation = {
  id: string
  check_in_date: string
  check_out_date: string
  nights: number
  total_amount: number | null
  status: string
  special_requests: string | null
  guests: { full_name: string; email: string; phone: string | null } | null
  rooms: { room_number: string; room_types: { name: string } | null } | null
}

function fmtDate(iso: string) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-PH', {
    month: 'long', day: 'numeric', year: 'numeric',
  })
}

function ConfirmationContent() {
  const sp = useSearchParams()
  const id = sp.get('id') ?? ''
  const [res, setRes] = useState<Reservation | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!id) { setNotFound(true); setLoading(false); return }
    createClient()
      .from('reservations')
      .select('id, check_in_date, check_out_date, nights, total_amount, status, special_requests, guests(full_name, email, phone), rooms(room_number, room_types(name))')
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) setNotFound(true)
        else setRes(data as unknown as Reservation)
        setLoading(false)
      })
  }, [id])

  const ref = id ? id.split('-')[0].toUpperCase() : '—'

  if (loading) return (
    <>
      <SiteNav />
      <div className="min-h-[60vh] flex items-center justify-center text-[#9d8075] text-sm">
        Loading your confirmation…
      </div>
      <Footer />
    </>
  )

  if (notFound || !res) return (
    <>
      <SiteNav />
      <div className="min-h-[60vh] flex items-center justify-center text-center px-6">
        <div>
          <p className="text-5xl mb-4">❓</p>
          <h1 className="font-serif text-3xl text-[#1a0e08] mb-2">Reservation Not Found</h1>
          <p className="text-[#7a5c4f] mb-6">This reservation doesn&apos;t exist or may have expired.</p>
          <Link href="/rooms"
            style={{ backgroundColor: '#c9a96e', color: '#1a0e08' }}
            className="inline-block px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] hover:opacity-90 transition-opacity">
            Browse Rooms
          </Link>
        </div>
      </div>
      <Footer />
    </>
  )

  return (
    <>
      <SiteNav />

      {/* Success banner */}
      <section style={{ backgroundColor: '#1a3a2a' }} className="py-20 px-6 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-5"
          style={{ border: '1.5px solid #6aaa8a', color: '#6aaa8a' }}>
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-[10px] uppercase tracking-[0.4em] mb-3" style={{ color: '#6aaa8a' }}>Inquiry Received</p>
        <h1 className="font-serif text-5xl mb-4" style={{ color: '#f0ede4' }}>Thank You!</h1>
        <p className="text-sm max-w-md mx-auto" style={{ color: '#a8c8b8', lineHeight: '1.8' }}>
          Your reservation inquiry has been submitted. We&apos;ll confirm your booking within 24 hours by phone or email.
        </p>
      </section>

      <main className="py-12 px-6">
        <div className="max-w-2xl mx-auto space-y-8">

          {/* Reference number */}
          <div className="text-center bg-[#faf6f0] border border-warm-border rounded-2xl p-8">
            <p className="text-[10px] uppercase tracking-widest text-[#9d8075] mb-3">Booking Reference</p>
            <p className="font-mono text-4xl font-bold text-[#1a0e08] tracking-[0.15em]">{ref}</p>
            <p className="text-xs text-[#9d8075] mt-3">
              Please save this reference number and present it at the front desk upon arrival.
            </p>
          </div>

          {/* Details card */}
          <div className="bg-white border border-warm-border rounded-2xl p-6 space-y-5">
            <h2 className="font-serif text-xl text-[#1a0e08]">Reservation Details</h2>
            <div style={{ width: '32px', height: '1px', backgroundColor: '#c9a96e' }} />

            <div className="grid grid-cols-2 gap-5 text-sm">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[#9d8075] mb-1">Guest Name</p>
                <p className="font-medium text-[#1a0e08]">{res.guests?.full_name ?? '—'}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[#9d8075] mb-1">Email</p>
                <p className="font-medium text-[#1a0e08] break-all">{res.guests?.email ?? '—'}</p>
              </div>
              {res.guests?.phone && (
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-[#9d8075] mb-1">Phone</p>
                  <p className="font-medium text-[#1a0e08]">{res.guests.phone}</p>
                </div>
              )}
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[#9d8075] mb-1">Room Type</p>
                <p className="font-medium text-[#1a0e08]">{res.rooms?.room_types?.name ?? '—'}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[#9d8075] mb-1">Room No.</p>
                <p className="font-medium text-[#1a0e08]">Room {res.rooms?.room_number ?? '—'}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[#9d8075] mb-1">Check-in</p>
                <p className="font-medium text-[#1a0e08]">{fmtDate(res.check_in_date)}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[#9d8075] mb-1">Check-out</p>
                <p className="font-medium text-[#1a0e08]">{fmtDate(res.check_out_date)}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[#9d8075] mb-1">Duration</p>
                <p className="font-medium text-[#1a0e08]">{res.nights} night{res.nights !== 1 ? 's' : ''}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[#9d8075] mb-1">Status</p>
                <span className="inline-block bg-violet-100 text-violet-700 text-xs px-2 py-0.5 rounded-full font-medium capitalize">
                  {res.status}
                </span>
              </div>
            </div>

            {res.total_amount != null && (
              <>
                <div style={{ height: '1px', backgroundColor: '#e8ddd5' }} />
                <div className="flex justify-between font-semibold text-[#1a0e08] text-sm">
                  <span>Estimated Total</span>
                  <span>₱{Number(res.total_amount).toLocaleString('en-PH', { minimumFractionDigits: 2 })}</span>
                </div>
              </>
            )}

            {res.special_requests && (
              <>
                <div style={{ height: '1px', backgroundColor: '#e8ddd5' }} />
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-[#9d8075] mb-2">Special Requests</p>
                  <p className="text-sm text-[#7a5c4f] leading-relaxed">{res.special_requests}</p>
                </div>
              </>
            )}
          </div>

          {/* Next steps */}
          <div className="bg-[#faf6f0] border border-warm-border rounded-2xl p-6 space-y-4">
            <h2 className="font-serif text-lg text-[#1a0e08]">What Happens Next</h2>
            <div style={{ width: '24px', height: '1px', backgroundColor: '#c9a96e' }} />
            <ol className="space-y-3">
              {[
                'Our team will review your inquiry and confirm room availability.',
                'You\'ll receive a confirmation call or email within 24 hours.',
                'A deposit may be required to secure your reservation.',
                'On arrival, present your reference number at the front desk.',
              ].map((step, i) => (
                <li key={i} className="flex gap-3 text-sm text-[#7a5c4f]">
                  <span className="shrink-0 font-semibold text-xs mt-0.5" style={{ color: '#c9a96e' }}>{i + 1}.</span>
                  <p>{step}</p>
                </li>
              ))}
            </ol>
          </div>

          {/* CTA row */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <Link href="/rooms"
              style={{ borderColor: 'rgba(201,169,110,0.5)', color: '#c9a96e' }}
              className="border text-center px-8 py-3 text-xs font-semibold uppercase tracking-[0.2em] hover:border-[#c9a96e] transition-colors">
              Browse More Rooms
            </Link>
            <Link href="/"
              style={{ backgroundColor: '#c9a96e', color: '#1a0e08' }}
              className="text-center px-8 py-3 text-xs font-bold uppercase tracking-[0.25em] hover:opacity-90 transition-opacity">
              Back to Home
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}

export default function BookingConfirmationPage() {
  return (
    <Suspense fallback={
      <>
        <SiteNav />
        <div className="min-h-[60vh] flex items-center justify-center text-[#9d8075] text-sm">
          Loading your confirmation…
        </div>
        <Footer />
      </>
    }>
      <ConfirmationContent />
    </Suspense>
  )
}

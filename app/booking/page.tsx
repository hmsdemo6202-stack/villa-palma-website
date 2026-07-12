'use client'
import { Suspense, useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import SiteNav from '@/components/SiteNav'
import Footer from '@/components/Footer'
import Link from 'next/link'

type RoomType = { id: string; name: string; base_price: number; capacity: number }

function fmtDate(iso: string) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })
}

function BookingContent() {
  const sp = useSearchParams()
  const router = useRouter()

  const roomTypeId  = sp.get('room_type_id') ?? ''
  const [checkIn,  setCheckIn]  = useState(sp.get('check_in')  ?? '')
  const [checkOut, setCheckOut] = useState(sp.get('check_out') ?? '')
  const adults   = parseInt(sp.get('adults')   ?? '1')
  const children = parseInt(sp.get('children') ?? '0')

  const [roomType, setRoomType] = useState<RoomType | null>(null)
  const [form, setForm] = useState({
    full_name: '', email: '', phone: '',
    arrival_time: '14:00',
    special_requests: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!roomTypeId) return
    createClient()
      .from('room_types')
      .select('id, name, base_price, capacity')
      .eq('id', roomTypeId)
      .single()
      .then(({ data }) => setRoomType(data as unknown as RoomType))
  }, [roomTypeId])

  function set(f: string, v: string) { setForm(x => ({ ...x, [f]: v })) }

  const today = new Date().toISOString().split('T')[0]

  function nights() {
    if (!checkIn || !checkOut) return 0
    return Math.max(1, Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.full_name.trim() || !form.email.trim()) { setError('Full name and email are required.'); return }
    if (!checkIn || !checkOut) { setError('Please select your check-in and check-out dates.'); return }
    if (checkOut <= checkIn) { setError('Check-out date must be after check-in.'); return }
    if (!roomTypeId) { setError('No room type selected. Please go back and choose a room.'); return }

    setSubmitting(true)
    setError(null)

    const supabase = createClient()

    // Upsert guest by email
    let guestId: string
    const { data: existing } = await supabase
      .from('guests')
      .select('id')
      .eq('email', form.email.trim())
      .maybeSingle()

    if (existing) {
      guestId = existing.id
    } else {
      const { data: newGuest, error: gErr } = await supabase
        .from('guests')
        .insert({ full_name: form.full_name.trim(), email: form.email.trim(), phone: form.phone.trim() || null })
        .select('id')
        .single()
      if (gErr || !newGuest) {
        setError('Could not save your information. Please try again.')
        setSubmitting(false)
        return
      }
      guestId = newGuest.id
    }

    // Find a room of this type
    const { data: roomRows } = await supabase
      .from('rooms')
      .select('id')
      .eq('room_type_id', roomTypeId)
      .limit(1)

    const roomId = roomRows?.[0]?.id
    if (!roomId) {
      setError('No rooms found for this type. Please contact us directly.')
      setSubmitting(false)
      return
    }

    // Create reservation inquiry
    const n = nights()
    const total = n * (roomType?.base_price ?? 0)
    const { data: res, error: resErr } = await supabase
      .from('reservations')
      .insert({
        guest_id: guestId,
        room_id: roomId,
        check_in_date: checkIn,
        check_out_date: checkOut,
        nights: n,
        total_amount: total,
        status: 'inquiry',
        special_requests: form.special_requests.trim() || null,
      })
      .select('id')
      .single()

    if (resErr || !res) {
      setError('Could not submit your reservation. Please try again.')
      setSubmitting(false)
      return
    }

    router.push(`/booking/confirmation?id=${res.id}`)
  }

  return (
    <>
      <SiteNav />

      <section className="bg-[#2d1c14] py-16 px-6 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-[#8a6a5a] mb-3">Make a Reservation</p>
        <h1 className="font-serif text-5xl text-[#f0e0d0]">Reserve a Room</h1>
        <div className="w-12 h-px bg-terra mx-auto mt-5" />
      </section>

      <main className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

            {/* Form */}
            <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-8">

              {/* Guest info */}
              <div className="space-y-1">
                <div style={{ width: '32px', height: '1px', backgroundColor: '#c9a96e' }} className="mb-4" />
                <h2 className="font-serif text-xl text-[#1a0e08] mb-5">Guest Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-[#9d8075] mb-1.5">Full Name *</label>
                    <input required value={form.full_name} onChange={e => set('full_name', e.target.value)}
                      placeholder="e.g. Maria Santos"
                      className="w-full border border-warm-border rounded-lg px-3 py-2.5 text-sm text-[#1a0e08] focus:outline-none focus:ring-2 focus:ring-terra" />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-[#9d8075] mb-1.5">Email Address *</label>
                    <input required type="email" value={form.email} onChange={e => set('email', e.target.value)}
                      placeholder="maria@example.com"
                      className="w-full border border-warm-border rounded-lg px-3 py-2.5 text-sm text-[#1a0e08] focus:outline-none focus:ring-2 focus:ring-terra" />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-[#9d8075] mb-1.5">Phone Number</label>
                    <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)}
                      placeholder="+63 9XX XXX XXXX"
                      className="w-full border border-warm-border rounded-lg px-3 py-2.5 text-sm text-[#1a0e08] focus:outline-none focus:ring-2 focus:ring-terra" />
                  </div>
                </div>
              </div>

              {/* Stay details */}
              <div className="space-y-1">
                <div style={{ width: '32px', height: '1px', backgroundColor: '#c9a96e' }} className="mb-4" />
                <h2 className="font-serif text-xl text-[#1a0e08] mb-5">Stay Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-[#9d8075] mb-1.5">Check-in Date *</label>
                    <input required type="date" min={today} value={checkIn} onChange={e => setCheckIn(e.target.value)}
                      className="w-full border border-warm-border rounded-lg px-3 py-2.5 text-sm text-[#1a0e08] focus:outline-none focus:ring-2 focus:ring-terra" />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-[#9d8075] mb-1.5">Check-out Date *</label>
                    <input required type="date" min={checkIn || today} value={checkOut} onChange={e => setCheckOut(e.target.value)}
                      className="w-full border border-warm-border rounded-lg px-3 py-2.5 text-sm text-[#1a0e08] focus:outline-none focus:ring-2 focus:ring-terra" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] uppercase tracking-widest text-[#9d8075] mb-1.5">Estimated Arrival Time</label>
                    <input type="time" value={form.arrival_time} onChange={e => set('arrival_time', e.target.value)}
                      className="w-full border border-warm-border rounded-lg px-3 py-2.5 text-sm text-[#1a0e08] focus:outline-none focus:ring-2 focus:ring-terra" />
                  </div>
                </div>
              </div>

              {/* Special requests */}
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-[#9d8075] mb-1.5">Special Requests</label>
                <textarea rows={3} value={form.special_requests} onChange={e => set('special_requests', e.target.value)}
                  placeholder="Early check-in, extra pillows, dietary needs…"
                  className="w-full border border-warm-border rounded-lg px-3 py-2.5 text-sm text-[#1a0e08] resize-none focus:outline-none focus:ring-2 focus:ring-terra" />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
              )}

              <div className="space-y-3">
                <button type="submit" disabled={submitting}
                  style={{ backgroundColor: '#c9a96e', color: '#1a0e08' }}
                  className="w-full py-4 text-xs font-bold uppercase tracking-[0.25em] hover:opacity-90 transition-opacity disabled:opacity-50">
                  {submitting ? 'Submitting…' : 'Submit Reservation Inquiry'}
                </button>
                <p className="text-[10px] text-[#9d8075] text-center">
                  Our team will confirm your booking within 24 hours.
                </p>
              </div>
            </form>

            {/* Summary sidebar */}
            <div className="lg:col-span-2">
              <div className="bg-[#faf6f0] border border-warm-border rounded-2xl p-6 space-y-5 lg:sticky lg:top-24">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-[#9d8075] mb-1">Your Selection</p>
                  <h3 className="font-serif text-xl text-[#1a0e08]">
                    {roomType?.name ?? <span className="text-[#9d8075] font-sans text-sm font-normal">Loading…</span>}
                  </h3>
                </div>
                <div style={{ height: '1px', backgroundColor: '#e8ddd5' }} />
                <div className="space-y-2.5 text-sm">
                  {checkIn && (
                    <div className="flex justify-between">
                      <span className="text-[#9d8075]">Check-in</span>
                      <span className="font-medium text-[#1a0e08]">{fmtDate(checkIn)}</span>
                    </div>
                  )}
                  {checkOut && (
                    <div className="flex justify-between">
                      <span className="text-[#9d8075]">Check-out</span>
                      <span className="font-medium text-[#1a0e08]">{fmtDate(checkOut)}</span>
                    </div>
                  )}
                  {nights() > 0 && (
                    <div className="flex justify-between">
                      <span className="text-[#9d8075]">Nights</span>
                      <span className="font-medium text-[#1a0e08]">{nights()}</span>
                    </div>
                  )}
                  {(adults + children) > 0 && (
                    <div className="flex justify-between">
                      <span className="text-[#9d8075]">Guests</span>
                      <span className="font-medium text-[#1a0e08]">
                        {adults} adult{adults !== 1 ? 's' : ''}
                        {children > 0 ? `, ${children} child${children !== 1 ? 'ren' : ''}` : ''}
                      </span>
                    </div>
                  )}
                </div>
                {roomType && nights() > 0 && (
                  <>
                    <div style={{ height: '1px', backgroundColor: '#e8ddd5' }} />
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between text-[#9d8075]">
                        <span>₱{roomType.base_price.toLocaleString('en-PH')} × {nights()} night{nights() !== 1 ? 's' : ''}</span>
                      </div>
                      <div className="flex justify-between font-semibold text-[#1a0e08]">
                        <span>Estimated Total</span>
                        <span>₱{(nights() * roomType.base_price).toLocaleString('en-PH')}</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-[#9d8075]">Final amount confirmed upon booking approval.</p>
                  </>
                )}
                <div style={{ height: '1px', backgroundColor: '#e8ddd5' }} />
                <Link href={roomTypeId ? `/rooms/${roomTypeId}` : '/rooms'}
                  className="block text-center text-xs text-terra hover:underline transition-colors">
                  ← Change room
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}

export default function BookingPage() {
  return (
    <Suspense fallback={
      <>
        <SiteNav />
        <div className="min-h-[60vh] flex items-center justify-center text-[#9d8075] text-sm">
          Loading booking form…
        </div>
        <Footer />
      </>
    }>
      <BookingContent />
    </Suspense>
  )
}

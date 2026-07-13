'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import SiteNav from '@/components/SiteNav'
import Footer from '@/components/Footer'

type Reservation = {
  id: string
  check_in_date: string
  check_out_date: string
  nights: number
  total_amount: number
  status: string
  special_requests: string | null
  rooms: { room_number: string; room_types: { name: string } | null } | null
}

const STATUS_LABEL: Record<string, string> = {
  inquiry:     'Inquiry',
  confirmed:   'Confirmed',
  checked_in:  'Checked In',
  checked_out: 'Checked Out',
  cancelled:   'Cancelled',
  no_show:     'No Show',
}

const STATUS_COLOR: Record<string, string> = {
  inquiry:     '#f59e0b',
  confirmed:   '#10b981',
  checked_in:  '#3b82f6',
  checked_out: '#6b7280',
  cancelled:   '#ef4444',
  no_show:     '#9ca3af',
}

function fmtDate(iso: string) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function AccountPage() {
  const router = useRouter()
  const supabase = createClient()

  const [name,         setName]         = useState('')
  const [email,        setEmail]        = useState('')
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading,      setLoading]      = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.replace('/login?redirect=/account')
        return
      }

      const name = user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? 'Guest'
      setName(name)
      setEmail(user.email ?? '')

      // Fetch reservations via guest record
      const { data: guest } = await supabase
        .from('guests')
        .select('id')
        .eq('profile_id', user.id)
        .maybeSingle()

      if (guest?.id) {
        const { data: res } = await supabase
          .from('reservations')
          .select('id, check_in_date, check_out_date, nights, total_amount, status, special_requests, rooms(room_number, room_types(name))')
          .eq('guest_id', guest.id)
          .order('check_in_date', { ascending: false })
          .limit(20)
        setReservations((res as unknown as Reservation[]) ?? [])
      }

      setLoading(false)
    }
    load()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function signOut() {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <>
        <SiteNav />
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-terra border-t-transparent rounded-full animate-spin" />
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <SiteNav />

      <section className="bg-[#2d1c14] py-16 px-6 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-[#8a6a5a] mb-3">Your Account</p>
        <h1 className="font-serif text-5xl text-[#f0e0d0]">Welcome, {name.split(' ')[0]}</h1>
        <div className="w-12 h-px bg-terra mx-auto mt-5" />
      </section>

      <main className="py-12 px-6">
        <div className="max-w-3xl mx-auto space-y-10">

          {/* Profile card */}
          <div className="bg-[#faf6f0] border border-warm-border rounded-2xl p-6 flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold"
                style={{ backgroundColor: '#b85c38', color: '#fff' }}>
                {name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-[#1a0e08]">{name}</p>
                <p className="text-sm text-[#9d8075]">{email}</p>
              </div>
            </div>
            <button
              onClick={signOut}
              className="text-xs uppercase tracking-widest px-4 py-2 rounded-lg border transition-colors hover:bg-red-50"
              style={{ color: '#ef4444', borderColor: '#fecaca' }}
            >
              Sign Out
            </button>
          </div>

          {/* Reservations */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div style={{ width: '24px', height: '1px', backgroundColor: '#c9a96e' }} />
              <h2 className="font-serif text-2xl text-[#1a0e08]">My Reservations</h2>
            </div>

            {reservations.length === 0 ? (
              <div className="text-center py-16 border border-warm-border rounded-2xl bg-[#faf6f0]">
                <p className="text-3xl mb-4">🛎</p>
                <p className="font-serif text-xl text-[#1a0e08] mb-2">No reservations yet</p>
                <p className="text-sm text-[#9d8075] mb-6">Book a room and your reservation will appear here.</p>
                <Link
                  href="/rooms"
                  className="inline-block bg-terra text-white px-8 py-3 rounded-lg text-sm font-medium hover:bg-terra-dark transition-colors"
                >
                  Browse Rooms
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {reservations.map(r => (
                  <div key={r.id} className="border border-warm-border rounded-2xl p-5 bg-white">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <p className="font-semibold text-[#1a0e08]">
                          {(r.rooms?.room_types?.name) ?? 'Room'} — Room {r.rooms?.room_number ?? '—'}
                        </p>
                        <p className="text-xs text-[#9d8075] mt-0.5">
                          {fmtDate(r.check_in_date)} → {fmtDate(r.check_out_date)} · {r.nights} night{r.nights !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <span
                        className="text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full"
                        style={{
                          backgroundColor: (STATUS_COLOR[r.status] ?? '#9ca3af') + '20',
                          color: STATUS_COLOR[r.status] ?? '#9ca3af',
                        }}
                      >
                        {STATUS_LABEL[r.status] ?? r.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#9d8075]">
                        Total: <span className="font-semibold text-[#1a0e08]">₱{r.total_amount?.toLocaleString('en-PH') ?? '—'}</span>
                      </span>
                      {r.special_requests && (
                        <span className="text-[10px] text-[#9d8075] italic truncate max-w-[200px]">"{r.special_requests}"</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/rooms"
              className="flex items-center gap-3 p-5 border border-warm-border rounded-2xl hover:border-terra transition-colors group">
              <span className="text-2xl">🛏</span>
              <div>
                <p className="font-medium text-[#1a0e08] group-hover:text-terra transition-colors">Book a Room</p>
                <p className="text-xs text-[#9d8075]">Browse available room types</p>
              </div>
            </Link>
            <Link href="/contact"
              className="flex items-center gap-3 p-5 border border-warm-border rounded-2xl hover:border-terra transition-colors group">
              <span className="text-2xl">💬</span>
              <div>
                <p className="font-medium text-[#1a0e08] group-hover:text-terra transition-colors">Contact Us</p>
                <p className="text-xs text-[#9d8075]">Questions or special requests</p>
              </div>
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </>
  )
}

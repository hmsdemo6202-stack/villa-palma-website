'use client'
import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import GuestCounter from './GuestCounter'

interface RoomType {
  id: string
  name: string
  description: string
  base_price: number
  capacity: number
}

interface AvailableRoom {
  id: string
  room_number: string
  floor: number
  room_types: RoomType
}

export default function AvailabilitySection() {
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [adults, setAdults] = useState(1)
  const [children, setChildren] = useState(0)
  const [rooms, setRooms] = useState<AvailableRoom[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  async function search() {
    if (!checkIn || !checkOut) return
    setLoading(true)
    setSearched(true)
    const supabase = createClient()

    const { data: conflicts } = await supabase
      .from('reservations')
      .select('room_id')
      .not('status', 'in', '("cancelled","no_show")')
      .lt('check_in_date', checkOut)
      .gt('check_out_date', checkIn)

    const bookedIds = (conflicts ?? []).map((r: { room_id: string }) => r.room_id)

    let query = supabase
      .from('rooms')
      .select('id, room_number, floor, room_types!inner(id, name, description, base_price, capacity)')
      .eq('status', 'available')
      .gte('room_types.capacity', adults + children)

    if (bookedIds.length > 0) query = query.not('id', 'in', `(${bookedIds.join(',')})`)

    const { data } = await query.order('room_number')
    setRooms((data as unknown as AvailableRoom[]) ?? [])
    setLoading(false)
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <section id="availability" className="py-24 px-6" style={{ backgroundColor: '#1a0e08' }}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-[10px] uppercase tracking-[0.4em] mb-4" style={{ color: '#c9a96e' }}>Check Availability</p>
          <h2 className="font-serif text-4xl" style={{ color: '#f5ede4' }}>Find Your Room</h2>
          <div className="mx-auto mt-6 w-10" style={{ height: '1px', backgroundColor: 'rgba(201,169,110,0.5)' }} />
        </div>

        {/* Search form */}
        <div className="border p-8" style={{ borderColor: 'rgba(201,169,110,0.25)', backgroundColor: 'rgba(255,255,255,0.03)' }}>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.25em] mb-2" style={{ color: '#c9a96e' }}>Check-in</label>
              <input
                type="date"
                min={today}
                value={checkIn}
                onChange={e => setCheckIn(e.target.value)}
                className="w-full px-4 py-3 text-sm focus:outline-none"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(201,169,110,0.25)',
                  color: checkIn ? '#f5ede4' : '#5a4a3a',
                  colorScheme: 'dark',
                }}
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-[0.25em] mb-2" style={{ color: '#c9a96e' }}>Check-out</label>
              <input
                type="date"
                min={checkIn || today}
                value={checkOut}
                onChange={e => setCheckOut(e.target.value)}
                className="w-full px-4 py-3 text-sm focus:outline-none"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(201,169,110,0.25)',
                  color: checkOut ? '#f5ede4' : '#5a4a3a',
                  colorScheme: 'dark',
                }}
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-[0.25em] mb-2" style={{ color: '#c9a96e' }}>Guests</label>
              <GuestCounter
                adults={adults}
                childCount={children}
                onAdultsChange={setAdults}
                onChildCountChange={setChildren}
                variant="dark"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={search}
                disabled={!checkIn || !checkOut || loading}
                className="w-full py-3 text-[10px] font-bold uppercase tracking-[0.25em] hover:opacity-90 transition-opacity disabled:opacity-40"
                style={{ backgroundColor: '#c9a96e', color: '#1a0e08' }}
              >
                {loading ? 'Searching…' : 'Search'}
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        {searched && !loading && rooms !== null && (
          <div className="mt-10">
            {rooms.length === 0 ? (
              <p className="text-center py-10 text-sm" style={{ color: '#7a5a4a' }}>
                No rooms available for those dates. Try different dates.
              </p>
            ) : (
              <>
                <p className="text-sm mb-6" style={{ color: '#7a5a4a' }}>
                  {rooms.length} room{rooms.length !== 1 ? 's' : ''} available
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px" style={{ backgroundColor: 'rgba(201,169,110,0.15)' }}>
                  {rooms.map(room => (
                    <div
                      key={room.id}
                      className="p-6"
                      style={{ backgroundColor: '#1a0e08' }}
                    >
                      <p className="text-[9px] uppercase tracking-[0.3em] mb-2" style={{ color: '#c9a96e' }}>
                        Up to {room.room_types.capacity} guests
                      </p>
                      <p className="font-serif text-lg mb-1" style={{ color: '#f5ede4' }}>{room.room_types.name}</p>
                      <p className="text-[11px] mb-3" style={{ color: '#7a5a4a' }}>Room {room.room_number} · Floor {room.floor}</p>
                      <p className="text-xs leading-relaxed mb-4 line-clamp-2" style={{ color: '#5a4a3a' }}>
                        {room.room_types.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[10px]" style={{ color: 'rgba(201,169,110,0.6)' }}>from</p>
                          <p className="font-semibold" style={{ color: '#ffffff' }}>
                            ₱{room.room_types.base_price.toLocaleString('en-PH')}
                            <span className="text-xs font-normal ml-1" style={{ color: '#7a5a4a' }}>/night</span>
                          </p>
                        </div>
                        <Link
                          href="/signup"
                          className="text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-2 hover:opacity-90 transition-opacity"
                          style={{ backgroundColor: '#c9a96e', color: '#1a0e08' }}
                        >
                          Book
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const PORTAL_URL = process.env.NEXT_PUBLIC_PORTAL_URL ?? ''

interface RoomType {
  id: string
  name: string
  description: string
  price_per_night: number
  max_guests: number
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
  const [guests, setGuests] = useState(1)
  const [rooms, setRooms] = useState<AvailableRoom[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  async function search() {
    if (!checkIn || !checkOut) return
    setLoading(true)
    setSearched(true)
    const supabase = createClient()

    // Get rooms already booked for these dates
    const { data: conflicts } = await supabase
      .from('room_reservations')
      .select('room_id')
      .neq('status', 'cancelled')
      .lt('check_in', checkOut)
      .gt('check_out', checkIn)

    const bookedIds = (conflicts ?? []).map((r: { room_id: string }) => r.room_id)

    let query = supabase
      .from('rooms')
      .select('id, room_number, floor, room_types!inner(id, name, description, price_per_night, max_guests)')
      .eq('status', 'available')
      .gte('room_types.max_guests', guests)

    if (bookedIds.length > 0) query = query.not('id', 'in', `(${bookedIds.join(',')})`)

    const { data } = await query.order('room_number')
    setRooms((data as unknown as AvailableRoom[]) ?? [])
    setLoading(false)
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <section id="availability" className="py-20 px-6 bg-[#f5ede4]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-widest text-terra mb-2">Check Availability</p>
          <h2 className="font-serif text-3xl text-brown">Find Your Room</h2>
        </div>

        {/* Search bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-warm-border p-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-brown-light mb-1.5">Check-in</label>
              <input type="date" min={today} value={checkIn}
                onChange={e => setCheckIn(e.target.value)}
                className="w-full border border-warm-border rounded-lg px-3 py-2 text-sm text-brown focus:outline-none focus:ring-2 focus:ring-terra" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-brown-light mb-1.5">Check-out</label>
              <input type="date" min={checkIn || today} value={checkOut}
                onChange={e => setCheckOut(e.target.value)}
                className="w-full border border-warm-border rounded-lg px-3 py-2 text-sm text-brown focus:outline-none focus:ring-2 focus:ring-terra" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-brown-light mb-1.5">Guests</label>
              <select value={guests} onChange={e => setGuests(Number(e.target.value))}
                className="w-full border border-warm-border rounded-lg px-3 py-2 text-sm text-brown focus:outline-none focus:ring-2 focus:ring-terra">
                {[1,2,3,4].map(n => <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>)}
              </select>
            </div>
            <div className="flex items-end">
              <button onClick={search} disabled={!checkIn || !checkOut || loading}
                className="w-full bg-terra text-white rounded-lg py-2.5 text-sm font-medium hover:bg-terra-dark transition-colors disabled:opacity-50">
                {loading ? 'Searching…' : 'Search'}
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        {searched && !loading && rooms !== null && (
          <div className="mt-8">
            {rooms.length === 0 ? (
              <p className="text-center text-brown-mid py-10">No rooms available for those dates. Try different dates.</p>
            ) : (
              <>
                <p className="text-sm text-brown-mid mb-4">{rooms.length} room{rooms.length !== 1 ? 's' : ''} available</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {rooms.map(room => (
                    <div key={room.id} className="bg-white rounded-xl border border-warm-border p-5 hover:border-terra transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium text-brown text-sm">{room.room_types.name}</p>
                          <p className="text-xs text-brown-light">Room {room.room_number} · Floor {room.floor}</p>
                        </div>
                        <span className="text-xs bg-terra-light text-terra px-2 py-0.5 rounded-full">
                          Up to {room.room_types.max_guests} guests
                        </span>
                      </div>
                      <p className="text-xs text-brown-mid mb-3 line-clamp-2">{room.room_types.description}</p>
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-brown">
                          ₱{room.room_types.price_per_night.toLocaleString('en-PH')}
                          <span className="text-xs text-brown-light font-normal"> /night</span>
                        </p>
                        <a href={`${PORTAL_URL}/rooms/${room.id}/book?checkIn=${checkIn}&checkOut=${checkOut}`}
                          className="text-xs bg-terra text-white px-3 py-1.5 rounded-lg hover:bg-terra-dark transition-colors">
                          Book Now
                        </a>
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

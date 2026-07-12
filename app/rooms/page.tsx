'use client'
import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import SiteNav from '@/components/SiteNav'
import Footer from '@/components/Footer'
import RoomGalleryModal, { GalleryPhoto } from '@/components/RoomGalleryModal'
import GuestCounter from '@/components/GuestCounter'
import Link from 'next/link'

const ROOM_IMAGES: Record<string, string> = {
  'Single Room':         'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=600&q=80',
  'Double Room':         'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80',
  'Triple Room':         'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=600&q=80',
  'Double-Double Room':  'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=600&q=80',
  'Family Room De Luxe': 'https://images.unsplash.com/photo-1568495248636-6432b97bd949?auto=format&fit=crop&w=600&q=80',
  'Family Suite':        'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=600&q=80',
  'Penthouse Suite':     'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=600&q=80',
  'Presidential Suite':  'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=600&q=80',
}

const FALLBACK = 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=600&q=80'

interface RoomType {
  id: string
  name: string
  description: string
  base_price: number
  capacity: number
  room_type_images: GalleryPhoto[]
}

interface Room {
  id: string
  room_number: string
  floor: number
  status: string
  room_types: RoomType
}

export default function RoomsPage() {
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [adults, setAdults] = useState(1)
  const [children, setChildren] = useState(0)
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)
  const [searched, setSearched] = useState(false)
  const [gallery, setGallery] = useState<RoomType | null>(null)

  const loadAllRooms = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()
    const { data } = await supabase
      .from('rooms')
      .select('id, room_number, floor, status, room_types!inner(id, name, description, base_price, capacity, room_type_images(id, image_url, alt_text, sort_order))')
      .eq('status', 'available')
      .order('room_number')
    setRooms((data as unknown as Room[]) ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { loadAllRooms() }, [loadAllRooms])

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
      .select('id, room_number, floor, status, room_types!inner(id, name, description, base_price, capacity, room_type_images(id, image_url, alt_text, sort_order))')
      .eq('status', 'available')
      .gte('room_types.capacity', adults + children)

    if (bookedIds.length > 0) query = query.not('id', 'in', `(${bookedIds.join(',')})`)

    const { data } = await query.order('room_number')
    setRooms((data as unknown as Room[]) ?? [])
    setLoading(false)
  }

  function clearSearch() {
    setCheckIn('')
    setCheckOut('')
    setAdults(1)
    setChildren(0)
    setSearched(false)
    loadAllRooms()
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <>
      <SiteNav />

      {/* Page header */}
      <section className="bg-[#2d1c14] py-16 px-6 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-[#8a6a5a] mb-3">Accommodations</p>
        <h1 className="font-serif text-5xl text-[#f0e0d0]">Our Rooms</h1>
        <div className="w-12 h-px bg-terra mx-auto mt-5" />
      </section>

      {/* Search bar */}
      <div className="bg-[#f5ede4] border-b border-warm-border px-6 py-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 items-end">
            <div>
              <label className="block text-xs uppercase tracking-widest text-brown-light mb-1.5">Check-in</label>
              <input type="date" min={today} value={checkIn}
                onChange={e => setCheckIn(e.target.value)}
                className="w-full border border-warm-border rounded-lg px-3 py-2 text-sm text-brown focus:outline-none focus:ring-2 focus:ring-terra bg-white" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-brown-light mb-1.5">Check-out</label>
              <input type="date" min={checkIn || today} value={checkOut}
                onChange={e => setCheckOut(e.target.value)}
                className="w-full border border-warm-border rounded-lg px-3 py-2 text-sm text-brown focus:outline-none focus:ring-2 focus:ring-terra bg-white" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-brown-light mb-1.5">Guests</label>
              <GuestCounter
                adults={adults}
                childCount={children}
                onAdultsChange={setAdults}
                onChildCountChange={setChildren}
                variant="light"
              />
            </div>
            <div>
              <button onClick={search} disabled={!checkIn || !checkOut || loading}
                className="w-full bg-terra text-white rounded-lg py-2.5 text-sm font-medium hover:bg-terra-dark transition-colors disabled:opacity-50">
                Check Availability
              </button>
            </div>
            <div>
              {searched && (
                <button onClick={clearSearch} className="w-full border border-warm-border text-brown-mid rounded-lg py-2.5 text-sm hover:bg-white transition-colors">
                  Show All
                </button>
              )}
            </div>
          </div>
          {searched && !loading && (
            <p className="text-sm text-brown-mid mt-3">
              {rooms.length} room{rooms.length !== 1 ? 's' : ''} available for your dates
            </p>
          )}
        </div>
      </div>

      {/* Room grid */}
      <main className="py-12 px-6">
        <div className="max-w-5xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-warm-border overflow-hidden animate-pulse">
                  <div className="h-48 bg-cream-dark" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-cream-dark rounded w-3/4" />
                    <div className="h-3 bg-cream-dark rounded w-1/2" />
                    <div className="h-3 bg-cream-dark rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : rooms.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-brown-mid text-lg mb-2">No rooms found</p>
              <p className="text-brown-light text-sm">Try adjusting your dates or guest count.</p>
              {searched && (
                <button onClick={clearSearch} className="mt-4 text-terra text-sm hover:underline">Clear search</button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map(room => (
                <div key={room.id} className="bg-white rounded-2xl border border-warm-border overflow-hidden hover:border-terra transition-colors group">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={room.room_types.room_type_images?.[0]?.image_url ?? ROOM_IMAGES[room.room_types.name] ?? FALLBACK}
                      alt={room.room_types.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute bottom-3 left-3 text-xs text-white bg-[#00000055] backdrop-blur-sm px-2 py-1 rounded-full">
                      Floor {room.floor}
                    </span>
                    {room.room_types.room_type_images?.length > 0 && (
                      <button
                        onClick={() => setGallery(room.room_types)}
                        className="absolute bottom-3 right-3 text-xs text-white bg-[#00000055] backdrop-blur-sm px-3 py-1 rounded-full hover:bg-[#00000088] transition-colors"
                      >
                        📷 View Photos ({room.room_types.room_type_images.length})
                      </button>
                    )}
                  </div>

                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-serif text-base text-brown">{room.room_types.name}</h3>
                        <p className="text-xs text-brown-light">Room {room.room_number}</p>
                      </div>
                      <span className="text-xs bg-terra-light text-terra px-2 py-0.5 rounded-full border border-[#f0c8a0]">
                        ≤ {room.room_types.capacity} guests
                      </span>
                    </div>

                    <p className="text-xs text-brown-mid mb-4 line-clamp-2 leading-relaxed">
                      {room.room_types.description}
                    </p>

                    <div className="flex items-center justify-between pt-3 border-t border-warm-border">
                      <div>
                        <p className="text-xs text-brown-light">per night</p>
                        <p className="font-semibold text-brown text-sm">
                          ₱{room.room_types.base_price.toLocaleString('en-PH')}
                        </p>
                      </div>
                      <Link
                        href="/signup"
                        className="bg-terra text-white text-xs px-4 py-2 rounded-lg hover:bg-terra-dark transition-colors font-medium">
                        Book Now
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />

      {gallery && (
        <RoomGalleryModal
          photos={[...gallery.room_type_images].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))}
          roomTypeName={gallery.name}
          onClose={() => setGallery(null)}
        />
      )}
    </>
  )
}

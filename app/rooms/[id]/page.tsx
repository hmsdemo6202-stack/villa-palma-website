'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import SiteNav from '@/components/SiteNav'
import Footer from '@/components/Footer'
import RoomGalleryModal, { GalleryPhoto } from '@/components/RoomGalleryModal'
import Link from 'next/link'

const ROOM_IMAGES: Record<string, string> = {
  'Single Room':         'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80',
  'Double Room':         'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
  'Triple Room':         'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=1200&q=80',
  'Double-Double Room':  'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80',
  'Family Room De Luxe': 'https://images.unsplash.com/photo-1568495248636-6432b97bd949?auto=format&fit=crop&w=1200&q=80',
  'Family Suite':        'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80',
  'Penthouse Suite':     'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1200&q=80',
  'Presidential Suite':  'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80',
}
const FALLBACK = 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80'

const INCLUDED = [
  'Air Conditioning', 'Private Bathroom', 'Free Wi-Fi', 'Flat-screen TV',
  'Mini Refrigerator', 'Daily Housekeeping', 'Room Service', '24/7 Reception',
]

interface RoomType {
  id: string
  name: string
  description: string
  base_price: number
  capacity: number
  room_type_images: GalleryPhoto[]
}

export default function RoomDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [roomType, setRoomType] = useState<RoomType | null>(null)
  const [availableCount, setAvailableCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [galleryOpen, setGalleryOpen] = useState(false)
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')

  useEffect(() => {
    if (!id) return
    async function load() {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('room_types')
        .select('id, name, description, base_price, capacity, room_type_images(id, image_url, alt_text, sort_order)')
        .eq('id', id)
        .single()
      if (error || !data) { setNotFound(true); setLoading(false); return }
      setRoomType(data as unknown as RoomType)

      const { count } = await supabase
        .from('rooms')
        .select('*', { count: 'exact', head: true })
        .eq('room_type_id', id)
        .eq('status', 'available')
      setAvailableCount(count ?? 0)
      setLoading(false)
    }
    load()
  }, [id])

  const today = new Date().toISOString().split('T')[0]

  function nights() {
    if (!checkIn || !checkOut) return 0
    return Math.max(1, Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000))
  }

  function bookingHref() {
    const p = new URLSearchParams({ room_type_id: String(id) })
    if (checkIn) p.set('check_in', checkIn)
    if (checkOut) p.set('check_out', checkOut)
    return `/booking?${p.toString()}`
  }

  if (loading) return (
    <>
      <SiteNav />
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-pulse w-full max-w-3xl px-6 space-y-4">
          <div className="h-72 bg-[#e8ddd5] rounded-2xl" />
          <div className="h-6 bg-[#e8ddd5] rounded w-1/2" />
          <div className="h-4 bg-[#e8ddd5] rounded w-3/4" />
        </div>
      </div>
      <Footer />
    </>
  )

  if (notFound || !roomType) return (
    <>
      <SiteNav />
      <div className="min-h-[60vh] flex items-center justify-center text-center px-6">
        <div>
          <p className="text-5xl mb-4">🏨</p>
          <h1 className="font-serif text-3xl text-[#1a0e08] mb-2">Room Not Found</h1>
          <p className="text-[#7a5c4f] mb-6">This room type doesn&apos;t exist or may have been removed.</p>
          <Link href="/rooms"
            style={{ backgroundColor: '#c9a96e', color: '#1a0e08' }}
            className="inline-block px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] hover:opacity-90 transition-opacity">
            View All Rooms
          </Link>
        </div>
      </div>
      <Footer />
    </>
  )

  const sortedImages = [...roomType.room_type_images].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
  const heroImage = sortedImages[0]?.image_url ?? ROOM_IMAGES[roomType.name] ?? FALLBACK

  return (
    <>
      <SiteNav />

      {/* Hero */}
      <div className="relative h-[55vh] overflow-hidden">
        <img src={heroImage} alt={roomType.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(26,14,8,0.25) 0%, rgba(26,14,8,0.75) 100%)' }} />
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-10 max-w-5xl mx-auto w-full">
          <p className="text-[10px] uppercase tracking-[0.35em] mb-2" style={{ color: '#c9a96e' }}>Accommodations</p>
          <h1 className="font-serif text-5xl leading-tight" style={{ color: '#f5ede4' }}>{roomType.name}</h1>
          {sortedImages.length > 0 && (
            <button onClick={() => setGalleryOpen(true)}
              className="mt-4 text-xs text-white bg-[#00000066] backdrop-blur-sm px-4 py-2 rounded-full hover:bg-[#00000099] transition-colors">
              📷 View All Photos ({sortedImages.length})
            </button>
          )}
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-[#faf6f0] border-b border-warm-border px-6 py-3">
        <div className="max-w-5xl mx-auto text-xs text-[#9d8075]">
          <Link href="/rooms" className="hover:text-terra transition-colors">Rooms</Link>
          <span className="mx-2">›</span>
          <span className="text-[#1a0e08]">{roomType.name}</span>
        </div>
      </div>

      <main className="py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

            {/* Left column */}
            <div className="lg:col-span-2 space-y-10">

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Max Guests', value: `${roomType.capacity} persons` },
                  { label: 'Rate', value: `₱${roomType.base_price.toLocaleString('en-PH')}/night` },
                  { label: 'Available', value: availableCount > 0 ? `${availableCount} room${availableCount !== 1 ? 's' : ''}` : 'Check dates' },
                ].map(s => (
                  <div key={s.label} className="bg-[#faf6f0] border border-warm-border rounded-xl p-4 text-center">
                    <p className="text-[10px] uppercase tracking-widest text-[#9d8075] mb-1">{s.label}</p>
                    <p className="font-semibold text-[#1a0e08] text-sm">{s.value}</p>
                  </div>
                ))}
              </div>

              {/* Description */}
              <div>
                <div style={{ width: '32px', height: '1px', backgroundColor: '#c9a96e' }} className="mb-4" />
                <h2 className="font-serif text-2xl text-[#1a0e08] mb-4">About This Room</h2>
                <p className="text-sm text-[#7a5c4f]" style={{ lineHeight: '1.9' }}>
                  {roomType.description || 'A beautifully appointed room designed for your comfort and relaxation at Cabalum Hotel.'}
                </p>
              </div>

              {/* Gallery grid */}
              {sortedImages.length > 1 && (
                <div>
                  <div style={{ width: '32px', height: '1px', backgroundColor: '#c9a96e' }} className="mb-4" />
                  <h2 className="font-serif text-2xl text-[#1a0e08] mb-5">Gallery</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {sortedImages.slice(0, 6).map((img, i) => (
                      <button key={img.id} onClick={() => setGalleryOpen(true)}
                        className="relative overflow-hidden rounded-xl group"
                        style={{ aspectRatio: '16/9' }}>
                        <img src={img.image_url} alt={img.alt_text ?? roomType.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        {i === 5 && sortedImages.length > 6 && (
                          <div className="absolute inset-0 bg-[#0000007a] flex items-center justify-center">
                            <span className="text-white text-sm font-medium">+{sortedImages.length - 6} more</span>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* What's included */}
              <div>
                <div style={{ width: '32px', height: '1px', backgroundColor: '#c9a96e' }} className="mb-4" />
                <h2 className="font-serif text-2xl text-[#1a0e08] mb-5">What&apos;s Included</h2>
                <div className="grid grid-cols-2 gap-3">
                  {INCLUDED.map(item => (
                    <div key={item} className="flex items-center gap-2 text-sm text-[#7a5c4f]">
                      <span className="text-xs font-bold" style={{ color: '#c9a96e' }}>✓</span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: booking card */}
            <div className="lg:sticky lg:top-24 self-start">
              <div className="bg-white border border-warm-border rounded-2xl p-6 space-y-5 shadow-sm">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-[#9d8075] mb-1">Starting from</p>
                  <p className="font-serif text-3xl text-[#1a0e08]">₱{roomType.base_price.toLocaleString('en-PH')}</p>
                  <p className="text-xs text-[#9d8075]">per night</p>
                </div>
                <div style={{ height: '1px', backgroundColor: '#e8ddd5' }} />
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-[#9d8075] mb-1.5">Check-in</label>
                    <input type="date" min={today} value={checkIn} onChange={e => setCheckIn(e.target.value)}
                      className="w-full border border-warm-border rounded-lg px-3 py-2 text-sm text-[#1a0e08] focus:outline-none focus:ring-2 focus:ring-terra" />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-[#9d8075] mb-1.5">Check-out</label>
                    <input type="date" min={checkIn || today} value={checkOut} onChange={e => setCheckOut(e.target.value)}
                      className="w-full border border-warm-border rounded-lg px-3 py-2 text-sm text-[#1a0e08] focus:outline-none focus:ring-2 focus:ring-terra" />
                  </div>
                </div>
                {checkIn && checkOut && nights() > 0 && (
                  <div className="bg-[#faf6f0] rounded-xl p-3 text-sm space-y-1">
                    <div className="flex justify-between text-[#7a5c4f]">
                      <span>{nights()} night{nights() !== 1 ? 's' : ''}</span>
                      <span>× ₱{roomType.base_price.toLocaleString('en-PH')}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-[#1a0e08] pt-1" style={{ borderTop: '1px solid #e8ddd5' }}>
                      <span>Estimated Total</span>
                      <span>₱{(nights() * roomType.base_price).toLocaleString('en-PH')}</span>
                    </div>
                  </div>
                )}
                <Link href={bookingHref()}
                  style={{ backgroundColor: '#c9a96e', color: '#1a0e08' }}
                  className="block w-full text-center py-3.5 text-xs font-bold uppercase tracking-[0.2em] hover:opacity-90 transition-opacity">
                  Reserve This Room
                </Link>
                <p className="text-[10px] text-[#9d8075] text-center">No payment required to make an inquiry</p>
                <div style={{ height: '1px', backgroundColor: '#e8ddd5' }} />
                <Link href="/rooms"
                  className="block text-center text-xs text-terra hover:underline transition-colors">
                  ← See all rooms
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {galleryOpen && sortedImages.length > 0 && (
        <RoomGalleryModal
          photos={sortedImages}
          roomTypeName={roomType.name}
          onClose={() => setGalleryOpen(false)}
        />
      )}
    </>
  )
}

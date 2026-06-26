import { createClient } from '@/lib/supabase/client'
import SiteNav from '@/components/SiteNav'
import Footer from '@/components/Footer'
import AvailabilitySection from '@/components/AvailabilitySection'
import Link from 'next/link'

const PORTAL_URL = process.env.NEXT_PUBLIC_PORTAL_URL ?? ''

const ROOM_IMAGES: Record<string, string> = {
  Single:   'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=600&q=80',
  Double:   'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80',
  Twin:     'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=600&q=80',
  Triple:   'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=600&q=80',
  Quadroom: 'https://images.unsplash.com/photo-1568495248636-6432b97bd949?auto=format&fit=crop&w=600&q=80',
  Executive:'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=600&q=80',
}

const FALLBACK = 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=600&q=80'

interface RoomType {
  id: string
  name: string
  description: string
  base_price: number
  capacity: number
}

async function getFeaturedRoomTypes(): Promise<RoomType[]> {
  try {
    const supabase = createClient()
    const { data } = await supabase
      .from('room_types')
      .select('id, name, description, base_price, capacity')
      .order('base_price')
      .limit(6)
    return (data as RoomType[]) ?? []
  } catch {
    return []
  }
}

export default async function HomePage() {
  const roomTypes = await getFeaturedRoomTypes()

  return (
    <>
      <SiteNav />

      {/* Hero */}
      <section className="relative bg-[#2d1c14] min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'repeating-linear-gradient(45deg, #ffffff 0px, #ffffff 1px, transparent 1px, transparent 16px)' }} />

        <div className="relative text-center px-6 py-24">
          <p className="text-xs uppercase tracking-[0.3em] text-[#8a6a5a] mb-6">Boutique Hotel · Manila</p>
          <h1 className="font-serif text-6xl md:text-8xl text-[#f0e0d0] mb-6 leading-tight">Cabalum Hotel</h1>
          <div className="w-16 h-px bg-terra mx-auto mb-6" />
          <p className="text-[#9d8075] text-lg max-w-md mx-auto mb-10 leading-relaxed">
            Where every stay becomes a story worth telling. Experience boutique hospitality reimagined.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={`${PORTAL_URL}/signup`}
              className="bg-terra text-white px-8 py-3.5 rounded-lg text-sm font-medium hover:bg-terra-dark transition-colors">
              Reserve Your Stay
            </a>
            <Link href="/rooms"
              className="border border-[#5a3a2a] text-[#c8a898] px-8 py-3.5 rounded-lg text-sm font-medium hover:border-[#8a6a5a] transition-colors">
              Browse Rooms
            </Link>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="bg-[#f5ede4] border-y border-warm-border">
        <div className="max-w-4xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: '20', label: 'Boutique Rooms' },
            { value: '6', label: 'Room Categories' },
            { value: '₱2,500', label: 'Starting Rate' },
            { value: '5★', label: 'Guest Rating' },
          ].map(s => (
            <div key={s.label}>
              <p className="font-serif text-3xl text-brown mb-1">{s.value}</p>
              <p className="text-xs uppercase tracking-widest text-brown-light">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured rooms */}
      {roomTypes.length > 0 && (
        <section className="py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-xs uppercase tracking-widest text-terra mb-2">Accommodations</p>
              <h2 className="font-serif text-4xl text-brown">Our Rooms</h2>
              <div className="w-10 h-px bg-terra mx-auto mt-4" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {roomTypes.map(rt => (
                <div key={rt.id} className="bg-white rounded-2xl border border-warm-border overflow-hidden group hover:border-terra transition-colors">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={ROOM_IMAGES[rt.name] ?? FALLBACK}
                      alt={rt.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-serif text-lg text-brown">{rt.name}</h3>
                      <span className="text-xs text-brown-light border border-warm-border rounded-full px-2 py-0.5">
                        ≤ {rt.capacity} guests
                      </span>
                    </div>
                    <p className="text-sm text-brown-mid mb-4 line-clamp-2">{rt.description}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-brown-light">from</p>
                        <p className="font-semibold text-brown">₱{rt.base_price.toLocaleString('en-PH')}<span className="text-xs text-brown-light font-normal">/night</span></p>
                      </div>
                      <Link href="/rooms" className="text-xs text-terra hover:text-terra-dark font-medium transition-colors">View rooms →</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link href="/rooms" className="inline-block border border-terra text-terra px-8 py-3 rounded-lg text-sm hover:bg-terra hover:text-white transition-colors">
                View All Rooms
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Availability checker */}
      <AvailabilitySection />

      {/* Experience */}
      <section id="experience" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs uppercase tracking-widest text-terra mb-2">The Cabalum Hotel Experience</p>
            <h2 className="font-serif text-4xl text-brown">More Than a Stay</h2>
            <div className="w-10 h-px bg-terra mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '🍽️',
                title: 'In-House Dining',
                desc: 'Savor Filipino and international cuisine crafted by our resident chef — from light brunches to intimate dinner service.',
              },
              {
                icon: '🛎️',
                title: 'Attentive Service',
                desc: 'Our staff is available around the clock to ensure your every need is met with warmth and efficiency.',
              },
              {
                icon: '🌿',
                title: 'Curated Comfort',
                desc: 'Each room is furnished with thoughtful details — premium linens, local art, and natural light.',
              },
            ].map(exp => (
              <div key={exp.title} className="text-center">
                <div className="text-4xl mb-4">{exp.icon}</div>
                <h3 className="font-serif text-xl text-brown mb-3">{exp.title}</h3>
                <div className="w-8 h-px bg-terra mx-auto mb-3" />
                <p className="text-sm text-brown-mid leading-relaxed">{exp.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="bg-[#2d1c14] py-16 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs uppercase tracking-widest text-[#8a6a5a] mb-3">Ready to Book?</p>
          <h2 className="font-serif text-4xl text-[#f0e0d0] mb-5">Your room awaits.</h2>
          <p className="text-[#9d8075] mb-8 text-sm leading-relaxed">
            Create a guest account to browse room availability, make reservations, and order from our restaurant — all in one place.
          </p>
          <a href={`${PORTAL_URL}/signup`}
            className="inline-block bg-terra text-white px-10 py-3.5 rounded-lg text-sm font-medium hover:bg-terra-dark transition-colors">
            Get Started — It&apos;s Free
          </a>
        </div>
      </section>

      <Footer />
    </>
  )
}

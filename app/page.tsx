import { createClient } from '@/lib/supabase/client'
import SiteNav from '@/components/SiteNav'
import Footer from '@/components/Footer'
import AvailabilitySection from '@/components/AvailabilitySection'
import Link from 'next/link'

const ROOM_IMAGES: Record<string, string> = {
  'Single Room':         'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80',
  'Double Room':         'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
  'Triple Room':         'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=800&q=80',
  'Double-Double Room':  'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80',
  'Family Room De Luxe': 'https://images.unsplash.com/photo-1568495248636-6432b97bd949?auto=format&fit=crop&w=800&q=80',
  'Family Suite':        'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80',
  'Penthouse Suite':     'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=800&q=80',
  'Presidential Suite':  'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=800&q=80',
}

const FALLBACK = 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80'

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

      {/* ── Hero ── */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
        {/* Background photo */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1600&q=80)' }}
        />
        {/* Layered gradient overlay */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(26,14,8,0.75) 0%, rgba(26,14,8,0.45) 50%, rgba(26,14,8,0.82) 100%)' }} />

        {/* Content */}
        <div className="relative z-10 text-center px-6 py-32 max-w-3xl mx-auto">
          <p className="text-[10px] uppercase tracking-[0.45em] mb-8" style={{ color: '#c9a96e' }}>
            Boutique Hotel · Iloilo City, Philippines
          </p>
          <h1 className="font-serif text-7xl md:text-[100px] leading-none tracking-tight mb-3" style={{ color: '#f5ede4' }}>
            Cabalum
          </h1>
          <p className="font-serif text-xl md:text-2xl italic mb-10" style={{ color: '#c8a898' }}>
            Hotel &amp; Suites
          </p>
          <div className="mx-auto mb-10 w-14" style={{ height: '1px', backgroundColor: '#c9a96e' }} />
          <p className="text-base leading-relaxed max-w-sm mx-auto mb-12" style={{ color: '#a89080' }}>
            Where every stay becomes a story worth telling. Boutique hospitality in the heart of Iloilo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/signup"
              style={{ backgroundColor: '#c9a96e', color: '#1a0e08' }}
              className="px-10 py-4 text-xs font-bold uppercase tracking-[0.25em] hover:opacity-90 transition-opacity"
            >
              Reserve Your Stay
            </Link>
            <Link
              href="/rooms"
              style={{ borderColor: 'rgba(201,169,110,0.5)', color: '#c9a96e' }}
              className="border px-10 py-4 text-xs font-semibold uppercase tracking-[0.25em] hover:border-[#c9a96e] transition-colors"
            >
              Explore Rooms
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2" style={{ color: 'rgba(201,169,110,0.55)' }}>
          <span className="text-[9px] uppercase tracking-[0.3em]">Scroll</span>
          <div style={{ width: '1px', height: '32px', background: 'linear-gradient(to bottom, rgba(201,169,110,0.55), transparent)' }} />
        </div>
      </section>

      {/* ── Stats strip ── */}
      <section className="bg-white border-y border-warm-border">
        <div className="max-w-4xl mx-auto px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {[
              { value: '9',    label: 'Boutique Rooms' },
              { value: '8',    label: 'Room Categories' },
              { value: '₱799', label: 'Starting Rate /night' },
              { value: '5★',   label: 'Guest Rating' },
            ].map((s, i) => (
              <div key={s.label} className="text-center px-4 py-4 relative">
                {i > 0 && (
                  <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-10"
                    style={{ width: '1px', backgroundColor: '#e8ddd5' }}
                  />
                )}
                <p className="font-serif text-4xl mb-1.5" style={{ color: '#1a0e08' }}>{s.value}</p>
                <p className="text-[10px] uppercase tracking-[0.2em]" style={{ color: '#9d8075' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Rooms ── */}
      {roomTypes.length > 0 && (
        <section className="py-24 px-6 bg-[#faf6f0]">
          <div className="max-w-6xl mx-auto">
            {/* Section header */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.4em] mb-3" style={{ color: '#c9a96e' }}>Accommodations</p>
                <h2 className="font-serif text-5xl" style={{ color: '#1a0e08' }}>Our Rooms</h2>
              </div>
              <Link
                href="/rooms"
                className="text-xs uppercase tracking-[0.2em] hover:opacity-70 transition-opacity self-start md:self-auto pb-0.5"
                style={{ color: '#b85c38', borderBottom: '1px solid #b85c38' }}
              >
                View All Rooms
              </Link>
            </div>

            {/* Image-dominant cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
              {roomTypes.map(rt => (
                <Link
                  key={rt.id}
                  href="/rooms"
                  className="group relative block overflow-hidden"
                  style={{ height: '320px' }}
                >
                  {/* Photo */}
                  <img
                    src={ROOM_IMAGES[rt.name] ?? FALLBACK}
                    alt={rt.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Gradient */}
                  <div
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(to top, rgba(26,14,8,0.92) 0%, rgba(26,14,8,0.35) 55%, transparent 100%)' }}
                  />
                  {/* Text overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="text-[9px] uppercase tracking-[0.3em] mb-1.5" style={{ color: '#c9a96e' }}>
                      Up to {rt.capacity} guests
                    </p>
                    <h3 className="font-serif text-xl mb-3" style={{ color: '#f5ede4' }}>{rt.name}</h3>
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-[10px]" style={{ color: 'rgba(201,169,110,0.65)' }}>from</p>
                        <p className="text-lg font-semibold" style={{ color: '#ffffff' }}>
                          ₱{rt.base_price.toLocaleString('en-PH')}
                          <span className="text-xs font-normal ml-1" style={{ color: '#a89080' }}>/night</span>
                        </p>
                      </div>
                      <span
                        className="text-[10px] uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ color: '#c9a96e' }}
                      >
                        View →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Availability checker ── */}
      <AvailabilitySection />

      {/* ── Experience ── */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="mb-16">
            <p className="text-[10px] uppercase tracking-[0.4em] mb-4" style={{ color: '#c9a96e' }}>The Cabalum Experience</p>
            <h2 className="font-serif text-5xl" style={{ color: '#1a0e08' }}>More Than a Stay</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                title: 'In-House Dining',
                desc: 'Savor Filipino and international cuisine crafted by our resident chef — from light brunches to intimate dinner service.',
                link: '/restaurant',
              },
              {
                title: 'Attentive Service',
                desc: 'Our staff is available around the clock to ensure every need is met with warmth and genuine Filipino hospitality.',
                link: '/about',
              },
              {
                title: 'Curated Comfort',
                desc: 'Each room is furnished with thoughtful details — quality linens, natural light, and amenities chosen for your comfort.',
                link: '/rooms',
              },
            ].map(exp => (
              <div key={exp.title}>
                <div className="mb-6" style={{ width: '32px', height: '1px', backgroundColor: '#c9a96e' }} />
                <h3 className="font-serif text-2xl mb-4" style={{ color: '#1a0e08' }}>{exp.title}</h3>
                <p className="text-sm leading-relaxed mb-6" style={{ color: '#7a5c4f', lineHeight: '1.8' }}>{exp.desc}</p>
                <Link
                  href={exp.link}
                  className="text-[10px] uppercase tracking-[0.25em] hover:opacity-70 transition-opacity"
                  style={{ color: '#b85c38' }}
                >
                  Discover more →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="relative py-28 px-6 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80)' }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, rgba(26,14,8,0.88) 0%, rgba(45,28,20,0.80) 100%)' }}
        />
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <p className="text-[10px] uppercase tracking-[0.4em] mb-4" style={{ color: '#c9a96e' }}>Ready to Book?</p>
          <h2 className="font-serif text-5xl mb-6 leading-tight" style={{ color: '#f5ede4' }}>
            Your room awaits.
          </h2>
          <div className="mx-auto mb-8 w-10" style={{ height: '1px', backgroundColor: '#c9a96e' }} />
          <p className="text-sm leading-relaxed mb-10" style={{ color: '#a89080' }}>
            Create a guest account to browse availability, make reservations, and order from our restaurant — all in one place.
          </p>
          <Link
            href="/signup"
            style={{ backgroundColor: '#c9a96e', color: '#1a0e08' }}
            className="inline-block px-12 py-4 text-xs font-bold uppercase tracking-[0.25em] hover:opacity-90 transition-opacity"
          >
            Get Started — It&apos;s Free
          </Link>
        </div>
      </section>

      <Footer />
    </>
  )
}

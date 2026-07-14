'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

const HERO_FALLBACK = 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1600&q=80'

interface Slide { id: string; image_url: string; title: string | null; subtitle: string | null }

export default function HeroCarousel() {
  const [slides,  setSlides]  = useState<Slide[]>([])
  const [current, setCurrent] = useState(0)
  const [ready,   setReady]   = useState(false)

  useEffect(() => {
    createClient()
      .from('hero_slides')
      .select('id, image_url, title, subtitle')
      .eq('is_active', true)
      .order('sort_order')
      .then(({ data }) => {
        const rows = (data as Slide[]) ?? []
        setSlides(rows.length > 0 ? rows : [{ id: 'fallback', image_url: HERO_FALLBACK, title: null, subtitle: null }])
        setReady(true)
      })
  }, [])

  const next = useCallback(() => setCurrent(i => (i + 1) % slides.length), [slides.length])
  const prev = () => setCurrent(i => (i - 1 + slides.length) % slides.length)

  useEffect(() => {
    if (slides.length <= 1) return
    const t = setInterval(next, 5000)
    return () => clearInterval(t)
  }, [next, slides.length])

  if (!ready) return (
    <section className="relative min-h-[92vh] flex items-center justify-center" style={{ backgroundColor: '#1a0e08' }} />
  )
  if (slides.length === 0) return null

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">

      {/* Background slides — stacked, fade via opacity */}
      {slides.map((s, i) => (
        <div
          key={s.id}
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
          style={{ backgroundImage: `url(${s.image_url})`, opacity: i === current ? 1 : 0 }}
        />
      ))}

      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to bottom, rgba(26,14,8,0.75) 0%, rgba(26,14,8,0.45) 50%, rgba(26,14,8,0.82) 100%)' }}
      />

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
          {slides[current]?.subtitle ?? 'Where every stay becomes a story worth telling. Boutique hospitality in the heart of Iloilo.'}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/rooms"
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

      {/* Prev / Next arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-full transition-colors"
            style={{ backgroundColor: 'rgba(26,14,8,0.45)', color: '#c9a96e', border: '1px solid rgba(201,169,110,0.3)' }}
            aria-label="Previous slide"
          >
            ‹
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-full transition-colors"
            style={{ backgroundColor: 'rgba(26,14,8,0.45)', color: '#c9a96e', border: '1px solid rgba(201,169,110,0.3)' }}
            aria-label="Next slide"
          >
            ›
          </button>
        </>
      )}

      {/* Dot indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="h-1.5 rounded-full transition-all duration-300"
              style={{
                width: i === current ? 24 : 6,
                backgroundColor: i === current ? '#c9a96e' : 'rgba(255,255,255,0.35)',
              }}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2" style={{ color: 'rgba(201,169,110,0.55)' }}>
        <span className="text-[9px] uppercase tracking-[0.3em]">Scroll</span>
        <div style={{ width: '1px', height: '32px', background: 'linear-gradient(to bottom, rgba(201,169,110,0.55), transparent)' }} />
      </div>
    </section>
  )
}

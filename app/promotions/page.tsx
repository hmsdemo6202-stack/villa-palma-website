import { createClient } from '@/lib/supabase/client'
import SiteNav from '@/components/SiteNav'
import Footer from '@/components/Footer'
import Link from 'next/link'

interface Promotion {
  id: string
  title: string
  description: string | null
  discount_pct: number | null
  promo_code: string | null
  valid_from: string | null
  valid_until: string | null
  image_url: string | null
}

async function getPromotions(): Promise<Promotion[]> {
  try {
    const supabase = createClient()
    const today = new Date().toISOString().split('T')[0]
    const { data } = await supabase
      .from('promotions')
      .select('id, title, description, discount_pct, promo_code, valid_from, valid_until, image_url')
      .eq('is_active', true)
      .or(`valid_until.is.null,valid_until.gte.${today}`)
      .order('created_at', { ascending: false })
    return (data as Promotion[]) ?? []
  } catch {
    return []
  }
}

function fmtDate(d: string | null) {
  if (!d) return null
  return new Date(d + 'T00:00:00').toLocaleDateString('en-PH', { month: 'long', day: 'numeric', year: 'numeric' })
}

export default async function PromotionsPage() {
  const promos = await getPromotions()

  return (
    <>
      <SiteNav />

      {/* Page header */}
      <section className="bg-[#2d1c14] py-16 px-6 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-[#8a6a5a] mb-3">Special Offers</p>
        <h1 className="font-serif text-5xl text-[#f0e0d0]">Promotions</h1>
        <div className="w-12 h-px bg-terra mx-auto mt-5" />
        <p className="text-[#9d8075] text-sm mt-4 max-w-md mx-auto">
          Exclusive deals and seasonal packages from Cabalum Hotel. More value, same warm hospitality.
        </p>
      </section>

      {/* Promos */}
      <main className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          {promos.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-5xl mb-5">🏷️</p>
              <p className="font-serif text-2xl text-brown mb-3">No Active Promotions</p>
              <p className="text-sm text-brown-mid mb-6 max-w-sm mx-auto">
                We don&apos;t have a running promotion right now. Check back soon — we regularly offer seasonal deals and special packages.
              </p>
              <Link href="/signup"
                className="inline-block bg-terra text-white px-8 py-3 rounded-lg text-sm font-medium hover:bg-terra-dark transition-colors">
                Book at Regular Rate
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {promos.map(p => (
                <div key={p.id} className="bg-white rounded-2xl border border-warm-border overflow-hidden group hover:border-terra transition-colors">
                  {p.image_url ? (
                    <div className="h-44 overflow-hidden">
                      <img src={p.image_url} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  ) : (
                    <div className="h-20 bg-[#f5ede4] flex items-center justify-center">
                      <span className="text-3xl">🏷️</span>
                    </div>
                  )}
                  <div className="p-6">
                    {p.discount_pct && (
                      <span className="inline-block bg-terra text-white text-xs font-bold px-2.5 py-1 rounded-full mb-3">
                        {p.discount_pct}% OFF
                      </span>
                    )}
                    <h3 className="font-serif text-xl text-brown mb-2">{p.title}</h3>
                    {p.description && (
                      <p className="text-sm text-brown-mid leading-relaxed mb-4">{p.description}</p>
                    )}
                    {p.promo_code && (
                      <div className="bg-[#f5ede4] border border-[#e8ddd5] rounded-lg px-4 py-2.5 mb-4 flex items-center justify-between">
                        <span className="text-xs text-brown-light uppercase tracking-widest">Promo Code</span>
                        <span className="font-mono font-bold text-terra text-sm">{p.promo_code}</span>
                      </div>
                    )}
                    {(p.valid_from || p.valid_until) && (
                      <p className="text-xs text-brown-light mb-4">
                        Valid:{' '}
                        {p.valid_from ? `${fmtDate(p.valid_from)} ` : ''}
                        {p.valid_from && p.valid_until ? '– ' : ''}
                        {p.valid_until ? fmtDate(p.valid_until) : 'No end date'}
                      </p>
                    )}
                    <Link href="/signup"
                      className="inline-block bg-terra text-white text-sm px-5 py-2 rounded-lg hover:bg-terra-dark transition-colors font-medium">
                      Book Now
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}

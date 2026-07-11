import { createClient } from '@/lib/supabase/client'
import SiteNav from '@/components/SiteNav'
import Footer from '@/components/Footer'

const PORTAL_URL = process.env.NEXT_PUBLIC_PORTAL_URL ?? ''

interface PosCategory { id: string; name: string }
interface PosItem {
  id: string
  name: string
  description: string | null
  price: number
  category_id: string | null
  image_url: string | null
}

async function getMenu(): Promise<{ categories: PosCategory[]; items: PosItem[] }> {
  try {
    const supabase = createClient()
    const [{ data: cats }, { data: itms }] = await Promise.all([
      supabase.from('pos_categories').select('id, name').order('sort_order').order('name'),
      supabase.from('pos_items').select('id, name, description, price, category_id, image_url').eq('is_available', true).order('name'),
    ])
    return { categories: (cats as PosCategory[]) ?? [], items: (itms as PosItem[]) ?? [] }
  } catch {
    return { categories: [], items: [] }
  }
}

const MEAL_PERIODS = [
  { icon: '☕', label: 'Breakfast', hours: '6:00 AM – 10:00 AM' },
  { icon: '🍱', label: 'Lunch', hours: '11:30 AM – 2:00 PM' },
  { icon: '🍽️', label: 'Dinner', hours: '6:00 PM – 10:00 PM' },
  { icon: '🛎️', label: 'Room Service', hours: 'Available daily' },
]

export default async function RestaurantPage() {
  const { categories, items } = await getMenu()

  const itemsByCategory: Record<string, PosItem[]> = {}
  const uncategorized: PosItem[] = []
  for (const item of items) {
    if (item.category_id) {
      if (!itemsByCategory[item.category_id]) itemsByCategory[item.category_id] = []
      itemsByCategory[item.category_id].push(item)
    } else {
      uncategorized.push(item)
    }
  }

  const displayCategories = [
    ...categories.filter(c => itemsByCategory[c.id]?.length > 0),
    ...(uncategorized.length > 0 ? [{ id: '__other', name: 'Other' }] : []),
  ]

  return (
    <>
      <SiteNav />

      {/* Hero */}
      <section className="bg-[#2d1c14] py-16 px-6 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-[#8a6a5a] mb-3">In-House Dining</p>
        <h1 className="font-serif text-5xl text-[#f0e0d0]">Restaurant</h1>
        <div className="w-12 h-px bg-terra mx-auto mt-5" />
        <p className="text-[#9d8075] text-sm mt-4 max-w-md mx-auto">
          Filipino comfort food and international favorites, served fresh from our kitchen — every day at Cabalum Hotel.
        </p>
      </section>

      {/* Meal periods */}
      <section className="bg-[#f5ede4] border-b border-warm-border py-8 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {MEAL_PERIODS.map(p => (
            <div key={p.label} className="bg-white rounded-xl border border-warm-border p-4">
              <div className="text-2xl mb-2">{p.icon}</div>
              <p className="font-medium text-brown text-sm">{p.label}</p>
              <p className="text-xs text-brown-light mt-1">{p.hours}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Menu */}
      <main className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          {items.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-4xl mb-4">🍽️</p>
              <p className="font-serif text-2xl text-brown mb-2">Menu Coming Soon</p>
              <p className="text-sm text-brown-mid">Our restaurant team is preparing the digital menu. Please contact the front desk for today&apos;s offerings.</p>
            </div>
          ) : (
            <div className="space-y-14">
              {displayCategories.map(cat => {
                const catItems = cat.id === '__other' ? uncategorized : (itemsByCategory[cat.id] ?? [])
                return (
                  <div key={cat.id}>
                    <div className="flex items-center gap-4 mb-6">
                      <h2 className="font-serif text-2xl text-brown">{cat.name}</h2>
                      <div className="flex-1 h-px bg-warm-border" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {catItems.map(item => (
                        <div key={item.id} className="flex gap-4 bg-white border border-warm-border rounded-xl p-4">
                          {item.image_url && (
                            <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
                              <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start gap-2">
                              <h3 className="font-medium text-brown text-sm leading-snug">{item.name}</h3>
                              <span className="shrink-0 font-semibold text-brown text-sm whitespace-nowrap">
                                ₱{Number(item.price).toLocaleString('en-PH')}
                              </span>
                            </div>
                            {item.description && (
                              <p className="text-xs text-brown-light mt-1 leading-relaxed line-clamp-2">{item.description}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>

      {/* Room service CTA */}
      <section className="bg-[#2d1c14] py-14 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs uppercase tracking-widest text-[#8a6a5a] mb-3">Dine In Your Room</p>
          <h2 className="font-serif text-3xl text-[#f0e0d0] mb-4">Room Service Available</h2>
          <p className="text-[#9d8075] text-sm mb-6 leading-relaxed">
            Prefer to eat in the comfort of your room? Order directly through our guest app or call the front desk.
          </p>
          <a href={`${PORTAL_URL}/signup`}
            className="inline-block bg-terra text-white px-8 py-3 rounded-lg text-sm font-medium hover:bg-terra-dark transition-colors">
            Order via Guest App
          </a>
        </div>
      </section>

      <Footer />
    </>
  )
}

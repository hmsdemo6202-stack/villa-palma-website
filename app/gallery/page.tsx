export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/client'
import SiteNav from '@/components/SiteNav'
import Footer from '@/components/Footer'
import GalleryGrid from '@/components/GalleryGrid'

interface GalleryItem {
  id: string
  title: string | null
  description: string | null
  image_url: string
  category: string
}

const FALLBACK_GALLERY: GalleryItem[] = [
  { id: '1', title: 'Hotel Lobby', description: 'A warm welcome from the moment you arrive', image_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80', category: 'Lobby' },
  { id: '2', title: 'Single Room', description: 'Cozy and comfortable for solo travelers', image_url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80', category: 'Rooms' },
  { id: '3', title: 'Double Room', description: 'Spacious room with queen-size comfort', image_url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80', category: 'Rooms' },
  { id: '4', title: 'Family Suite', description: 'Room for the whole family to spread out', image_url: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80', category: 'Rooms' },
  { id: '5', title: 'Presidential Suite', description: 'The pinnacle of comfort and luxury', image_url: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=800&q=80', category: 'Rooms' },
  { id: '6', title: 'In-House Restaurant', description: 'Filipino and international cuisine, all day', image_url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80', category: 'Dining' },
  { id: '7', title: 'Dining Area', description: 'Relax and enjoy your meal in a warm setting', image_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80', category: 'Dining' },
  { id: '8', title: 'Penthouse View', description: 'Panoramic views of Iloilo City', image_url: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=800&q=80', category: 'Rooms' },
]

async function getGalleryItems(): Promise<{ items: GalleryItem[]; isFallback: boolean }> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('gallery_items')
      .select('id, title, description, image_url, category')
      .eq('is_active', true)
      .order('sort_order')
      .order('created_at')
    if (error || !data || data.length === 0) return { items: FALLBACK_GALLERY, isFallback: true }
    return { items: data as GalleryItem[], isFallback: false }
  } catch {
    return { items: FALLBACK_GALLERY, isFallback: true }
  }
}

export default async function GalleryPage() {
  const { items } = await getGalleryItems()

  return (
    <>
      <SiteNav />

      {/* Page header */}
      <section className="bg-[#2d1c14] py-16 px-6 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-[#8a6a5a] mb-3">Photo Gallery</p>
        <h1 className="font-serif text-5xl text-[#f0e0d0]">Gallery</h1>
        <div className="w-12 h-px bg-terra mx-auto mt-5" />
        <p className="text-[#9d8075] text-sm mt-4 max-w-md mx-auto">A glimpse into the spaces, dining, and moments that make Cabalum Hotel special.</p>
      </section>

      {/* Gallery grid */}
      <main className="py-14 px-6">
        <div className="max-w-5xl mx-auto">
          <GalleryGrid items={items} />
        </div>
      </main>

      <Footer />
    </>
  )
}

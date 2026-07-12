'use client'
import { useState } from 'react'

interface GalleryItem {
  id: string
  title: string | null
  description: string | null
  image_url: string
  category: string
}

export default function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [category, setCategory] = useState('All')
  const categories = ['All', ...Array.from(new Set(items.map(i => i.category)))]
  const visible = category === 'All' ? items : items.filter(i => i.category === category)

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        {categories.map(c => (
          <button key={c} onClick={() => setCategory(c)}
            className={`text-xs px-4 py-1.5 rounded-full border transition-colors ${
              category === c ? 'bg-terra text-white border-terra' : 'border-warm-border text-brown-mid hover:border-terra bg-white'
            }`}>
            {c}
          </button>
        ))}
      </div>

      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
        {visible.map(item => (
          <div key={item.id} className="break-inside-avoid rounded-xl overflow-hidden border border-warm-border group">
            <div className="relative overflow-hidden bg-[#f5ede4]">
              <img
                src={item.image_url}
                alt={item.title ?? 'Hotel photo'}
                className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            {(item.title || item.description) && (
              <div className="bg-white px-4 py-3">
                {item.title && <p className="font-medium text-brown text-sm">{item.title}</p>}
                {item.description && <p className="text-xs text-brown-light mt-0.5">{item.description}</p>}
                <p className="text-[10px] text-terra uppercase tracking-widest mt-1">{item.category}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  )
}

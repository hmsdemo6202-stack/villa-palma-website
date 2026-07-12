import SiteNav from '@/components/SiteNav'
import Footer from '@/components/Footer'
import Link from 'next/link'

const AMENITIES = [
  {
    category: 'In-Room Amenities',
    icon: '🛏️',
    items: [
      'Individual air conditioning controls',
      'Flat-screen TV with cable channels',
      'Private en-suite bathroom',
      'Hot and cold shower',
      'Mini refrigerator',
      'Electric kettle with complimentary tea & coffee',
      'Premium toiletries set',
      'Hair dryer',
      'In-room safe',
      'Extra pillows and blankets on request',
    ],
  },
  {
    category: 'Connectivity',
    icon: '📶',
    items: [
      'Complimentary high-speed Wi-Fi throughout the hotel',
      'Work desk with quality lighting',
      'Ample power outlets and USB charging ports',
    ],
  },
  {
    category: 'Dining & F&B',
    icon: '🍽️',
    items: [
      'On-site restaurant — Filipino and international cuisine',
      'Breakfast service (6:30 AM – 10:00 AM)',
      'In-room dining available during restaurant hours',
      'Lobby coffee and snack bar',
      'Minibar snacks available for in-room purchase',
    ],
  },
  {
    category: 'Guest Services',
    icon: '🛎️',
    items: [
      '24-hour front desk and concierge',
      'Daily housekeeping service',
      'Laundry and garment pressing service',
      'Luggage storage',
      'Tour and activity assistance',
      'Transport arrangement (airport, city)',
      'Wake-up call service',
      'Printing and business corner',
    ],
  },
  {
    category: 'Facilities',
    icon: '🏨',
    items: [
      'Secure on-site parking area',
      'CCTV surveillance throughout the property',
      'Lobby seating and reception lounge',
      'Elevator access (select floors)',
    ],
  },
  {
    category: 'Health & Safety',
    icon: '🛡️',
    items: [
      'Smoke detectors in all rooms and common areas',
      'Fire extinguisher access points throughout the hotel',
      'First aid kit available at the front desk',
      'Regular sanitation and linen hygiene protocols',
    ],
  },
]

export default function AmenitiesPage() {
  return (
    <>
      <SiteNav />

      {/* Header */}
      <section className="bg-[#2d1c14] py-16 px-6 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-[#8a6a5a] mb-3">Hotel Amenities</p>
        <h1 className="font-serif text-5xl text-[#f0e0d0]">Everything You Need</h1>
        <div className="w-12 h-px bg-terra mx-auto mt-5" />
      </section>

      <main className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-[#7a5c4f] max-w-xl mx-auto mb-14 leading-relaxed">
            At Cabalum Hotel, every amenity is chosen with care to ensure your stay is comfortable, convenient, and truly memorable.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {AMENITIES.map(cat => (
              <div key={cat.category} className="bg-white border border-warm-border rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{cat.icon}</span>
                  <h2 className="font-serif text-xl text-[#1a0e08]">{cat.category}</h2>
                </div>
                <div style={{ height: '1px', backgroundColor: '#e8ddd5' }} />
                <ul className="space-y-2.5">
                  {cat.items.map(item => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-[#7a5c4f]">
                      <span className="shrink-0 mt-0.5 text-xs font-bold" style={{ color: '#c9a96e' }}>✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-14 text-center">
            <div style={{ width: '32px', height: '1px', backgroundColor: '#c9a96e' }} className="mx-auto mb-6" />
            <p className="text-[#7a5c4f] mb-6">
              Ready to experience these amenities for yourself?
            </p>
            <Link href="/rooms"
              style={{ backgroundColor: '#c9a96e', color: '#1a0e08' }}
              className="inline-block px-10 py-4 text-xs font-bold uppercase tracking-[0.25em] hover:opacity-90 transition-opacity">
              Browse Our Rooms
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}

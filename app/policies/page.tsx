import SiteNav from '@/components/SiteNav'
import Footer from '@/components/Footer'
import Link from 'next/link'

const SECTIONS = [
  {
    title: 'Check-in & Check-out',
    content: null,
    times: [
      { label: 'Check-in', time: '2:00 PM', note: 'Early check-in upon request, subject to availability.' },
      { label: 'Check-out', time: '12:00 PM', note: 'Late check-out may be arranged with additional charges.' },
    ],
  },
]

const POLICY_SECTIONS = [
  {
    title: 'Reservations & Payment',
    items: [
      'A deposit is required to confirm your reservation (amount varies by room type and length of stay).',
      'Accepted payment methods: Cash, credit/debit card, GCash.',
      'Rates are quoted in Philippine Peso (₱) per room, per night.',
      'Quoted rates are honored at the time of booking and are not subject to retroactive changes.',
      'Walk-in guests are welcome subject to room availability.',
    ],
  },
  {
    title: 'Cancellation Policy',
    items: [
      'Cancellations made 48 hours or more before check-in: full deposit refund.',
      'Cancellations within 48 hours of check-in: deposit is non-refundable.',
      'No-shows will be charged one night\'s stay.',
      'Early departures are charged for the full reserved stay.',
      'Changes to reservation dates must be requested at least 24 hours in advance and are subject to availability.',
    ],
  },
  {
    title: 'House Rules',
    items: [
      'Quiet hours: 10:00 PM to 7:00 AM. Please be considerate of other guests.',
      'Smoking is strictly prohibited in all indoor areas. Designated smoking areas are available outside.',
      'Pets are not permitted on the premises.',
      'Visitors to guest rooms must register at the front desk.',
      'Guests are responsible for any damage to hotel property during their stay.',
      'The hotel is not liable for loss of valuables not placed in the in-room safe.',
      'Illegal activities will result in immediate removal and may be reported to authorities.',
      'Please conserve electricity and water — turn off lights and AC when leaving your room.',
    ],
  },
  {
    title: 'Children & Extra Beds',
    items: [
      'Children of all ages are welcome at Cabalum Hotel.',
      'Children under 5 sharing a bed with parents stay free (no extra bedding).',
      'Rollaway beds and extra bedding may be requested at an additional charge, subject to availability.',
      'Maximum occupancy per room type applies regardless of guest age.',
    ],
  },
  {
    title: 'Food & Dining',
    items: [
      'Outside food and beverages may be consumed in guest rooms at the guest\'s discretion.',
      'Restaurant reservations are recommended for dinner service — contact the front desk.',
      'Room service charges are added to the guest folio and settled at check-out.',
      'Dietary needs and food allergies can be accommodated — please notify us in advance.',
    ],
  },
]

export default function PoliciesPage() {
  return (
    <>
      <SiteNav />

      {/* Header */}
      <section className="bg-[#2d1c14] py-16 px-6 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-[#8a6a5a] mb-3">House Policies</p>
        <h1 className="font-serif text-5xl text-[#f0e0d0]">Hotel Policies</h1>
        <div className="w-12 h-px bg-terra mx-auto mt-5" />
      </section>

      <main className="py-16 px-6">
        <div className="max-w-3xl mx-auto space-y-8">

          {/* Check-in / Check-out times */}
          <div className="bg-white border border-warm-border rounded-2xl p-6 space-y-5">
            <h2 className="font-serif text-2xl text-[#1a0e08]">Check-in &amp; Check-out</h2>
            <div style={{ width: '32px', height: '1px', backgroundColor: '#c9a96e' }} />
            <div className="grid grid-cols-2 gap-6">
              {[
                { label: 'Check-in Time', time: '2:00 PM', note: 'Early check-in on request, subject to availability.' },
                { label: 'Check-out Time', time: '12:00 PM', note: 'Late check-out may be arranged with additional charges.' },
              ].map(item => (
                <div key={item.label}>
                  <p className="text-[10px] uppercase tracking-widest text-[#9d8075] mb-1">{item.label}</p>
                  <p className="font-serif text-2xl font-semibold text-[#1a0e08] mb-2">{item.time}</p>
                  <p className="text-xs text-[#7a5c4f] leading-relaxed">{item.note}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Policy sections */}
          {POLICY_SECTIONS.map(section => (
            <div key={section.title} className="bg-white border border-warm-border rounded-2xl p-6 space-y-5">
              <h2 className="font-serif text-2xl text-[#1a0e08]">{section.title}</h2>
              <div style={{ width: '32px', height: '1px', backgroundColor: '#c9a96e' }} />
              <ul className="space-y-3">
                {section.items.map(item => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-[#7a5c4f]">
                    <span className="shrink-0 mt-0.5" style={{ color: '#c9a96e' }}>·</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact note */}
          <div className="text-center py-6">
            <p className="text-sm text-[#9d8075] mb-5">
              Have questions about our policies or need special arrangements?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact"
                style={{ borderColor: 'rgba(201,169,110,0.5)', color: '#c9a96e' }}
                className="border px-8 py-3 text-xs font-semibold uppercase tracking-[0.2em] hover:border-[#c9a96e] transition-colors">
                Contact Us
              </Link>
              <Link href="/faq"
                style={{ backgroundColor: '#c9a96e', color: '#1a0e08' }}
                className="px-8 py-3 text-xs font-bold uppercase tracking-[0.2em] hover:opacity-90 transition-opacity">
                View FAQ
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}

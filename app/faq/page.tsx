'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import SiteNav from '@/components/SiteNav'
import Footer from '@/components/Footer'
import Link from 'next/link'

interface FAQ {
  id: string
  question: string
  answer: string
  category: string
}

const HARDCODED: FAQ[] = [
  { id: 'h1', question: 'What time is check-in and check-out?', answer: 'Standard check-in is 2:00 PM and check-out is 12:00 PM (noon). Early check-in and late check-out may be arranged subject to availability — please contact the front desk in advance.', category: 'Policies' },
  { id: 'h2', question: 'Is breakfast included in the room rate?', answer: 'Room rates are on a room-only basis. Breakfast is available from our in-house restaurant from 6:00 AM to 10:00 AM. Guests may also order room service at any time during dining hours.', category: 'Dining' },
  { id: 'h3', question: 'Do you offer airport transfers?', answer: 'Yes, we can arrange transfers to and from Iloilo International Airport. Please contact our front desk at least 24 hours in advance to book.', category: 'Transportation' },
  { id: 'h4', question: 'Is Wi-Fi available throughout the hotel?', answer: 'Complimentary high-speed Wi-Fi is available in all guest rooms and public areas, including the lobby and restaurant.', category: 'Amenities' },
  { id: 'h5', question: 'What payment methods do you accept?', answer: 'We accept cash (Philippine Peso), major credit cards (Visa, Mastercard), GCash, and bank transfers. Full payment is required at check-in.', category: 'Policies' },
  { id: 'h6', question: 'What is your cancellation policy?', answer: 'Reservations cancelled 48 hours or more before the check-in date receive a full refund. Cancellations within 48 hours forfeit one night\'s deposit.', category: 'Policies' },
  { id: 'h7', question: 'Can I request an extra bed or cot?', answer: 'Extra beds and baby cots are available upon request, subject to room capacity limits. Additional charges may apply for extra beds.', category: 'Amenities' },
  { id: 'h8', question: 'Is the hotel pet-friendly?', answer: 'We are unable to accommodate pets in guest rooms. Service animals are welcome with proper documentation.', category: 'Policies' },
]

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [open, setOpen] = useState<string | null>(null)
  const [category, setCategory] = useState('All')

  useEffect(() => {
    const supabase = createClient()
    supabase.from('faqs')
      .select('id, question, answer, category')
      .eq('is_active', true)
      .order('sort_order')
      .then(({ data, error }) => {
        setFaqs(!error && data && data.length > 0 ? (data as FAQ[]) : HARDCODED)
      })
  }, [])

  const categories = ['All', ...Array.from(new Set(faqs.map(f => f.category)))]
  const visible = category === 'All' ? faqs : faqs.filter(f => f.category === category)

  return (
    <>
      <SiteNav />

      <section className="bg-[#2d1c14] py-16 px-6 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-[#8a6a5a] mb-3">Help & Information</p>
        <h1 className="font-serif text-5xl text-[#f0e0d0]">FAQ</h1>
        <div className="w-12 h-px bg-terra mx-auto mt-5" />
        <p className="text-[#9d8075] text-sm mt-4">Frequently asked questions about your stay at Cabalum Hotel.</p>
      </section>

      <main className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Category filter */}
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

          {/* Accordion */}
          <div className="space-y-2">
            {visible.map(faq => (
              <div key={faq.id} className="bg-white border border-warm-border rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpen(open === faq.id ? null : faq.id)}
                  className="w-full text-left px-5 py-4 flex items-center justify-between gap-3 hover:bg-[#fdf8f5] transition-colors"
                >
                  <span className="font-medium text-brown text-sm leading-snug">{faq.question}</span>
                  <span className={`text-terra text-lg shrink-0 transition-transform ${open === faq.id ? 'rotate-45' : ''}`}>+</span>
                </button>
                {open === faq.id && (
                  <div className="px-5 pb-5 pt-1 border-t border-warm-border">
                    <p className="text-sm text-brown-mid leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-10 pt-8 border-t border-warm-border">
            <p className="text-sm text-brown-mid mb-4">Still have a question?</p>
            <Link href="/contact"
              className="inline-block bg-terra text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-terra-dark transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}

'use client'
import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import SiteNav from '@/components/SiteNav'
import Footer from '@/components/Footer'

const CONTACT_INFO = [
  { icon: '📍', label: 'Address', value: 'Iloilo City, Iloilo\nPhilippines 5000' },
  { icon: '📞', label: 'Phone', value: '(033) 320-1234', href: 'tel:+63333201234' },
  { icon: '✉️', label: 'Email', value: 'info@cabalumhotel.ph', href: 'mailto:info@cabalumhotel.ph' },
  { icon: '🕐', label: 'Front Desk Hours', value: 'Open 24 hours, 7 days a week' },
]

const SUBJECTS = [
  'General Inquiry',
  'Room Reservation',
  'Group / Event Booking',
  'Restaurant Reservation',
  'Feedback / Complaint',
  'Other',
]

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  function set(field: string, val: string) {
    setForm(f => ({ ...f, [field]: val }))
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')
    setErrorMsg('')
    const supabase = createClient()
    const { error } = await supabase.from('contact_inquiries').insert({
      name: form.name,
      email: form.email,
      phone: form.phone || null,
      subject: form.subject || null,
      message: form.message,
    })
    if (error) {
      setErrorMsg(error.message)
      setStatus('error')
    } else {
      setStatus('sent')
    }
  }

  return (
    <>
      <SiteNav />

      <section className="bg-[#2d1c14] py-16 px-6 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-[#8a6a5a] mb-3">Get in Touch</p>
        <h1 className="font-serif text-5xl text-[#f0e0d0]">Contact Us</h1>
        <div className="w-12 h-px bg-terra mx-auto mt-5" />
      </section>

      <main className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10">

            {/* Contact info */}
            <div className="md:col-span-2">
              <h2 className="font-serif text-2xl text-brown mb-6">Hotel Information</h2>
              <div className="space-y-5">
                {CONTACT_INFO.map(c => (
                  <div key={c.label} className="flex gap-3">
                    <span className="text-xl shrink-0 mt-0.5">{c.icon}</span>
                    <div>
                      <p className="text-xs uppercase tracking-widest text-brown-light mb-1">{c.label}</p>
                      {c.href ? (
                        <a href={c.href} className="text-sm text-brown hover:text-terra transition-colors">{c.value}</a>
                      ) : (
                        <p className="text-sm text-brown whitespace-pre-line">{c.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-5 bg-[#f5ede4] rounded-xl border border-warm-border">
                <p className="text-xs uppercase tracking-widest text-terra mb-2">Quick Booking</p>
                <p className="text-sm text-brown-mid mb-4 leading-relaxed">
                  Ready to book your stay? Create a free guest account to check availability and reserve instantly.
                </p>
                <Link href="/signup"
                  className="inline-block bg-terra text-white text-sm px-5 py-2 rounded-lg hover:bg-terra-dark transition-colors font-medium">
                  Reserve a Room
                </Link>
              </div>

              <div className="mt-4 p-5 bg-[#f5ede4] rounded-xl border border-warm-border">
                <p className="text-xs uppercase tracking-widest text-terra mb-2">Already a Guest?</p>
                <p className="text-sm text-brown-mid mb-4 leading-relaxed">
                  Sign in to your guest account to send a support ticket to our front desk team and track their reply.
                </p>
                <a href={`${process.env.NEXT_PUBLIC_PORTAL_URL ?? ''}/guest/support`}
                  className="inline-block border border-terra text-terra text-sm px-5 py-2 rounded-lg hover:bg-terra hover:text-white transition-colors font-medium">
                  Open Support Ticket
                </a>
              </div>
            </div>

            {/* Contact form */}
            <div className="md:col-span-3">
              <h2 className="font-serif text-2xl text-brown mb-6">Send a Message</h2>

              {status === 'sent' ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
                  <p className="text-3xl mb-3">✅</p>
                  <h3 className="font-serif text-xl text-green-800 mb-2">Message Sent!</h3>
                  <p className="text-sm text-green-700">
                    Thank you for reaching out. Our team will get back to you within 24 hours.
                  </p>
                  <button onClick={() => { setStatus('idle'); setForm({ name: '', email: '', phone: '', subject: '', message: '' }) }}
                    className="mt-4 text-sm text-green-700 hover:underline">
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={submit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-brown-light mb-1.5">Full Name *</label>
                      <input required value={form.name} onChange={e => set('name', e.target.value)}
                        className="w-full border border-warm-border rounded-lg px-3 py-2.5 text-sm text-brown focus:outline-none focus:ring-2 focus:ring-terra bg-white"
                        placeholder="Juan dela Cruz" />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-brown-light mb-1.5">Email Address *</label>
                      <input required type="email" value={form.email} onChange={e => set('email', e.target.value)}
                        className="w-full border border-warm-border rounded-lg px-3 py-2.5 text-sm text-brown focus:outline-none focus:ring-2 focus:ring-terra bg-white"
                        placeholder="you@email.com" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-brown-light mb-1.5">Phone Number</label>
                      <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)}
                        className="w-full border border-warm-border rounded-lg px-3 py-2.5 text-sm text-brown focus:outline-none focus:ring-2 focus:ring-terra bg-white"
                        placeholder="+63 9XX XXX XXXX" />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-brown-light mb-1.5">Subject</label>
                      <select value={form.subject} onChange={e => set('subject', e.target.value)}
                        className="w-full border border-warm-border rounded-lg px-3 py-2.5 text-sm text-brown focus:outline-none focus:ring-2 focus:ring-terra bg-white">
                        <option value="">— Select —</option>
                        {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-brown-light mb-1.5">Message *</label>
                    <textarea required rows={5} value={form.message} onChange={e => set('message', e.target.value)}
                      className="w-full border border-warm-border rounded-lg px-3 py-2.5 text-sm text-brown focus:outline-none focus:ring-2 focus:ring-terra bg-white resize-none"
                      placeholder="How can we help you?" />
                  </div>

                  {status === 'error' && (
                    <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">{errorMsg}</p>
                  )}

                  <button type="submit" disabled={status === 'sending'}
                    className="bg-terra text-white px-8 py-3 rounded-lg text-sm font-medium hover:bg-terra-dark transition-colors disabled:opacity-50 w-full sm:w-auto">
                    {status === 'sending' ? 'Sending…' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}

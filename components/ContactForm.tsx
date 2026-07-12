'use client'
import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

const SUBJECTS = [
  'General Inquiry',
  'Room Reservation',
  'Group / Event Booking',
  'Restaurant Reservation',
  'Feedback / Complaint',
  'Other',
]

export default function ContactForm() {
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
    if (error) { setErrorMsg(error.message); setStatus('error') }
    else setStatus('sent')
  }

  if (status === 'sent') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
        <p className="text-3xl mb-3">✅</p>
        <h3 className="font-serif text-xl text-green-800 mb-2">Message Sent!</h3>
        <p className="text-sm text-green-700">Thank you for reaching out. Our team will get back to you within 24 hours.</p>
        <button onClick={() => { setStatus('idle'); setForm({ name: '', email: '', phone: '', subject: '', message: '' }) }}
          className="mt-4 text-sm text-green-700 hover:underline">
          Send another message
        </button>
      </div>
    )
  }

  return (
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
  )
}

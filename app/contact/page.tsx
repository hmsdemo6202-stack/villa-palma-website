import SiteNav from '@/components/SiteNav'
import Footer from '@/components/Footer'
import ContactForm from '@/components/ContactForm'
import Link from 'next/link'
import { getSiteSettings } from '@/lib/supabase/siteSettings'

export default async function ContactPage() {
  const s = await getSiteSettings(['contact_phone', 'contact_email', 'contact_address'])
  const phone   = s['contact_phone']   || '(033) 337 2536'
  const email   = s['contact_email']   || '1945cwc@gmail.com'
  const address = s['contact_address'] || 'Dr. Fermin Caram Ave. Sr., Iznart St.\nIloilo City, Iloilo 5000'

  const CONTACT_INFO = [
    { icon: '📍', label: 'Address',          value: address,   href: undefined },
    { icon: '📞', label: 'Phone',            value: phone,     href: `tel:${phone.replace(/\D/g, '')}` },
    { icon: '✉️', label: 'Email',            value: email,     href: `mailto:${email}` },
    { icon: '🕐', label: 'Front Desk Hours', value: 'Open 24 hours, 7 days a week', href: undefined },
  ]

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
                <p className="text-sm text-brown-mid leading-relaxed">
                  Sign in to the Cabalum Hotel app to send a support ticket to our front desk team and track their reply.
                </p>
              </div>
            </div>

            {/* Contact form (client component) */}
            <div className="md:col-span-3">
              <h2 className="font-serif text-2xl text-brown mb-6">Send a Message</h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}

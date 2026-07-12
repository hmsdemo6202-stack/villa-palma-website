import SiteNav from '@/components/SiteNav'
import Footer from '@/components/Footer'
import Link from 'next/link'

const TEAM = [
  {
    role: 'Owner & CEO',
    name: 'George Michael L. Cabalum',
    desc: 'With a passion for genuine Filipino hospitality, Mr. Cabalum founded Cabalum Hotel to create a space where every guest feels truly at home in the heart of Iloilo City.',
  },
  {
    role: 'General Manager',
    name: 'Front Office Team',
    desc: 'Our dedicated management team oversees every aspect of your stay — from seamless check-in to personalized room preferences and round-the-clock assistance.',
  },
  {
    role: 'Head Chef',
    name: 'Kitchen & Dining Team',
    desc: 'Our culinary team crafts Filipino and international dishes using fresh local ingredients, served in the comfort of our in-house restaurant or delivered to your room.',
  },
]

const VALUES = [
  { icon: '🏡', title: 'Warm Welcome', desc: 'Every guest is greeted as family. From arrival to departure, we ensure you feel at home in Iloilo City.' },
  { icon: '✨', title: 'Genuine Quality', desc: 'Clean, comfortable, and thoughtfully furnished rooms at rates that are honest and accessible to everyone.' },
  { icon: '🤝', title: 'Honest Service', desc: 'We believe great service isn\'t about luxury extras — it\'s about attentiveness, reliability, and following through.' },
  { icon: '🌺', title: 'Local Pride', desc: 'We celebrate Iloilo\'s culture and warmth in everything we do, from our cuisine to the way we treat every guest.' },
]

export default function AboutPage() {
  return (
    <>
      <SiteNav />

      {/* Page header */}
      <section className="bg-[#2d1c14] py-16 px-6 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-[#8a6a5a] mb-3">Our Story</p>
        <h1 className="font-serif text-5xl text-[#f0e0d0]">About Us</h1>
        <div className="w-12 h-px bg-terra mx-auto mt-5" />
      </section>

      {/* Story section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs uppercase tracking-widest text-terra mb-3">Who We Are</p>
              <h2 className="font-serif text-3xl text-brown mb-5 leading-tight">A Place to Feel at Home in Iloilo City</h2>
              <div className="space-y-4 text-sm text-brown-mid leading-relaxed">
                <p>
                  Cabalum Hotel was founded on a simple belief: that every traveler — whether here for business, leisure, or family — deserves a clean, comfortable, and welcoming place to rest.
                </p>
                <p>
                  Located in Iloilo City, Philippines, we offer a range of room types to suit solo travelers, couples, families, and groups. From our economy Single Rooms starting at just ₱799 per night to the exclusive Presidential Suite, we ensure every guest finds exactly what they need.
                </p>
                <p>
                  Our in-house restaurant serves Filipino favorites and international dishes throughout the day. Our staff is always nearby — ready to assist with room service, local recommendations, or transport arrangements.
                </p>
              </div>
            </div>
            <div className="relative h-72 md:h-full min-h-64 rounded-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80"
                alt="Cabalum Hotel lobby"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-6 bg-[#f5ede4]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-widest text-terra mb-2">What We Stand For</p>
            <h2 className="font-serif text-3xl text-brown">Our Values</h2>
            <div className="w-10 h-px bg-terra mx-auto mt-4" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {VALUES.map(v => (
              <div key={v.title} className="bg-white rounded-2xl border border-warm-border p-6">
                <div className="text-3xl mb-3">{v.icon}</div>
                <h3 className="font-serif text-lg text-brown mb-2">{v.title}</h3>
                <p className="text-sm text-brown-mid leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-widest text-terra mb-2">The People Behind the Hotel</p>
            <h2 className="font-serif text-3xl text-brown">Our Team</h2>
            <div className="w-10 h-px bg-terra mx-auto mt-4" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TEAM.map(t => (
              <div key={t.role} className="text-center border border-warm-border rounded-2xl p-6 bg-white">
                <div className="w-16 h-16 rounded-full bg-[#f5ede4] border border-[#e8ddd5] flex items-center justify-center mx-auto mb-4">
                  <span className="font-serif text-2xl text-terra">{t.name[0]}</span>
                </div>
                <p className="text-xs uppercase tracking-widest text-terra mb-1">{t.role}</p>
                <h3 className="font-serif text-base text-brown mb-3">{t.name}</h3>
                <p className="text-xs text-brown-mid leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="py-16 px-6 bg-[#2d1c14]">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs uppercase tracking-widest text-[#8a6a5a] mb-3">Find Us</p>
          <h2 className="font-serif text-3xl text-[#f0e0d0] mb-5">Iloilo City, Philippines</h2>
          <p className="text-[#9d8075] text-sm leading-relaxed mb-8 max-w-lg mx-auto">
            Conveniently located in Iloilo City, we are accessible from Iloilo International Airport and near the city&apos;s key landmarks, shopping centers, and heritage sites.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:+63333201234"
              className="inline-block border border-[#5a3a2a] text-[#c8a898] px-6 py-3 rounded-lg text-sm hover:border-[#8a6a5a] transition-colors">
              📞 (033) 320-1234
            </a>
            <a href="mailto:info@cabalumhotel.ph"
              className="inline-block border border-[#5a3a2a] text-[#c8a898] px-6 py-3 rounded-lg text-sm hover:border-[#8a6a5a] transition-colors">
              ✉ info@cabalumhotel.ph
            </a>
            <Link href="/signup"
              className="inline-block bg-terra text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-terra-dark transition-colors">
              Book a Room
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}

import Link from 'next/link'

const PORTAL_URL = process.env.NEXT_PUBLIC_PORTAL_URL ?? ''

export default function Footer() {
  return (
    <footer className="bg-[#2d1c14] text-[#8a6a5a] mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <p className="font-serif text-sm tracking-[0.2em] text-[#f0e0d0] uppercase font-bold mb-3">Villa Palma</p>
            <p className="text-sm leading-relaxed">A boutique hotel experience crafted for those who appreciate the finer things.</p>
          </div>

          {/* Links */}
          <div>
            <p className="text-xs uppercase tracking-widest text-[#5a3a2a] mb-3 font-medium">Explore</p>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-[#c8a898] transition-colors">Home</Link></li>
              <li><Link href="/rooms" className="hover:text-[#c8a898] transition-colors">Our Rooms</Link></li>
              <li><Link href="/#experience" className="hover:text-[#c8a898] transition-colors">Dining & Experience</Link></li>
              <li><a href={`${PORTAL_URL}/signup`} className="hover:text-[#c8a898] transition-colors">Book a Stay</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs uppercase tracking-widest text-[#5a3a2a] mb-3 font-medium">Contact</p>
            <ul className="space-y-2 text-sm">
              <li>123 Palma Street, Makati City</li>
              <li>Metro Manila, Philippines</li>
              <li className="pt-1">
                <a href="mailto:hello@villapalma.ph" className="hover:text-[#c8a898] transition-colors">hello@villapalma.ph</a>
              </li>
              <li>+63 2 8888 0000</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[#3d2418] flex flex-col md:flex-row justify-between items-center gap-3 text-xs">
          <p>&copy; {new Date().getFullYear()} Villa Palma. All rights reserved.</p>
          <div className="flex gap-5">
            <a href={`${PORTAL_URL}/login`} className="hover:text-[#c8a898] transition-colors">Guest Portal</a>
            <span>·</span>
            <span>Privacy Policy</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

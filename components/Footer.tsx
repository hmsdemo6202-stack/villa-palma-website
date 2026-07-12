import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#2d1c14] text-[#8a6a5a] mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <p className="font-serif text-sm tracking-[0.2em] text-[#f0e0d0] uppercase font-bold mb-3">Cabalum Hotel</p>
            <p className="text-sm leading-relaxed mb-4">
              A boutique hotel in the heart of Iloilo City, crafted for guests who appreciate comfort, warmth, and attentive service.
            </p>
            <p className="text-xs text-[#5a3a2a] uppercase tracking-widest font-medium">Owned &amp; Operated by</p>
            <p className="text-sm text-[#c8a898] mt-1">George Michael L. Cabalum</p>
          </div>

          {/* Explore */}
          <div>
            <p className="text-xs uppercase tracking-widest text-[#5a3a2a] mb-3 font-medium">Explore</p>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-[#c8a898] transition-colors">Home</Link></li>
              <li><Link href="/rooms" className="hover:text-[#c8a898] transition-colors">Our Rooms</Link></li>
              <li><Link href="/restaurant" className="hover:text-[#c8a898] transition-colors">Restaurant</Link></li>
              <li><Link href="/gallery" className="hover:text-[#c8a898] transition-colors">Gallery</Link></li>
              <li><Link href="/promotions" className="hover:text-[#c8a898] transition-colors">Promotions</Link></li>
              <li><Link href="/about" className="hover:text-[#c8a898] transition-colors">About Us</Link></li>
              <li><Link href="/amenities" className="hover:text-[#c8a898] transition-colors">Amenities</Link></li>
              <li><Link href="/policies" className="hover:text-[#c8a898] transition-colors">Policies</Link></li>
              <li><Link href="/faq" className="hover:text-[#c8a898] transition-colors">FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-[#c8a898] transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs uppercase tracking-widest text-[#5a3a2a] mb-3 font-medium">Contact Us</p>
            <ul className="space-y-2 text-sm">
              <li className="leading-snug">Iloilo City, Iloilo<br />Philippines 5000</li>
              <li className="pt-1">
                <a href="tel:+63333201234" className="hover:text-[#c8a898] transition-colors">(033) 320-1234</a>
              </li>
              <li>
                <a href="mailto:info@cabalumhotel.ph" className="hover:text-[#c8a898] transition-colors">info@cabalumhotel.ph</a>
              </li>
              <li className="pt-2">
                <Link href="/rooms" className="inline-block bg-terra text-white text-xs px-4 py-2 rounded-lg hover:bg-terra-dark transition-colors font-medium">
                  Book a Room
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[#3d2418] flex flex-col md:flex-row justify-between items-center gap-3 text-xs">
          <p>&copy; {new Date().getFullYear()} Cabalum Hotel. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="/faq" className="hover:text-[#c8a898] transition-colors">FAQ</Link>
            <span>·</span>
            <Link href="/contact" className="hover:text-[#c8a898] transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

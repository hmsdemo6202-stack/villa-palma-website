import SiteNav from '@/components/SiteNav'

export default function Loading() {
  return (
    <>
      <SiteNav />
      <section className="bg-[#2d1c14] py-16 px-6 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-[#8a6a5a] mb-3">Get in Touch</p>
        <h1 className="font-serif text-5xl text-[#f0e0d0]">Contact Us</h1>
        <div className="w-12 h-px bg-terra mx-auto mt-5" />
      </section>
      <main className="py-16 px-6 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-pulse">
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-12 bg-cream-dark rounded-lg" />
            ))}
          </div>
          <div className="space-y-3">
            <div className="h-4 bg-cream-dark rounded w-1/2" />
            <div className="h-4 bg-cream-dark rounded w-2/3" />
            <div className="h-4 bg-cream-dark rounded w-1/2" />
          </div>
        </div>
      </main>
    </>
  )
}

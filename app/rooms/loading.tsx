import SiteNav from '@/components/SiteNav'

export default function Loading() {
  return (
    <>
      <SiteNav />
      <section className="bg-[#2d1c14] py-16 px-6 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-[#8a6a5a] mb-3">Accommodations</p>
        <h1 className="font-serif text-5xl text-[#f0e0d0]">Our Rooms</h1>
        <div className="w-12 h-px bg-terra mx-auto mt-5" />
      </section>

      <div className="bg-[#f5ede4] border-b border-warm-border px-6 py-6">
        <div className="max-w-5xl mx-auto">
          <div className="h-10 bg-cream-dark rounded-lg animate-pulse w-full" />
        </div>
      </div>

      <main className="py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-warm-border overflow-hidden animate-pulse">
                <div className="h-48 bg-cream-dark" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-cream-dark rounded w-3/4" />
                  <div className="h-3 bg-cream-dark rounded w-1/2" />
                  <div className="h-3 bg-cream-dark rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  )
}

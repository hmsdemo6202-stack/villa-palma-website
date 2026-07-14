import SiteNav from '@/components/SiteNav'

export default function Loading() {
  return (
    <>
      <SiteNav />
      <section className="bg-[#2d1c14] py-16 px-6 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-[#8a6a5a] mb-3">Special Offers</p>
        <h1 className="font-serif text-5xl text-[#f0e0d0]">Promotions</h1>
        <div className="w-12 h-px bg-terra mx-auto mt-5" />
      </section>
      <main className="py-12 px-6 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-warm-border overflow-hidden animate-pulse">
              <div className="h-48 bg-cream-dark" />
              <div className="p-6 space-y-3">
                <div className="h-5 bg-cream-dark rounded w-3/4" />
                <div className="h-3 bg-cream-dark rounded w-full" />
                <div className="h-3 bg-cream-dark rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  )
}

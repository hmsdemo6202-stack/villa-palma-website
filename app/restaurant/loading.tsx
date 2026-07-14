import SiteNav from '@/components/SiteNav'

export default function Loading() {
  return (
    <>
      <SiteNav />
      <section className="bg-[#2d1c14] py-16 px-6 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-[#8a6a5a] mb-3">In-House Dining</p>
        <h1 className="font-serif text-5xl text-[#f0e0d0]">Restaurant & Bar</h1>
        <div className="w-12 h-px bg-terra mx-auto mt-5" />
      </section>
      <main className="py-12 px-6 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-warm-border overflow-hidden animate-pulse">
              <div className="h-40 bg-cream-dark" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-cream-dark rounded w-2/3" />
                <div className="h-3 bg-cream-dark rounded w-full" />
                <div className="h-3 bg-cream-dark rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  )
}

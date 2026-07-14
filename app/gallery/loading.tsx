import SiteNav from '@/components/SiteNav'

export default function Loading() {
  return (
    <>
      <SiteNav />
      <section className="bg-[#2d1c14] py-16 px-6 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-[#8a6a5a] mb-3">Visual Tour</p>
        <h1 className="font-serif text-5xl text-[#f0e0d0]">Gallery</h1>
        <div className="w-12 h-px bg-terra mx-auto mt-5" />
      </section>
      <main className="py-12 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="aspect-square bg-cream-dark rounded-xl animate-pulse" />
          ))}
        </div>
      </main>
    </>
  )
}

import SiteNav from '@/components/SiteNav'

export default function Loading() {
  return (
    <>
      <SiteNav />
      <section className="bg-[#2d1c14] py-16 px-6 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-[#8a6a5a] mb-3">Our Story</p>
        <h1 className="font-serif text-5xl text-[#f0e0d0]">About Us</h1>
        <div className="w-12 h-px bg-terra mx-auto mt-5" />
      </section>
      <main className="py-16 px-6 max-w-4xl mx-auto space-y-8">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse space-y-3">
            <div className="h-5 bg-cream-dark rounded w-1/3" />
            <div className="h-3 bg-cream-dark rounded w-full" />
            <div className="h-3 bg-cream-dark rounded w-full" />
            <div className="h-3 bg-cream-dark rounded w-3/4" />
          </div>
        ))}
      </main>
    </>
  )
}

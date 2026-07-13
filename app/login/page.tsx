'use client'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import SiteNav from '@/components/SiteNav'
import Footer from '@/components/Footer'
import { Suspense } from 'react'

function LoginContent() {
  const router = useRouter()
  const sp = useSearchParams()
  const redirectTo = sp.get('redirect') ?? '/'

  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [loading,  setLoading]  = useState(false)
  const [checking, setChecking] = useState(true)
  const [error,    setError]    = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) router.replace(redirectTo)
      else setChecking(false)
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error: signInErr } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })

    setLoading(false)
    if (signInErr) {
      setError(signInErr.message)
      return
    }

    router.push(redirectTo)
  }

  if (checking) {
    return (
      <>
        <SiteNav />
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-terra border-t-transparent rounded-full animate-spin" />
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <SiteNav />

      <section className="bg-[#2d1c14] py-16 px-6 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-[#8a6a5a] mb-3">Welcome Back</p>
        <h1 className="font-serif text-5xl text-[#f0e0d0]">Sign In</h1>
        <div className="w-12 h-px bg-terra mx-auto mt-5" />
      </section>

      <main className="flex-1 py-16 px-6">
        <div className="max-w-sm mx-auto">

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-[#9d8075] mb-2">Email</label>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="w-full border border-warm-border rounded-lg px-4 py-3 text-sm text-brown focus:outline-none focus:ring-2 focus:ring-terra"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest text-[#9d8075] mb-2">Password</label>
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Your password"
                className="w-full border border-warm-border rounded-lg px-4 py-3 text-sm text-brown focus:outline-none focus:ring-2 focus:ring-terra"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-terra text-white py-3.5 rounded-lg font-medium hover:bg-terra-dark disabled:opacity-50 transition-colors mt-2"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 text-center space-y-3">
            <p className="text-sm text-brown-mid">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-terra hover:underline font-medium">
                Create one free
              </Link>
            </p>
          </div>

        </div>
      </main>

      <Footer />
    </>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <>
        <SiteNav />
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-terra border-t-transparent rounded-full animate-spin" />
        </div>
        <Footer />
      </>
    }>
      <LoginContent />
    </Suspense>
  )
}
